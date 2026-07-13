import { NextResponse } from "next/server";
import { getCache } from "@vercel/functions";
import { getSession } from "@/lib/session";

const FORTYTWO_API_BASE = "https://api.intra.42.fr/v2";

interface FortyTwoUser {
  id: number;
  login: string;
  displayname: string;
  image: {
    link: string;
    versions: {
      large: string;
      medium: string;
      small: string;
      micro: string;
    };
  } | null;
  pool_month: string;
  pool_year: string;
  "active?": boolean;
  level?: number;
  validatedPool?: boolean;
}

interface CursusUser {
  user: { id: number };
  cursus_id: number;
  level: number;
}

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

const PAGE_SIZE = 50;

type CachedPool = { poolMonth: string; poolYear: string; users: { level: number }[] };

function paginate(data: CachedPool, page: number, minLevel: number | null, maxLevel: number | null) {
  const users = (minLevel === null && maxLevel === null)
    ? data.users
    : data.users.filter((u) => (minLevel === null || u.level >= minLevel) && (maxLevel === null || u.level <= maxLevel));
  const start = (page - 1) * PAGE_SIZE;
  return {
    poolMonth: data.poolMonth,
    poolYear: data.poolYear,
    total: users.length,
    users: users.slice(start, start + PAGE_SIZE),
    hasMore: start + PAGE_SIZE < users.length,
  };
}

// Shared across function instances/regions via Vercel Runtime Cache (was an in-memory Map before)
const cache = getCache({ namespace: "pool" });
const CACHE_TTL = 5 * 60 * 1000; // freshness window (ms)
const CACHE_STORE_SECONDS = 60 * 60; // how long an entry stays available as a stale-on-error fallback

// 42 API rate-limits hard (2 req/s); retry on 429 instead of failing the whole request
async function ftFetch(url: string, token: string): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status !== 429 || attempt >= 3) return res;
    const wait = Number(res.headers.get("retry-after")) || 1;
    await new Promise((r) => setTimeout(r, wait * 1000));
  }
}

// Most recent pool that has users on this campus
async function latestPool(campusId: number, token: string): Promise<{ month: string; year: string } | null> {
  const params = new URLSearchParams({
    "filter[primary_campus_id]": campusId.toString(),
    "sort": "-pool_year,-created_at",
    "page[size]": "50",
  });
  const res = await ftFetch(`${FORTYTWO_API_BASE}/users?${params}`, token);
  if (!res.ok) return null;
  const users: FortyTwoUser[] = await res.json();
  const withPool = users.filter((u) => u.pool_month && u.pool_year);
  if (withPool.length === 0) return null;
  const year = withPool.reduce((max, u) => (u.pool_year > max ? u.pool_year : max), "");
  // ponytail: latest month found within the first 50 users of the newest year; good enough
  const month = withPool
    .filter((u) => u.pool_year === year)
    .reduce((max, u) => (MONTHS.indexOf(u.pool_month) > MONTHS.indexOf(max) ? u.pool_month : max), "january");
  return { month, year };
}

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  let poolMonth = searchParams.get("month") || "";
  let poolYear = searchParams.get("year") || "";
  const pageNum = Math.max(1, Number(searchParams.get("page")) || 1);
  const minLevel = searchParams.has("minLevel") ? Number(searchParams.get("minLevel")) : null;
  const maxLevel = searchParams.has("maxLevel") ? Number(searchParams.get("maxLevel")) : null;
  const campusId = Number(searchParams.get("campus_id")) || session.campusId;

  // Default to the campus's most recent pool
  if (!poolMonth || !poolYear) {
    const latestKey = `latest-${campusId}`;
    const cachedLatest = (await cache.get(latestKey)) as { time: number; data: unknown } | null;
    let latest = cachedLatest && Date.now() - cachedLatest.time < CACHE_TTL
      ? (cachedLatest.data as { month: string; year: string })
      : null;
    if (!latest) {
      latest = await latestPool(campusId, session.accessToken);
      if (latest) {
        await cache.set(latestKey, { time: Date.now(), data: latest }, { ttl: CACHE_STORE_SECONDS, tags: [`campus-${campusId}`] });
      }
    }
    poolMonth = latest?.month || (campusId === session.campusId ? session.poolMonth : "") || "";
    poolYear = latest?.year || (campusId === session.campusId ? session.poolYear : "") || "";
  }

  if (!poolMonth || !poolYear) {
    return NextResponse.json({ error: "No pool info found for this campus" }, { status: 400 });
  }

  const cacheKey = `${campusId}-${poolMonth}-${poolYear}`;
  const cached = (await cache.get(cacheKey)) as { time: number; data: unknown } | null;
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return NextResponse.json(paginate(cached.data as CachedPool, pageNum, minLevel, maxLevel));
  }

  try {
    // Fetch all users from the same pool (month + year) and campus
    // The 42 API supports filtering and pagination (max 100 per page)
    const allUsers: FortyTwoUser[] = [];
    let page = 1;
    const perPage = 100;
    let hasMore = true;

    while (hasMore) {
      const params = new URLSearchParams({
        "filter[pool_month]": poolMonth,
        "filter[pool_year]": poolYear,
        "filter[primary_campus_id]": campusId.toString(),
        "page[size]": perPage.toString(),
        "page[number]": page.toString(),
        "sort": "login",
      });

      const response = await ftFetch(`${FORTYTWO_API_BASE}/users?${params}`, session.accessToken);

      if (!response.ok) {
        if (response.status === 401) {
          return NextResponse.json({ error: "Token expired. Please sign in again." }, { status: 401 });
        }
        console.error("42 API error:", response.status, await response.text());
        throw new Error("Failed to fetch pool users");
      }

      const users: FortyTwoUser[] = await response.json();

      // Fetch cursus_users for these users to get level and validation status
      if (users.length > 0) {
        const userIds = users.map((u) => u.id).join(",");
        let cuPage = 1;
        let cuHasMore = true;
        const currentCursusUsers: CursusUser[] = [];

        while (cuHasMore) {
          const cuParams = new URLSearchParams({
            "filter[user_id]": userIds,
            "page[size]": "100",
            "page[number]": cuPage.toString(),
          });
          const cuRes = await ftFetch(`${FORTYTWO_API_BASE}/cursus_users?${cuParams}`, session.accessToken);

          if (!cuRes.ok) {
            console.error("Cursus users fetch error:", cuRes.status);
            break; // Don't fail the whole request, just proceed with what we have
          }

          const cuData: CursusUser[] = await cuRes.json();
          currentCursusUsers.push(...cuData);
          if (cuData.length < 100) cuHasMore = false;
          else cuPage++;
        }

        // Map level and validated status back to the users
        users.forEach((u) => {
          const userCursus = currentCursusUsers.filter((c) => c.user.id === u.id);
          // Assuming cursus 9 is C Piscine, 3 is Discovery. Anything else (like 21) is main cursus.
          const mainCursus = userCursus.find((c) => c.cursus_id !== 9 && c.cursus_id !== 3);
          const poolCursus = userCursus.find((c) => c.cursus_id === 9 || c.cursus_id === 3);

          u.level = poolCursus ? poolCursus.level : 0;
          u.validatedPool = !!mainCursus || userCursus.length > 1;
        });
      }

      allUsers.push(...users);

      // If we got fewer results than the page size, no more pages
      if (users.length < perPage) {
        hasMore = false;
      } else {
        page++;
        // Safety: cap at 10 pages (1000 users) to avoid runaway requests
        if (page > 10) hasMore = false;
      }
    }

    // Map to a simpler format for the frontend
    const poolUsers = allUsers.map((user) => ({
      id: user.id,
      login: user.login,
      displayname: user.displayname,
      imageUrl: user.image?.link || null,
      poolYear: poolYear,
      poolMonth: poolMonth,
      level: user.level || 0,
      campusId: campusId,
      validatedPool: !!user.validatedPool,
    }));

    poolUsers.sort((a, b) => b.level - a.level);

    const fullPool: CachedPool = { poolMonth, poolYear, users: poolUsers };
    await cache.set(cacheKey, { time: Date.now(), data: fullPool }, { ttl: CACHE_STORE_SECONDS, tags: [`campus-${campusId}`] });
    return NextResponse.json(paginate(fullPool, pageNum, minLevel, maxLevel));
  } catch (err) {
    console.error("Pool users fetch error:", err);
    // Serve the last successful result (even stale) rather than an error
    if (cached) return NextResponse.json(paginate(cached.data as CachedPool, pageNum, minLevel, maxLevel));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

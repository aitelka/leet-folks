import "server-only";
import { getCache } from "@vercel/functions";

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

export interface PoolUser {
  id: number;
  login: string;
  displayname: string;
  imageUrl: string | null;
  poolYear: string;
  poolMonth: string;
  level: number;
  campusId: number;
  validatedPool: boolean;
}

export type PoolPageResult =
  | { ok: true; poolMonth: string; poolYear: string; total: number; users: PoolUser[]; hasMore: boolean }
  | { ok: false; error: string; status: number };

function paginate(data: CachedPool, page: number, minLevel: number | null, maxLevel: number | null): PoolPageResult {
  const users = (minLevel === null && maxLevel === null)
    ? data.users
    : data.users.filter((u) => (minLevel === null || u.level >= minLevel) && (maxLevel === null || u.level <= maxLevel));
  const start = (page - 1) * PAGE_SIZE;
  return {
    ok: true,
    poolMonth: data.poolMonth,
    poolYear: data.poolYear,
    total: users.length,
    users: users.slice(start, start + PAGE_SIZE) as PoolUser[],
    hasMore: start + PAGE_SIZE < users.length,
  };
}

// Shared across function instances/regions via Vercel Runtime Cache (was an in-memory Map before)
const cache = getCache({ namespace: "pool" });
// Matches the cron schedule in vercel.json (every 4h). Within this window a cached
// entry is considered fresh, so a user request never triggers a live 42 API call
// itself — only the cron job (with an app-level token) does.
const CACHE_TTL = 4 * 60 * 60 * 1000; // freshness window (ms)
const CACHE_STORE_SECONDS = 24 * 60 * 60; // how long an entry stays available as a stale-on-error fallback, in case the cron misses a run

// Registry of campus/pool combos that have actually been viewed, so the cron job
// (src/app/api/cron/refresh-pools) knows what to keep warm instead of guessing
// every campus. Entries expire after a month of disuse.
const TRACKED_KEY = "tracked:pools";
const TRACKED_LATEST_KEY = "tracked:latest";
const TRACKED_TTL_SECONDS = 30 * 24 * 60 * 60;
const MAX_TRACKED = 300;

async function trackPool(campusId: number, poolMonth: string, poolYear: string) {
  const key = `${campusId}-${poolMonth}-${poolYear}`;
  const existing = ((await cache.get(TRACKED_KEY)) as string[] | null) || [];
  const next = [...existing.filter((k) => k !== key), key].slice(-MAX_TRACKED);
  await cache.set(TRACKED_KEY, next, { ttl: TRACKED_TTL_SECONDS });
}

async function trackLatest(campusId: number) {
  const existing = ((await cache.get(TRACKED_LATEST_KEY)) as number[] | null) || [];
  const next = [...existing.filter((id) => id !== campusId), campusId].slice(-MAX_TRACKED);
  await cache.set(TRACKED_LATEST_KEY, next, { ttl: TRACKED_TTL_SECONDS });
}

export async function getTrackedPools(): Promise<{ pools: string[]; latestCampusIds: number[] }> {
  const pools = ((await cache.get(TRACKED_KEY)) as string[] | null) || [];
  const latestCampusIds = ((await cache.get(TRACKED_LATEST_KEY)) as number[] | null) || [];
  return { pools, latestCampusIds };
}

// 42 API rate-limits hard (2 req/s). Space out requests proactively so we rarely
// hit 429 in the first place, and still retry (with backoff) if we do.
const MIN_REQUEST_GAP_MS = 550; // keeps us under 2 req/s with some margin
let lastRequestAt = 0;

async function throttle() {
  const wait = lastRequestAt + MIN_REQUEST_GAP_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestAt = Date.now();
}

async function ftFetch(url: string, token: string): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    await throttle();
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status !== 429 || attempt >= 5) return res;
    const wait = Number(res.headers.get("retry-after")) || attempt + 1;
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

class UnauthorizedError extends Error {}

// Fetches every user (+level/validation) for one campus/pool combo from the 42 API.
// Shared by the on-demand path (user token) and the cron refresh path (app token).
async function fetchPoolFromApi(campusId: number, poolMonth: string, poolYear: string, accessToken: string): Promise<CachedPool> {
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

    const response = await ftFetch(`${FORTYTWO_API_BASE}/users?${params}`, accessToken);

    if (!response.ok) {
      if (response.status === 401) throw new UnauthorizedError("Token expired");
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
        const cuRes = await ftFetch(`${FORTYTWO_API_BASE}/cursus_users?${cuParams}`, accessToken);

        if (!cuRes.ok) {
          console.warn("Cursus users fetch error (proceeding without full level data):", cuRes.status);
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

  return { poolMonth, poolYear, users: poolUsers };
}

// Used by the cron job to keep a tracked campus/pool combo warm without a user session.
export async function refreshPoolCache(campusId: number, poolMonth: string, poolYear: string, accessToken: string): Promise<void> {
  const fullPool = await fetchPoolFromApi(campusId, poolMonth, poolYear, accessToken);
  const cacheKey = `${campusId}-${poolMonth}-${poolYear}`;
  await cache.set(cacheKey, { time: Date.now(), data: fullPool }, { ttl: CACHE_STORE_SECONDS, tags: [`campus-${campusId}`] });
}

// Used by the cron job to keep a tracked campus's "latest pool" pointer warm.
export async function refreshLatestPoolCache(campusId: number, accessToken: string): Promise<void> {
  const latest = await latestPool(campusId, accessToken);
  if (!latest) return;
  await cache.set(`latest-${campusId}`, { time: Date.now(), data: latest }, { ttl: CACHE_STORE_SECONDS, tags: [`campus-${campusId}`] });
}

export async function getPoolPage(
  session: { campusId: number; accessToken: string; poolMonth: string; poolYear: string },
  opts: {
    page?: string | number;
    month?: string;
    year?: string;
    campusId?: string | number;
    minLevel?: number | null;
    maxLevel?: number | null;
  } = {}
): Promise<PoolPageResult> {
  let poolMonth = opts.month || "";
  let poolYear = opts.year || "";
  const pageNum = Math.max(1, Number(opts.page) || 1);
  const minLevel = opts.minLevel ?? null;
  const maxLevel = opts.maxLevel ?? null;
  const campusId = Number(opts.campusId) || session.campusId;

  // Default to the campus's most recent pool
  if (!poolMonth || !poolYear) {
    await trackLatest(campusId);
    const latestKey = `latest-${campusId}`;
    const cachedLatest = (await cache.get(latestKey)) as { time: number; data: unknown } | null;
    let latest = cachedLatest && Date.now() - cachedLatest.time < CACHE_TTL
      ? (cachedLatest.data as { month: string; year: string })
      : null;
    if (!latest) {
      latest = await latestPool(campusId, session.accessToken);
      if (latest) {
        await cache.set(latestKey, { time: Date.now(), data: latest }, { ttl: CACHE_STORE_SECONDS, tags: [`campus-${campusId}`] });
      } else if (cachedLatest) {
        // Serve stale rather than nothing if the live lookup failed
        latest = cachedLatest.data as { month: string; year: string };
      }
    }
    poolMonth = latest?.month || (campusId === session.campusId ? session.poolMonth : "") || "";
    poolYear = latest?.year || (campusId === session.campusId ? session.poolYear : "") || "";
  }

  if (!poolMonth || !poolYear) {
    return { ok: false, error: "No pool info found for this campus", status: 400 };
  }

  await trackPool(campusId, poolMonth, poolYear);

  const cacheKey = `${campusId}-${poolMonth}-${poolYear}`;
  const cached = (await cache.get(cacheKey)) as { time: number; data: unknown } | null;
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return paginate(cached.data as CachedPool, pageNum, minLevel, maxLevel);
  }

  try {
    const fullPool = await fetchPoolFromApi(campusId, poolMonth, poolYear, session.accessToken);
    await cache.set(cacheKey, { time: Date.now(), data: fullPool }, { ttl: CACHE_STORE_SECONDS, tags: [`campus-${campusId}`] });
    return paginate(fullPool, pageNum, minLevel, maxLevel);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return { ok: false, error: "Token expired. Please sign in again.", status: 401 };
    }
    console.error("Pool users fetch error:", err);
    // Serve the last successful result (even stale) rather than an error
    if (cached) return paginate(cached.data as CachedPool, pageNum, minLevel, maxLevel);
    return { ok: false, error: "Internal server error", status: 500 };
  }
}

import "server-only";
import { getCache } from "@vercel/functions";

const FORTYTWO_API_BASE = "https://api.intra.42.fr/v2";
const cache = getCache({ namespace: "leaderboard" });
const CACHE_TTL_SECONDS = 5 * 60;

// Promo years barely change (a new one appears once or twice a year); cache for a full day.
const promoYearsCache = getCache({ namespace: "promo-years" });
const PROMO_YEARS_TTL_SECONDS = 24 * 60 * 60;

interface CursusUser {
  id: number;
  level: number;
  user: {
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
    pool_year: string;
  };
}

export interface LeaderboardUser {
  id: number;
  login: string;
  displayname: string;
  imageUrl: string | null;
  level: number;
  poolYear: string;
}

export type LeaderboardPageResult =
  | { ok: true; page: number; limit: number; users: LeaderboardUser[]; hasMore: boolean }
  | { ok: false; error: string; status: number };

export type PromoYearsResult =
  | { ok: true; years: string[] }
  | { ok: false; error: string; status: number };

// Boundary (oldest/newest) pool_year present on this campus, used to derive the
// full list of promo years without having to scan every user.
async function boundaryPoolYear(campusId: number, token: string, ascending: boolean): Promise<string | null> {
  const params = new URLSearchParams({
    "filter[primary_campus_id]": campusId.toString(),
    "sort": ascending ? "pool_year" : "-pool_year",
    "page[size]": "1",
  });
  const res = await fetch(`${FORTYTWO_API_BASE}/users?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const users: { pool_year?: string }[] = await res.json();
  return users[0]?.pool_year || null;
}

export async function getPromoYears(session: { campusId: number; accessToken: string }): Promise<PromoYearsResult> {
  const cacheKey = `${session.campusId}`;
  const cached = (await promoYearsCache.get(cacheKey)) as PromoYearsResult | null;
  if (cached) return cached;

  try {
    const [oldest, newest] = await Promise.all([
      boundaryPoolYear(session.campusId, session.accessToken, true),
      boundaryPoolYear(session.campusId, session.accessToken, false),
    ]);

    if (!oldest || !newest) {
      return { ok: false, error: "No promo years found", status: 404 };
    }

    const years: string[] = [];
    for (let year = parseInt(newest); year >= parseInt(oldest); year--) years.push(year.toString());

    const result: PromoYearsResult = { ok: true, years };
    await promoYearsCache.set(cacheKey, result, { ttl: PROMO_YEARS_TTL_SECONDS, tags: [`campus-${session.campusId}`] });
    return result;
  } catch (err) {
    console.error("Promo years fetch error:", err);
    return { ok: false, error: "Internal server error", status: 500 };
  }
}

export async function getLeaderboardPage(
  session: { campusId: number; accessToken: string },
  opts: { page?: string | number; limit?: string | number; cursusId?: string; minLevel?: string | null; maxLevel?: string | null } = {}
): Promise<LeaderboardPageResult> {
  const page = String(opts.page ?? "1");
  const limit = String(opts.limit ?? "50");
  const cursusId = opts.cursusId || "21";
  const minLevel = opts.minLevel ?? null;
  const maxLevel = opts.maxLevel ?? null;

  const cacheKey = `${session.campusId}-${cursusId}-${page}-${limit}-${minLevel ?? ""}-${maxLevel ?? ""}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached as LeaderboardPageResult;

  try {
    const params = new URLSearchParams({
      "filter[campus_id]": session.campusId.toString(),
      "filter[cursus_id]": cursusId,
      "sort": "-level",
      "page[number]": page,
      "page[size]": limit,
    });

    if (minLevel || maxLevel) {
      params.set("range[level]", `${minLevel || "0"},${maxLevel || "9999"}`);
    }

    const response = await fetch(`${FORTYTWO_API_BASE}/cursus_users?${params}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { ok: false, error: "Token expired. Please sign in again.", status: 401 };
      }
      console.error("42 API error:", response.status, await response.text());
      return { ok: false, error: "Failed to fetch leaderboard", status: 500 };
    }

    const cursusUsers: CursusUser[] = await response.json();

    const leaderboard: LeaderboardUser[] = cursusUsers.map((cu) => ({
      id: cu.user.id,
      login: cu.user.login,
      displayname: cu.user.displayname,
      imageUrl: cu.user.image?.link || null,
      level: cu.level,
      poolYear: cu.user.pool_year,
    }));

    const result: LeaderboardPageResult = {
      ok: true,
      page: parseInt(page),
      limit: parseInt(limit),
      users: leaderboard,
      hasMore: leaderboard.length === parseInt(limit),
    };
    await cache.set(cacheKey, result, { ttl: CACHE_TTL_SECONDS, tags: [`campus-${session.campusId}`] });
    return result;
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    return { ok: false, error: "Internal server error", status: 500 };
  }
}

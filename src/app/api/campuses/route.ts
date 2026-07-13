import { NextResponse } from "next/server";
import { getCache } from "@vercel/functions";
import { getSession } from "@/lib/session";

const FORTYTWO_API_BASE = "https://api.intra.42.fr/v2";

interface Campus {
  id: number;
  name: string;
  city: string;
  country: string;
}

// Campus list barely changes; cache for a full day, shared across instances via Runtime Cache
const cache = getCache({ namespace: "campuses" });
const CACHE_KEY = "all";
const CACHE_TTL_SECONDS = 24 * 60 * 60;

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cached = (await cache.get(CACHE_KEY)) as Campus[] | null;
  if (cached) {
    return NextResponse.json({ campuses: cached, myCampusId: session.campusId });
  }

  const campuses: Campus[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const params = new URLSearchParams({
      "page[size]": "100",
      "page[number]": page.toString(),
      "sort": "city",
    });
    const res = await fetch(`${FORTYTWO_API_BASE}/campus?${params}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch campuses" }, { status: 500 });
    }

    const batch: Campus[] = await res.json();
    campuses.push(...batch);
    if (batch.length < 100 || page > 5) hasMore = false;
    else page++;
  }

  await cache.set(CACHE_KEY, campuses, { ttl: CACHE_TTL_SECONDS });
  return NextResponse.json({ campuses, myCampusId: session.campusId });
}

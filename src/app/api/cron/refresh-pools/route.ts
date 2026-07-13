import { NextRequest, NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/fortytwo-app-token";
import { getTrackedPools, refreshLatestPoolCache, refreshPoolCache } from "@/lib/pool-data";

// Vercel Cron calls this on a schedule (see vercel.json) so pool data is refreshed
// server-side ahead of time; frontend requests then always read from cache instead
// of triggering a live 42 API call. Runs with an app-level token, not a user session.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getAppAccessToken();
  const { pools, latestCampusIds } = await getTrackedPools();

  let refreshed = 0;
  let failed = 0;

  for (const campusId of latestCampusIds) {
    try {
      await refreshLatestPoolCache(campusId, token);
      refreshed++;
    } catch (err) {
      console.error("Cron: failed to refresh latest pool for campus", campusId, err);
      failed++;
    }
  }

  for (const key of pools) {
    const [campusId, poolMonth, poolYear] = key.split("-");
    try {
      await refreshPoolCache(Number(campusId), poolMonth, poolYear, token);
      refreshed++;
    } catch (err) {
      console.error("Cron: failed to refresh pool", key, err);
      failed++;
    }
  }

  return NextResponse.json({ ok: true, refreshed, failed, tracked: pools.length + latestCampusIds.length });
}

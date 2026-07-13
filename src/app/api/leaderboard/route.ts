import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getLeaderboardPage } from "@/lib/leaderboard-data";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const result = await getLeaderboardPage(session, {
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "50",
    cursusId: searchParams.get("cursus_id") || "21",
    minLevel: searchParams.get("minLevel"),
    maxLevel: searchParams.get("maxLevel"),
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result);
}

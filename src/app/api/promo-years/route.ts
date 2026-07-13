import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPromoYears } from "@/lib/leaderboard-data";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await getPromoYears(session);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result);
}

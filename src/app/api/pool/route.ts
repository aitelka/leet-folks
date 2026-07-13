import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPoolPage } from "@/lib/pool-data";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const result = await getPoolPage(session, {
    page: searchParams.get("page") || "1",
    month: searchParams.get("month") || "",
    year: searchParams.get("year") || "",
    campusId: searchParams.get("campus_id") || undefined,
    minLevel: searchParams.has("minLevel") ? Number(searchParams.get("minLevel")) : null,
    maxLevel: searchParams.has("maxLevel") ? Number(searchParams.get("maxLevel")) : null,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result);
}

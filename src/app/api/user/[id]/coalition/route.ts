import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const FORTYTWO_API_BASE = "https://api.intra.42.fr/v2";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: userId } = await params;
  
  try {
    const response = await fetch(`${FORTYTWO_API_BASE}/users/${userId}/coalitions`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch coalitions" }, { status: response.status });
    }

    const coalitions = await response.json();
    if (coalitions && coalitions.length > 0) {
      // Sort by ID descending to get the most recent coalition (usually Main Cursus instead of Piscine)
      coalitions.sort((a: { id: number }, b: { id: number }) => b.id - a.id);
      return NextResponse.json({ color: coalitions[0].color });
    }
    
    return NextResponse.json({ color: null });
  } catch (err) {
    console.error("Coalitions fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

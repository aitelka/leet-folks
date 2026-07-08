import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const FORTYTWO_API_BASE = "https://api.intra.42.fr/v2";

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

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "50";
  const cursusId = searchParams.get("cursus_id") || "21";

  try {
    const params = new URLSearchParams({
      "filter[campus_id]": session.campusId.toString(),
      "filter[cursus_id]": cursusId,
      "sort": "-level", // Sort descending by level
      "page[number]": page,
      "page[size]": limit,
    });

    const response = await fetch(`${FORTYTWO_API_BASE}/cursus_users?${params}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: "Token expired. Please sign in again." }, { status: 401 });
      }
      console.error("42 API error:", response.status, await response.text());
      return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }

    const cursusUsers: CursusUser[] = await response.json();

    // Map to a simpler format for the frontend
    const leaderboard = cursusUsers.map((cu) => ({
      id: cu.user.id,
      login: cu.user.login,
      displayname: cu.user.displayname,
      imageUrl: cu.user.image?.link || null,
      level: cu.level,
      poolYear: cu.user.pool_year,
    }));

    return NextResponse.json({
      page: parseInt(page),
      limit: parseInt(limit),
      users: leaderboard,
      hasMore: leaderboard.length === parseInt(limit),
    });
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

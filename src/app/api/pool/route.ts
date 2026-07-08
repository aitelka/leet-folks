import { NextResponse } from "next/server";
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

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.poolMonth || !session.poolYear) {
    return NextResponse.json({ error: "No pool info found for this user" }, { status: 400 });
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
        "filter[pool_month]": session.poolMonth,
        "filter[pool_year]": session.poolYear,
        "filter[primary_campus_id]": session.campusId.toString(),
        "page[size]": perPage.toString(),
        "page[number]": page.toString(),
        "sort": "login",
      });

      const response = await fetch(`${FORTYTWO_API_BASE}/users?${params}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return NextResponse.json({ error: "Token expired. Please sign in again." }, { status: 401 });
        }
        console.error("42 API error:", response.status, await response.text());
        return NextResponse.json({ error: "Failed to fetch pool users" }, { status: 500 });
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
          const cuRes = await fetch(`${FORTYTWO_API_BASE}/cursus_users?${cuParams}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });

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

          u.level = mainCursus ? mainCursus.level : poolCursus ? poolCursus.level : 0;
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
      poolYear: session.poolYear,
      poolMonth: session.poolMonth,
      level: user.level || 0,
      campusId: session.campusId,
      validatedPool: !!user.validatedPool,
    }));

    poolUsers.sort((a, b) => b.level - a.level);

    return NextResponse.json({
      poolMonth: session.poolMonth,
      poolYear: session.poolYear,
      total: poolUsers.length,
      users: poolUsers,
      hasMore: false,
    });
  } catch (err) {
    console.error("Pool users fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

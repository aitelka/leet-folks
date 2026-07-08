import { NextRequest, NextResponse } from "next/server";
import { getAuthConfig, FORTYTWO_TOKEN_URL, FORTYTWO_USER_URL } from "@/lib/auth.config";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
    }

    const config = getAuthConfig();

    // Exchange code for token
    const tokenResponse = await fetch(FORTYTWO_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: config.redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token error:", errorData);
      return NextResponse.json({ error: "Failed to exchange token" }, { status: 400 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile
    const userResponse = await fetch(FORTYTWO_USER_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 400 });
    }

    const userData = await userResponse.json();

    // Create session
    await createSession(userData, accessToken);

    const isStudent = userData.cursus_users?.some((c: { cursus_id: number }) => c.cursus_id === 21) ?? false;
    const redirectPath = isStudent ? "/leaderboard" : "/pool";

    return NextResponse.json({ redirect: redirectPath });
  } catch (err) {
    console.error("OAuth exchange error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

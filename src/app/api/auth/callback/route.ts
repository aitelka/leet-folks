import { NextRequest, NextResponse } from "next/server";
import { getAuthConfig, FORTYTWO_TOKEN_URL, FORTYTWO_USER_URL } from "@/lib/auth.config";
import { createSession } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;

  if (!storedState || storedState !== state) {
    return NextResponse.json({ error: "Invalid state (CSRF protection)" }, { status: 400 });
  }

  // Clear state cookie
  cookieStore.delete("oauth_state");

  const config = getAuthConfig();

  try {
    // Exchange code for token
    const tokenResponse = await fetch(FORTYTWO_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 400 });
    }

    const userData = await userResponse.json();

    // Create session
    await createSession(userData);

    return NextResponse.redirect(new URL("/", request.url));
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

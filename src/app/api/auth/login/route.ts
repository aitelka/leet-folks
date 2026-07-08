import { NextResponse } from "next/server";
import { getAuthConfig, FORTYTWO_AUTHORIZE_URL } from "@/lib/auth.config";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const config = getAuthConfig();
    
    // Generate random state for CSRF protection
    const state = crypto.randomBytes(16).toString("hex");
    
    // Store state in a short-lived cookie
    const cookieStore = await cookies();
    cookieStore.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
      sameSite: "lax",
    });

    const url = new URL(FORTYTWO_AUTHORIZE_URL);
    url.searchParams.append("client_id", config.clientId);
    url.searchParams.append("redirect_uri", config.redirectUri);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("state", state);
    
    return NextResponse.redirect(url.toString());
  } catch (err) {
    console.error("Login Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(`Error: ${message}`, { status: 500 });
  }
}

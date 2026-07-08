import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/auth/loading?error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/auth/loading?error=Missing+code+or+state", request.url));
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(new URL("/auth/loading?error=Invalid+state+(CSRF+protection)", request.url));
  }

  // Clear state cookie
  cookieStore.delete("oauth_state");

  // Redirect immediately to loading page with the code — no slow API calls here
  return NextResponse.redirect(new URL(`/auth/loading?code=${encodeURIComponent(code)}`, request.url));
}

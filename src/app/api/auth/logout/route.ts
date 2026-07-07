import { NextResponse, NextRequest } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  await deleteSession();
  
  // Also support redirecting if called directly
  const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/";
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}

export async function GET(request: NextRequest) {
  await deleteSession();
  return NextResponse.redirect(new URL("/", request.url));
}

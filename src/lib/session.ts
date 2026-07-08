import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getEncodedKey() {
  const secretKey = process.env.SESSION_SECRET;
  if (!secretKey) {
    throw new Error("Missing SESSION_SECRET in environment variables");
  }
  return new TextEncoder().encode(secretKey);
}

export interface SessionPayload {
  userId: number;
  login: string;
  avatarUrl: string;
  accessToken: string;
  poolMonth: string;
  poolYear: string;
  campusId: number;
  expiresAt: Date;
  isStudent: boolean;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getEncodedKey());
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(user: { id: number; login: string; image?: { link?: string }; pool_month?: string; pool_year?: string; campus_users?: { campus_id: number; is_primary: boolean }[]; cursus_users?: { cursus_id: number }[] }, accessToken: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const primaryCampus = user.campus_users?.find(cu => cu.is_primary);
  const isStudent = user.cursus_users?.some(cu => cu.cursus_id === 21) ?? false;
  const session = await encrypt({
    userId: user.id,
    login: user.login,
    avatarUrl: user.image?.link || "",
    accessToken,
    poolMonth: user.pool_month || "",
    poolYear: user.pool_year || "",
    campusId: primaryCampus?.campus_id || 0,
    expiresAt,
    isStudent,
  });
  
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;
  
  return decrypt(sessionCookie);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

import "server-only";

export const FORTYTWO_AUTHORIZE_URL = "https://api.intra.42.fr/oauth/authorize";
export const FORTYTWO_TOKEN_URL = "https://api.intra.42.fr/oauth/token";
export const FORTYTWO_USER_URL = "https://api.intra.42.fr/v2/me";

export function getAuthConfig() {
  const clientId = process.env.FORTYTWO_CLIENT_ID;
  const clientSecret = process.env.FORTYTWO_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  if (!clientId || !clientSecret) {
    throw new Error("Missing 42 Intra OAuth credentials in environment variables");
  }

  return {
    clientId,
    clientSecret,
    redirectUri: `${appUrl}/api/auth/callback`,
  };
}

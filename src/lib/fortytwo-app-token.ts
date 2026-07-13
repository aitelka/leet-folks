import "server-only";
import { getCache } from "@vercel/functions";
import { FORTYTWO_TOKEN_URL, getAuthConfig } from "@/lib/auth.config";

const cache = getCache({ namespace: "fortytwo-app-token" });
const CACHE_KEY = "token";

// App-level (client_credentials) token, independent of any user session.
// Used by the cron job so pool data can refresh without a logged-in user.
export async function getAppAccessToken(): Promise<string> {
  const cached = (await cache.get(CACHE_KEY)) as { token: string } | null;
  if (cached) return cached.token;

  const { clientId, clientSecret } = getAuthConfig();

  const res = await fetch(FORTYTWO_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to obtain 42 app access token: ${res.status}`);
  }

  const data = await res.json();
  const token: string = data.access_token;
  const expiresIn: number = data.expires_in || 7200;

  // Refresh a bit before actual expiry
  await cache.set(CACHE_KEY, { token }, { ttl: Math.max(60, expiresIn - 120) });
  return token;
}

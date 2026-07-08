import type { NextRequest } from "next/server";

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "r.remigijus.kuodis@gmail.com").toLowerCase();
export const ADMIN_ACCESS_COOKIE = "portal-admin-access";
export const ADMIN_REFRESH_COOKIE = "portal-admin-refresh";

export function getAdminSupabaseEnv() {
  return {
    url: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || ""
  };
}

export async function getAdminUser(request: NextRequest) {
  const { url, anonKey } = getAdminSupabaseEnv();
  const accessToken = request.cookies.get(ADMIN_ACCESS_COOKIE)?.value || "";
  if (!url || !anonKey || !accessToken) return null;

  const response = await fetch(new URL("/auth/v1/user", url), {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`
    },
    cache: "no-store"
  });
  if (!response.ok) return null;

  const user = (await response.json()) as { id?: string; email?: string };
  if (!user.id || user.email?.toLowerCase() !== ADMIN_EMAIL) return null;
  return { id: user.id, email: user.email, accessToken };
}

export async function adminRestFetch(
  request: NextRequest,
  path: string,
  init: RequestInit = {}
) {
  const user = await getAdminUser(request);
  if (!user) return { user: null, response: null };

  const { url, anonKey } = getAdminSupabaseEnv();
  const response = await fetch(new URL(path, url), {
    ...init,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${user.accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {})
    },
    cache: "no-store"
  });
  return { user, response };
}


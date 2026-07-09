import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "r.remigijus.kuodis@gmail.com").toLowerCase();
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
export const ADMIN_ACCESS_COOKIE = "portal-admin-access";
export const ADMIN_REFRESH_COOKIE = "portal-admin-refresh";
export const ADMIN_SESSION_COOKIE = "portal-admin-session";

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function signAdminSession(value: string) {
  const secret = getAdminSessionSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createAdminSessionToken() {
  if (!ADMIN_PASSWORD) return "";

  const payload = `${ADMIN_EMAIL}|admin`;
  const signature = signAdminSession(payload);
  if (!signature) return "";

  return `${payload}.${signature}`;
}

export function hasAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value || "";
  if (!token || !token.includes(".")) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = signAdminSession(payload);
  if (!expected) return false;

  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;

  return payload === `${ADMIN_EMAIL}|admin`;
}

export function getAdminSupabaseEnv() {
  return {
    url: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  };
}

export async function getAdminUser(request: NextRequest) {
  if (hasAdminSession(request)) {
    return { id: "portal-admin", email: ADMIN_EMAIL, accessToken: "", sessionType: "password" as const };
  }

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
  return { id: user.id, email: user.email, accessToken, sessionType: "supabase" as const };
}

export async function adminRestFetch(
  request: NextRequest,
  path: string,
  init: RequestInit = {}
) {
  const user = await getAdminUser(request);
  if (!user) return { user: null, response: null };

  const { url, anonKey, serviceRoleKey } = getAdminSupabaseEnv();
  const authHeader = user.sessionType === "password"
    ? `Bearer ${serviceRoleKey || anonKey}`
    : `Bearer ${user.accessToken}`;
  const apiKey = user.sessionType === "password" ? (serviceRoleKey || anonKey) : anonKey;
  const response = await fetch(new URL(path, url), {
    ...init,
    headers: {
      apikey: apiKey,
      Authorization: authHeader,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {})
    },
    cache: "no-store"
  });
  return { user, response };
}

import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_EMAIL,
  ADMIN_REFRESH_COOKIE,
  getAdminSupabaseEnv,
  getAdminUser
} from "@/lib/admin-server";

export async function GET(request: NextRequest) {
  const user = await getAdminUser(request);
  if (user) return NextResponse.json({ email: user.email });

  const refreshToken = request.cookies.get(ADMIN_REFRESH_COOKIE)?.value;
  if (!refreshToken) return NextResponse.json({ error: "Neprisijungta." }, { status: 401 });
  const { url, anonKey } = getAdminSupabaseEnv();
  const refreshed = await fetch(new URL("/auth/v1/token?grant_type=refresh_token", url), {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store"
  });
  if (!refreshed.ok) return NextResponse.json({ error: "Sesija baigėsi." }, { status: 401 });
  const session = await refreshed.json() as {
    access_token: string; refresh_token: string; expires_in: number; user?: { email?: string }
  };
  if (session.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Prieiga nesuteikta." }, { status: 403 });
  }
  const response = NextResponse.json({ email: session.user.email });
  const secure = request.nextUrl.protocol === "https:";
  response.cookies.set(ADMIN_ACCESS_COOKIE, session.access_token, {
    httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: session.expires_in || 3600
  });
  response.cookies.set(ADMIN_REFRESH_COOKIE, session.refresh_token, {
    httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30
  });
  return response;
}

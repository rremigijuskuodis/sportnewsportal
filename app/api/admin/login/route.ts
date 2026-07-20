import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_REFRESH_COOKIE,
  ADMIN_SESSION_COOKIE,
  getAdminSupabaseEnv
} from "@/lib/admin-server";

export const runtime = "nodejs";

function sessionCookieOptions(request: NextRequest) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const secure = process.env.NODE_ENV === "production" || request.nextUrl.protocol === "https:" || forwardedProto === "https";
  // Keep the session when the visitor moves between the www and non-www
  // production host. Never set this domain on Vercel preview URLs.
  // Host-only cookies avoid duplicate-cookie ordering problems after a
  // visitor switches between www and the canonical host.
  return { httpOnly: true, secure, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 14 };
}

export async function POST(request: NextRequest) {
  const { password } = (await request.json().catch(() => ({}))) as {
    password?: string;
  };

  const { url, anonKey } = getAdminSupabaseEnv();
  if (!url || !anonKey) return NextResponse.json({ error: "Administratoriaus prisijungimas dar nesukonfigūruotas." }, { status: 500 });
  const signedIn = await fetch(new URL("/auth/v1/token?grant_type=password", url), {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email: "r.remigijus.kuodis@gmail.com", password: String(password || "") }),
    cache: "no-store"
  });
  if (!signedIn.ok) return NextResponse.json({ error: "Neteisingas slaptažodis arba paskyra dar neaktyvuota." }, { status: 401 });
  const session = await signedIn.json() as { access_token: string; refresh_token: string; expires_in: number };
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(ADMIN_ACCESS_COOKIE, session.access_token, { ...sessionCookieOptions(request), maxAge: session.expires_in || 3600 });
  response.cookies.set(ADMIN_REFRESH_COOKIE, session.refresh_token, { ...sessionCookieOptions(request), maxAge: 60 * 60 * 24 * 30 });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { path: "/", maxAge: 0 });

  return response;
}

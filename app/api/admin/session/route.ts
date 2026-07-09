import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_EMAIL,
  ADMIN_REFRESH_COOKIE,
  ADMIN_SESSION_COOKIE,
  hasAdminSession,
  getAdminSupabaseEnv
} from "@/lib/admin-server";

export async function POST(request: NextRequest) {
  if (hasAdminSession(request)) {
    return NextResponse.json({ ok: true });
  }

  const body = (await request.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };
  if (!body.access_token || !body.refresh_token) {
    return NextResponse.json({ error: "Nerasti prisijungimo duomenys." }, { status: 400 });
  }

  const { url, anonKey } = getAdminSupabaseEnv();
  const userResponse = await fetch(new URL("/auth/v1/user", url), {
    headers: { apikey: anonKey, Authorization: `Bearer ${body.access_token}` },
    cache: "no-store"
  });
  if (!userResponse.ok) return NextResponse.json({ error: "Prisijungimo nuoroda nebegalioja." }, { status: 401 });

  const user = (await userResponse.json()) as { email?: string };
  if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Administratoriaus prieiga nesuteikta." }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  const secure = request.nextUrl.protocol === "https:";
  response.cookies.set(ADMIN_ACCESS_COOKIE, body.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(300, Number(body.expires_in || 3600))
  });
  response.cookies.set(ADMIN_REFRESH_COOKIE, body.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(ADMIN_REFRESH_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}

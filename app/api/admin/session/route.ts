import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_REFRESH_COOKIE,
  ADMIN_SESSION_COOKIE,
  hasAdminSession
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

  const response = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production" || request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
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

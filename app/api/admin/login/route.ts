import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken
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
  const { email, password } = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  if (String(email || "").trim().toLowerCase() !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Siam el. pastui administratoriaus prieiga nesuteikta." }, { status: 403 });
  }

  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Nesukonfiguruotas ADMIN_PASSWORD aplinkos kintamasis." }, { status: 500 });
  }

  if (String(password || "") !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Neteisingas slaptazodis." }, { status: 401 });
  }

  const sessionToken = createAdminSessionToken();
  if (!sessionToken) {
    return NextResponse.json({ error: "Nepavyko sukurti administratoriaus sesijos." }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, sessionCookieOptions(request));

  return response;
}

import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL, getAdminSupabaseEnv } from "@/lib/admin-server";

export async function POST(request: NextRequest) {
  const { email } = (await request.json().catch(() => ({}))) as { email?: string };
  if (String(email || "").trim().toLowerCase() !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Šiam el. paštui administratoriaus prieiga nesuteikta." }, { status: 403 });
  }

  const { url, anonKey } = getAdminSupabaseEnv();
  if (!url || !anonKey) {
    return NextResponse.json({ error: "Neužbaigta Supabase konfigūracija." }, { status: 500 });
  }

  const redirectTo = `${request.nextUrl.origin}/admin/auth/callback`;
  const response = await fetch(new URL("/auth/v1/otp", url), {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      create_user: true,
      options: { email_redirect_to: redirectTo }
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    const details = await response.text();
    return NextResponse.json({ error: details || "Prisijungimo nuorodos išsiųsti nepavyko." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}


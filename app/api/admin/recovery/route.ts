import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL, getAdminSupabaseEnv } from "@/lib/admin-server";

export async function POST(request: NextRequest) {
  const { url, anonKey } = getAdminSupabaseEnv();
  if (!url || !anonKey) return NextResponse.json({ error: "Trūksta Supabase prisijungimo nustatymų." }, { status: 500 });
  const redirectTo = `${request.nextUrl.origin}/admin/auth/callback`;
  const endpoint = new URL("/auth/v1/recover", url);
  endpoint.searchParams.set("redirect_to", redirectTo);
  const response = await fetch(endpoint, {
    method: "POST", headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL }), cache: "no-store"
  });
  if (!response.ok) return NextResponse.json({ error: "Atkūrimo laiško išsiųsti nepavyko." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

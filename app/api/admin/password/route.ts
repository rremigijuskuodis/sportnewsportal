import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseEnv, getAdminUser } from "@/lib/admin-server";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  const user = await getAdminUser(request);
  if (!user || user.sessionType !== "supabase") return NextResponse.json({ error: "Neprisijungta." }, { status: 401 });
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  if (String(password || "").length < 12) return NextResponse.json({ error: "Slaptažodis turi būti bent 12 simbolių." }, { status: 400 });
  const { url, anonKey } = getAdminSupabaseEnv();
  if (!url || !anonKey || !user.accessToken) return NextResponse.json({ error: "Nepavyko pasiekti paskyros sistemos." }, { status: 500 });
  const updated = await fetch(new URL("/auth/v1/user", url), {
    method: "PUT",
    headers: { apikey: anonKey, Authorization: `Bearer ${user.accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ password }), cache: "no-store"
  });
  if (!updated.ok) return NextResponse.json({ error: "Slaptažodžio pakeisti nepavyko." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

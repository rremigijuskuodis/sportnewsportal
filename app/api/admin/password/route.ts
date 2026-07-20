import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseEnv, getAdminUser } from "@/lib/admin-server";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  const user = await getAdminUser(request);
  if (!user || user.sessionType !== "supabase") return NextResponse.json({ error: "Neprisijungta." }, { status: 401 });
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  if (String(password || "").length < 12) return NextResponse.json({ error: "Slaptažodis turi būti bent 12 simbolių." }, { status: 400 });
  const { url, serviceRoleKey } = getAdminSupabaseEnv();
  if (!url || !serviceRoleKey) return NextResponse.json({ error: "Nepavyko pasiekti paskyros sistemos." }, { status: 500 });
  const updated = await fetch(new URL(`/auth/v1/admin/users/${user.id}`, url), {
    method: "PUT",
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ password }), cache: "no-store"
  });
  if (!updated.ok) return NextResponse.json({ error: "Slaptažodžio pakeisti nepavyko." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

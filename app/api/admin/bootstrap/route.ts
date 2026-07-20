import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL, getAdminSupabaseEnv } from "@/lib/admin-server";

export const runtime = "nodejs";

const ACTIVATION_CODE_HASH = "71cca302dffc3b507b70cf03627d0034a258dba59158b93a734f7234f1b74e9c";

export async function POST(request: NextRequest) {
  const { activationCode, password } = (await request.json().catch(() => ({}))) as { activationCode?: string; password?: string };
  if (createHash("sha256").update(String(activationCode || "")).digest("hex") !== ACTIVATION_CODE_HASH) {
    return NextResponse.json({ error: "Neteisingas aktyvavimo kodas." }, { status: 401 });
  }
  if (String(password || "").length < 12) return NextResponse.json({ error: "Sukurkite bent 12 simbolių slaptažodį." }, { status: 400 });

  const { url, serviceRoleKey } = getAdminSupabaseEnv();
  if (!url || !serviceRoleKey) return NextResponse.json({ error: "Trūksta Supabase administratoriaus prieigos." }, { status: 500 });

  const usersResponse = await fetch(new URL("/auth/v1/admin/users?page=1&per_page=1000", url), {
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }, cache: "no-store"
  });
  if (!usersResponse.ok) return NextResponse.json({ error: "Nepavyko patikrinti administratoriaus paskyros." }, { status: 500 });
  const usersData = await usersResponse.json() as { users?: Array<{ id: string; email?: string }> };
  const existing = usersData.users?.find((user) => user.email?.toLowerCase() === ADMIN_EMAIL);
  const endpoint = existing ? `/auth/v1/admin/users/${existing.id}` : "/auth/v1/admin/users";
  const saved = await fetch(new URL(endpoint, url), {
    method: existing ? "PUT" : "POST",
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(existing ? { password } : { email: ADMIN_EMAIL, password, email_confirm: true }),
    cache: "no-store"
  });
  if (!saved.ok) return NextResponse.json({ error: "Paskyros išsaugoti nepavyko." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

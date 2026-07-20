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

  const { url, anonKey } = getAdminSupabaseEnv();
  if (!url || !anonKey) return NextResponse.json({ error: "Trūksta Supabase prisijungimo nustatymų." }, { status: 500 });
  const saved = await fetch(new URL("/auth/v1/signup", url), {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password, options: { emailRedirectTo: `${request.nextUrl.origin}/admin/auth/callback` } }),
    cache: "no-store"
  });
  const result = await saved.json().catch(() => ({})) as { session?: unknown; user?: { identities?: unknown[] }; msg?: string; message?: string };
  if (!saved.ok) return NextResponse.json({ error: result.msg || result.message || "Paskyros sukurti nepavyko." }, { status: 400 });
  const alreadyRegistered = Array.isArray(result.user?.identities) && result.user.identities.length === 0;
  return NextResponse.json({ ok: true, alreadyRegistered, requiresEmailConfirmation: !result.session && !alreadyRegistered });
}

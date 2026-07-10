import { NextRequest, NextResponse } from "next/server";
import { adminRestFetch } from "@/lib/admin-server";

const settingFields = new Set([
  "automation_enabled", "article_interval_hours", "articles_per_day", "articles_per_hour", "articles_per_run",
  "generation_start_hour", "generation_end_hour",
  "article_model", "radar_enabled", "radar_interval_minutes", "radar_model",
  "auto_approve_enabled", "minimum_priority"
]);

export async function GET(request: NextRequest) {
  const result = await adminRestFetch(request, "/rest/v1/portal_settings?id=eq.portal&select=*");
  if (!result.user) return NextResponse.json({ error: "Neprisijungta." }, { status: 401 });
  return new NextResponse(await result.response!.text(), {
    status: result.response!.status,
    headers: { "Content-Type": "application/json" }
  });
}

export async function PATCH(request: NextRequest) {
  const input = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const patch: Record<string, unknown> = {
    id: "portal",
    updated_at: new Date().toISOString()
  };
  for (const [key, value] of Object.entries(input)) if (settingFields.has(key)) patch[key] = value;

  const result = await adminRestFetch(request, "/rest/v1/portal_settings?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(patch)
  });
  if (!result.user) return NextResponse.json({ error: "Neprisijungta." }, { status: 401 });
  return new NextResponse(await result.response!.text(), {
    status: result.response!.status,
    headers: { "Content-Type": "application/json" }
  });
}

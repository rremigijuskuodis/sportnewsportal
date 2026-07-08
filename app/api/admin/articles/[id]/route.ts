import { NextRequest, NextResponse } from "next/server";
import { adminRestFetch } from "@/lib/admin-server";

const allowedFields = new Set([
  "title", "slug", "summary", "lead", "body_markdown", "category", "sport", "status",
  "priority_score", "risk_level", "why_it_matters", "practical_action", "source_name",
  "source_url", "image_url", "image_alt", "image_page_url", "image_author", "image_license",
  "is_featured", "editor_locked", "editor_notes", "scheduled_at", "image_focus_x", "image_focus_y"
]);

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  const input = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) if (allowedFields.has(key)) patch[key] = value;
  patch.updated_at = new Date().toISOString();

  if (patch.status === "published") {
    if (!String(patch.body_markdown || input.current_body || "").trim() || !String(patch.image_url || input.current_image || "").trim()) {
      return NextResponse.json({ error: "Publikavimui būtinas tekstas ir nuotrauka." }, { status: 400 });
    }
    patch.published_at = new Date().toISOString();
  }

  const result = await adminRestFetch(request, `/rest/v1/articles?id=eq.${encodeURIComponent(context.params.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(patch)
  });
  if (!result.user) return NextResponse.json({ error: "Neprisijungta." }, { status: 401 });
  return new NextResponse(await result.response!.text(), {
    status: result.response!.status,
    headers: { "Content-Type": "application/json" }
  });
}


import { NextRequest, NextResponse } from "next/server";
import { adminRestFetch } from "@/lib/admin-server";

const allowedFields = new Set([
  "title", "slug", "summary", "lead", "body_markdown", "category", "sport", "status",
  "priority_score", "risk_level", "why_it_matters", "practical_action", "source_name",
  "source_url", "image_url", "image_alt", "image_page_url", "image_author", "image_license",
  "is_featured", "editor_locked", "editor_notes", "scheduled_at", "image_focus_x", "image_focus_y"
]);

function socialText(article: Record<string, unknown>) {
  const title = String(article.title || "Sporto Radaro naujiena").trim();
  const summary = String(article.summary || "").replace(/\s+/g, " ").trim();
  return (summary ? `${title}\n\n${summary}` : title).slice(0, 900);
}

async function queueFacebookPost(request: NextRequest, article: Record<string, unknown>) {
  const articleId = String(article.id || "").trim();
  if (!articleId) return;

  const queued = await adminRestFetch(request, "/rest/v1/social_queue?on_conflict=article_id,network", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({
      article_id: articleId,
      network: "facebook",
      post_text: socialText(article),
      post_image_url: String(article.image_url || "").trim() || null,
      status: "queued",
      scheduled_at: new Date().toISOString()
    })
  });
  if (queued.user && queued.response && !queued.response.ok) {
    console.error("Nepavyko pridėti rankinio straipsnio į Facebook eilę", await queued.response.text());
  }
}

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
  const responseText = await result.response!.text();
  if (result.response!.ok && patch.status === "published") {
    const published = JSON.parse(responseText || "[]");
    const article = Array.isArray(published) ? published[0] : published;
    if (article) await queueFacebookPost(request, article);
  }
  return new NextResponse(responseText, {
    status: result.response!.status,
    headers: { "Content-Type": "application/json" }
  });
}


import { NextRequest, NextResponse } from "next/server";
import { adminRestFetch } from "@/lib/admin-server";

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 90);
}

export async function GET(request: NextRequest) {
  const result = await adminRestFetch(request, "/rest/v1/articles?select=*&order=updated_at.desc&limit=100");
  if (!result.user) return NextResponse.json({ error: "Neprisijungta." }, { status: 401 });
  const response = result.response!;
  return new NextResponse(await response.text(), {
    status: response.status,
    headers: { "Content-Type": "application/json" }
  });
}

export async function POST(request: NextRequest) {
  const input = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const title = String(input.title || "").trim();
  const summary = String(input.summary || "").trim();
  if (!title || !summary) return NextResponse.json({ error: "Būtina antraštė ir santrauka." }, { status: 400 });

  const record = {
    title,
    slug: slugify(String(input.slug || title)) || `straipsnis-${Date.now()}`,
    summary,
    lead: String(input.lead || summary).trim(),
    body_markdown: String(input.body_markdown || "").trim(),
    category: String(input.category || "news"),
    sport: String(input.sport || "multi_sport"),
    format: "article",
    status: "draft",
    priority_score: Math.max(1, Math.min(5, Number(input.priority_score || 3))),
    risk_level: String(input.risk_level || "low"),
    why_it_matters: String(input.why_it_matters || "").trim(),
    source_name: String(input.source_name || "Sporto Radaras"),
    source_url: String(input.source_url || "").trim() || null,
    image_url: String(input.image_url || "").trim() || null,
    image_alt: String(input.image_alt || title).trim(),
    content_origin: "manual",
    editor_locked: true,
    is_featured: Boolean(input.is_featured),
    image_focus_x: Number(input.image_focus_x || 50),
    image_focus_y: Number(input.image_focus_y || 30)
  };

  const result = await adminRestFetch(request, "/rest/v1/articles", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(record)
  });
  if (!result.user) return NextResponse.json({ error: "Neprisijungta." }, { status: 401 });
  return new NextResponse(await result.response!.text(), {
    status: result.response!.status,
    headers: { "Content-Type": "application/json" }
  });
}

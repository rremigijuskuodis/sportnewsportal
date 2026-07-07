import type { FeedItem } from "@/lib/types";
import { mockArticleFeed, mockShortFeed } from "@/lib/mock-data";

type SupabaseArticleRow = {
  id: string;
  title: string;
  summary: string | null;
  body_markdown: string | null;
  category: string | null;
  sport: string | null;
  source_name: string | null;
  source_url: string | null;
  image_url: string | null;
  image_alt: string | null;
  slug: string | null;
  format: "short" | "article" | null;
  published_at: string | null;
  read_time_minutes: number | null;
  status: string | null;
  label: string | null;
  lead: string | null;
  priority_score: number | null;
  short_news_possible: boolean | null;
  draft_recommended: boolean | null;
  risk_level: "low" | "medium" | "high" | null;
  possible_duplicate: boolean | null;
  why_it_matters: string | null;
  practical_action: string | null;
};

function getSupabaseEnv() {
  return {
    url: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || ""
  };
}

function getFallbackArticleImage(sport: string | null) {
  const value = String(sport || "").toLowerCase();
  if (value.includes("krep") || value.includes("basket")) {
    return "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=82";
  }
  if (value.includes("fut") || value.includes("foot")) {
    return "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=82";
  }
  if (value.includes("vady") || value.includes("management")) {
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=82";
  }
  return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=82";
}

async function fetchSupabaseRows(format: "short" | "article") {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return format === "short" ? mockShortFeed : mockArticleFeed;
  }

  const endpoint = new URL("/rest/v1/articles", url);
  endpoint.searchParams.set("select", "*");
  endpoint.searchParams.set("format", `eq.${format}`);
  endpoint.searchParams.set("status", "eq.published");
  endpoint.searchParams.set("order", "published_at.desc");
  endpoint.searchParams.set("limit", format === "short" ? "12" : "18");

  const response = await fetch(endpoint.toString(), {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept: "application/json"
    },
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    return format === "short" ? mockShortFeed : mockArticleFeed;
  }

  const rows = (await response.json()) as SupabaseArticleRow[];
  if (!rows.length) {
    return format === "short" ? mockShortFeed : mockArticleFeed;
  }

  return rows.map((row) => normalizeRow(row, format));
}

function normalizeRow(row: SupabaseArticleRow, format: "short" | "article"): FeedItem {
  const summary = row.summary || "";

  return {
    id: row.id,
    title: row.title,
    summary,
    category: row.category || "aktualu",
    sport: row.sport || "kitos sporto šakos",
    sourceName: row.source_name || "SicenterHub",
    sourceUrl: row.source_url || undefined,
    imageUrl: row.image_url || (format === "article" ? getFallbackArticleImage(row.sport) : undefined),
    imageAlt: row.image_alt || (format === "article" ? `${row.sport || "Sporto"} naujienos iliustracija` : undefined),
    bodyMarkdown: row.body_markdown || summary,
    slug: row.slug || row.id,
    format,
    publishedAt: row.published_at || new Date().toISOString(),
    readTimeMinutes: row.read_time_minutes || undefined,
    status: (row.status as FeedItem["status"]) || "published",
    label: row.label || undefined,
    lead: row.lead || summary,
    whyItMatters: row.why_it_matters || summary,
    practicalAction: row.practical_action || undefined,
    priorityScore: row.priority_score ?? (format === "article" ? 4 : 3),
    shortNewsPossible: row.short_news_possible ?? format === "short",
    draftRecommended: row.draft_recommended ?? format === "article",
    riskLevel: row.risk_level || "low",
    possibleDuplicate: row.possible_duplicate || false
  };
}

export async function loadPortalFeed() {
  const [shortFeed, articleFeed] = await Promise.all([
    fetchSupabaseRows("short"),
    fetchSupabaseRows("article")
  ]);

  if (!articleFeed.length && !shortFeed.length) {
    return {
      shortFeed: mockShortFeed,
      articleFeed: mockArticleFeed
    };
  }

  return {
    shortFeed,
    articleFeed
  };
}

import type { FeedItem } from "@/lib/types";
import { mockArticleFeed, mockShortFeed } from "@/lib/mock-data";

type SupabaseArticleRow = {
  id: string;
  title: string;
  summary: string | null;
  body_markdown: string | null;
  match_stats: FeedItem["matchStats"] | null;
  category: string | null;
  sport: string | null;
  source_name: string | null;
  source_url: string | null;
  image_url: string | null;
  image_alt: string | null;
  image_page_url: string | null;
  image_author: string | null;
  image_license: string | null;
  image_license_url: string | null;
  image_focus_x: number | null;
  image_focus_y: number | null;
  slug: string | null;
  format: "short" | "article" | null;
  published_at: string | null;
  read_time_minutes: number | null;
  status: string | null;
  label: string | null;
  lead: string | null;
  priority_score: number | null;
  is_featured: boolean | null;
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

async function fetchSupabaseRows(format: "short" | "article") {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return format === "short" ? mockShortFeed : mockArticleFeed;
  }

  const endpoint = new URL("/rest/v1/articles", url);
  endpoint.searchParams.set("select", "*");
  endpoint.searchParams.set("status", "eq.published");
  endpoint.searchParams.set("order", "published_at.desc");
  // Pilnam straipsnių archyvui reikia daugiau nei pagrindinio puslapio kortelių.
  endpoint.searchParams.set("limit", format === "short" ? "20" : "200");

  const response = await fetch(endpoint.toString(), {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept: "application/json"
    },
    next: { revalidate: 15 }
  });

  if (!response.ok) {
    return format === "short" ? mockShortFeed : mockArticleFeed;
  }

  const rows = (await response.json()) as SupabaseArticleRow[];
  const filteredRows = rows.filter((row) => {
    if (format === "short") {
      return row.format === "short";
    }

    if (row.format === "short") return false;
    return Boolean(row.body_markdown || row.lead || row.summary);
  });
  if (!filteredRows.length) {
    return format === "short" ? mockShortFeed : mockArticleFeed;
  }

  return filteredRows.map((row) => normalizeRow(row, format));
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
    imageUrl: row.image_url || undefined,
    imageAlt: row.image_alt || undefined,
    imagePageUrl: row.image_page_url || undefined,
    imageAuthor: row.image_author || undefined,
    imageLicense: row.image_license || undefined,
    imageLicenseUrl: row.image_license_url || undefined,
    imageFocusX: row.image_focus_x ?? 50,
    imageFocusY: row.image_focus_y ?? 30,
    bodyMarkdown: row.body_markdown || summary,
    matchStats: row.match_stats || undefined,
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
    isFeatured: row.is_featured || false,
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

export async function loadPublishedArticleFeedForSeo() {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) return [];
  const endpoint = new URL("/rest/v1/articles", url);
  endpoint.searchParams.set("select", "*");
  endpoint.searchParams.set("status", "eq.published");
  endpoint.searchParams.set("format", "eq.article");
  endpoint.searchParams.set("order", "published_at.desc");
  endpoint.searchParams.set("limit", "200");
  try {
    const response = await fetch(endpoint.toString(), {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Accept: "application/json" },
      next: { revalidate: 300 }
    });
    if (!response.ok) return [];
    const rows = (await response.json()) as SupabaseArticleRow[];
    return rows.filter((row) => row.slug && row.title).map((row) => normalizeRow(row, "article"));
  } catch {
    return [];
  }
}

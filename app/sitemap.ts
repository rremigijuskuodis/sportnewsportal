import type { MetadataRoute } from "next";
import { loadPublishedArticleFeedForSeo } from "@/lib/supabase";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://naujienos.sicenterhub.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await loadPublishedArticleFeedForSeo();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1
    },
    {
      url: `${siteUrl}/kontaktai`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4
    },
    ...articles.map((item) => ({
      url: `${siteUrl}/${item.slug}`,
      lastModified: new Date(item.publishedAt),
      changeFrequency: "daily" as const,
      priority: item.format === "article" ? 0.9 : 0.7
    }))
  ];
}

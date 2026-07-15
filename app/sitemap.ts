import type { MetadataRoute } from "next";
import { loadPublishedArticleFeedForSeo } from "@/lib/supabase";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await loadPublishedArticleFeedForSeo();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1
    },
    {
      url: `${siteConfig.url}/naujienos`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9
    },
    {
      url: `${siteConfig.url}/radaras`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/apie`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: `${siteConfig.url}/redakcijos-principai`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: `${siteConfig.url}/privatumo-politika`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4
    },
    {
      url: `${siteConfig.url}/kontaktai`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4
    }
  ];

  return [
    ...staticPages,
    ...articles.map((item) => ({
      url: `${siteConfig.url}/${item.slug}`,
      lastModified: new Date(item.publishedAt),
      changeFrequency: "daily" as const,
      priority: item.format === "article" ? 0.9 : 0.7
    }))
  ];
}

import type { MetadataRoute } from "next";
import { mockArticleFeed, mockShortFeed } from "@/lib/mock-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://naujienos.sicenterhub.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const combined = [...mockArticleFeed, ...mockShortFeed];

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1
    },
    ...combined.map((item) => ({
      url: `${siteUrl}/${item.slug}`,
      lastModified: new Date(item.publishedAt),
      changeFrequency: "daily" as const,
      priority: item.format === "article" ? 0.9 : 0.7
    }))
  ];
}

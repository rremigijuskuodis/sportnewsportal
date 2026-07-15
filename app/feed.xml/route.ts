import { loadPublishedArticleFeedForSeo } from "@/lib/supabase";
import { siteConfig } from "@/lib/site-config";

export async function GET() {
  const articles = await loadPublishedArticleFeedForSeo();
  const items = articles
    .map((item) => {
      return `
        <item>
          <title><![CDATA[${item.title}]]></title>
          <link>${siteConfig.url}/${item.slug}</link>
          <guid isPermaLink="true">${siteConfig.url}/${item.slug}</guid>
          <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
          <description><![CDATA[${item.summary}]]></description>
        </item>
      `;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${siteConfig.name}</title>
      <link>${siteConfig.url}</link>
      <description>${siteConfig.description}</description>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}

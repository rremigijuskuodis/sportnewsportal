import { mockArticleFeed } from "@/lib/mock-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://naujienos.sicenterhub.com";

export async function GET() {
  const items = mockArticleFeed
    .map((item) => {
      return `
        <item>
          <title><![CDATA[${item.title}]]></title>
          <link>${siteUrl}/${item.slug}</link>
          <guid isPermaLink="true">${siteUrl}/${item.slug}</guid>
          <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
          <description><![CDATA[${item.summary}]]></description>
        </item>
      `;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>SicenterHub News</title>
      <link>${siteUrl}</link>
      <description>Sporto naujienų portalas</description>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}

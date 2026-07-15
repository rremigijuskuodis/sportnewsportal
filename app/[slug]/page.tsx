import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/portal-ui";
import { preparePortalData } from "@/lib/portal-data";
import { loadPortalFeed } from "@/lib/supabase";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { articleFeed, shortFeed } = await loadPortalFeed();
  const item = [...articleFeed, ...shortFeed].find((entry) => entry.slug === params.slug);
  if (!item) return { title: "Naujiena nerasta", robots: { index: false, follow: false } };
  const description = item.lead || item.summary;
  return {
    title: item.title,
    description,
    alternates: { canonical: `/${item.slug}` },
    openGraph: {
      title: item.title,
      description,
      url: `/${item.slug}`,
      type: "article",
      publishedTime: item.publishedAt,
      authors: [item.sourceName],
      images: item.imageUrl ? [{ url: item.imageUrl, alt: item.imageAlt || item.title }] : undefined
    },
    twitter: { card: item.imageUrl ? "summary_large_image" : "summary", title: item.title, description, images: item.imageUrl ? [item.imageUrl] : undefined }
  };
}

export default async function SlugPage({
  params
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { articleFeed, shortFeed } = await loadPortalFeed();
  const { radar } = preparePortalData(articleFeed, shortFeed);
  const item = [...articleFeed, ...shortFeed].find((entry) => entry.slug === slug);

  if (!item) {
    notFound();
  }

  const related = articleFeed
    .filter((entry) => entry.slug !== item.slug)
    .filter((entry) => Boolean(entry.imageUrl))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.lead || item.summary,
    datePublished: item.publishedAt,
    dateModified: item.publishedAt,
    mainEntityOfPage: `${siteConfig.url}/${item.slug}`,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: `${siteConfig.url}/apie`
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logoPath}`
      }
    },
    citation: item.sourceUrl || undefined,
    image: item.imageUrl ? [item.imageUrl] : undefined
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ArticlePage item={item} related={related} radar={radar} />
    </>
  );
}

import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/portal-ui";
import { preparePortalData } from "@/lib/portal-data";
import { loadPortalFeed } from "@/lib/supabase";

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

  return <ArticlePage item={item} related={related} radar={radar} />;
}

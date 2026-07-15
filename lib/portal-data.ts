import type { FeedItem } from "@/lib/types";

function getVisibleItems(items: FeedItem[]) {
  const seen = new Set<string>();
  const seenTitles = new Set<string>();

  return items.filter((item) => {
    if (item.riskLevel === "high" && item.status !== "published") return false;
    if (item.possibleDuplicate) {
      const key = item.topicKey || item.slug;
      if (seen.has(key)) return false;
      seen.add(key);
    }
    const titleKey = item.title.toLocaleLowerCase("lt-LT").replace(/[^a-z0-9ąčęėįšųūž]+/gi, " ").trim();
    if (titleKey && seenTitles.has(titleKey)) return false;
    if (titleKey) seenTitles.add(titleKey);
    return true;
  });
}

function hoursSince(value: string) {
  return Math.max(0, (Date.now() - new Date(value).getTime()) / 3_600_000);
}

const HERO_FRESH_HOURS = 36;
const MANUAL_FEATURE_HOURS = 6;

function sportBucket(value: string) {
  const sport = value.toLocaleLowerCase("lt-LT");
  if (sport.includes("krep") || sport.includes("basket")) return "basketball";
  if (sport.includes("fut") || sport.includes("foot") || sport.includes("soccer")) return "football";
  if (sport.includes("vady") || sport.includes("management")) return "management";
  if (sport.includes("rengin") || sport.includes("event")) return "events";
  return "other";
}

export function preparePortalData(articleFeed: FeedItem[], shortFeed: FeedItem[]) {
  const articles = getVisibleItems(
    [...articleFeed].filter((item) => Boolean(item.imageUrl)).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  );

  const radar = getVisibleItems(
    [...shortFeed]
      .filter((item) => item.shortNewsPossible !== false)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  );

  const freshArticles = articles.filter((item) => hoursSince(item.publishedAt) <= HERO_FRESH_HOURS);
  const heroPool = freshArticles.length ? freshArticles : articles.slice(0, 12);
  const manuallyFeatured = heroPool.find(
    (item) => item.isFeatured && hoursSince(item.publishedAt) <= MANUAL_FEATURE_HOURS
  );
  // Pagal nutylejima Hero visada seka naujausia tinkama publikacija.
  // Redaktoriaus isFeatured pasirinkimas turi pirmenybe tik pirmas 6 valandas.
  const hero = manuallyFeatured || heroPool[0];
  const important = articles
    .filter((item) => item.id !== hero?.id && (item.priorityScore || 0) >= 4)
    .slice(0, 4);
  const latest = articles.filter((item) => item.id !== hero?.id);

  const groups = [
    {
      title: "Krepšinis",
      sport: "krepsinis",
      items: articles.filter((item) => sportBucket(item.sport) === "basketball").slice(0, 3)
    },
    {
      title: "Futbolas",
      sport: "futbolas",
      items: articles.filter((item) => sportBucket(item.sport) === "football").slice(0, 3)
    },
    {
      title: "Kitos sporto šakos",
      sport: "kitos-sporto-sakos",
      items: articles.filter((item) => sportBucket(item.sport) === "other").slice(0, 6)
    },
    {
      title: "Sporto vadyba",
      sport: "sporto-vadyba",
      items: articles.filter((item) => sportBucket(item.sport) === "management").slice(0, 3)
    },
    {
      title: "Renginiai",
      sport: "renginiai",
      items: articles.filter((item) => sportBucket(item.sport) === "events").slice(0, 3)
    }
  ].filter((group) => group.items.length > 0);

  const eventDateFormatter = new Intl.DateTimeFormat("lt-LT", { month: "long", day: "numeric" });
  const events = getVisibleItems([...articleFeed, ...shortFeed])
    .filter((item) => {
      const category = item.category.toLowerCase();
      return category.includes("event") || category.includes("rengin") || category.includes("broadcast");
    })
    .filter((item) => Boolean(item.sourceUrl))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6)
    .map((item) => ({
      title: item.title,
      dateLabel: eventDateFormatter.format(new Date(item.publishedAt)),
      place: item.sourceName,
      description: item.summary,
      href: item.sourceUrl || `/${item.slug}`,
      imageUrl: item.imageUrl
    }));

  return { hero, important, latest, radar, groups, events };
}

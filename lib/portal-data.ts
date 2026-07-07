import type { FeedItem } from "@/lib/types";

function getVisibleItems(items: FeedItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (item.riskLevel === "high" && item.status !== "published") return false;
    if (item.possibleDuplicate) {
      const key = item.topicKey || item.slug;
      if (seen.has(key)) return false;
      seen.add(key);
    }
    return true;
  });
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

  const hero = articles.find((item) => item.featured) || articles[0];
  const important = articles
    .filter((item) => item.id !== hero?.id && (item.priorityScore || 0) >= 4)
    .slice(0, 4);
  const latest = articles.filter((item) => item.id !== hero?.id);

  const groups = [
    {
      title: "Krepšinis",
      sport: "krepsinis",
      items: articles.filter((item) => item.sport.toLowerCase().includes("krep")).slice(0, 3)
    },
    {
      title: "Futbolas",
      sport: "futbolas",
      items: articles.filter((item) => item.sport.toLowerCase().includes("fut")).slice(0, 3)
    },
    {
      title: "Kitos sporto šakos",
      sport: "kitos-sporto-sakos",
      items: articles.filter((item) => item.sport.toLowerCase().includes("kitos")).slice(0, 3)
    },
    {
      title: "Sporto vadyba",
      sport: "sporto-vadyba",
      items: articles.filter((item) => item.sport.toLowerCase().includes("vady")).slice(0, 3)
    },
    {
      title: "Renginiai",
      sport: "renginiai",
      items: articles.filter((item) => item.sport.toLowerCase().includes("rengin")).slice(0, 3)
    }
  ].filter((group) => group.items.length > 0);

  const events = [
    {
      title: "Tarptautinis jaunimo turnyras",
      dateLabel: "Liepos 18",
      place: "Vilnius",
      description: "Jaunimo komandas, trenerius ir sporto bendruomenę subursiantis tarptautinis turnyras. Tiksli programa ir dalyvių sąrašas bus papildyti organizatoriams paskelbus informaciją."
    },
    {
      title: "3x3 savaitgalio etapas",
      dateLabel: "Liepos 21",
      place: "Kaunas",
      description: "Atviras 3x3 krepšinio savaitgalis su keliomis amžiaus grupėmis ir bendruomenės veiklomis. Registracijos bei tvarkaraščio informacija bus atnaujinta prieš renginį."
    },
    {
      title: "Federacijų rudens kalendoriaus forumas",
      dateLabel: "Liepos 25",
      place: "Online / Vilnius",
      description: "Darbinė sporto organizacijų sesija apie rudens renginių datas, auditorijų persidengimą ir bendras komunikacijos galimybes. Prisijungimo informacija bus paskelbta vėliau."
    }
  ];

  return { hero, important, latest, radar, groups, events };
}

import { HomePortal } from "@/components/portal-ui";
import { preparePortalData } from "@/lib/portal-data";
import { loadPortalFeed } from "@/lib/supabase";

export default async function HomePage() {
  const { shortFeed, articleFeed } = await loadPortalFeed();
  const { hero, important, latest, radar, groups, events } = preparePortalData(
    articleFeed,
    shortFeed
  );

  if (!hero) {
    return null;
  }

  return (
    <HomePortal
      hero={hero}
      topStories={important}
      latest={latest}
      radar={radar}
      sections={groups}
      events={events}
    />
  );
}

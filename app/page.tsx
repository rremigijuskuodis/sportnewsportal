import { HomePortal } from "@/components/portal-ui";
import { preparePortalData } from "@/lib/portal-data";
import { loadPortalFeed } from "@/lib/supabase";

export default async function HomePage() {
  const { shortFeed, articleFeed } = await loadPortalFeed();
  const { hero, latest, radar, groups, events } = preparePortalData(
    articleFeed,
    shortFeed
  );

  if (!hero) {
    return (
      <main style={{ padding: 24, fontFamily: "Inter, sans-serif" }}>
        Nepavyko užkrauti portalo turinio. Patikrinkite Supabase duomenis arba pabandykite
        perkrauti puslapį.
      </main>
    );
  }

  return (
    <HomePortal
      hero={hero}
      latest={latest}
      radar={radar}
      sections={groups}
      events={events}
    />
  );
}

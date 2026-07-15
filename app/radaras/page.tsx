import type { Metadata } from "next";
import { Header, Footer, ShortSignalCard } from "@/components/portal-ui";
import { loadPortalFeed } from "@/lib/supabase";
import { preparePortalData } from "@/lib/portal-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sporto radaras",
  description: "Trumpi naujausi signalai iš Lietuvos ir pasaulio sporto.",
  alternates: { canonical: "/radaras" }
};

export default async function RadarPage() {
  const { articleFeed, shortFeed } = await loadPortalFeed();
  const { radar } = preparePortalData(articleFeed, shortFeed);

  return (
    <main className="site-shell radar-page">
      <Header />
      <div className="page-shell radar-page-shell">
        <section className="content-block radar-page-panel">
          <div className="block-head radar-page-head">
            <div>
              <span className="section-kicker live-kicker"><span className="live-dot" /> Gyvas srautas</span>
              <h1>Sporto radaras</h1>
            </div>
            <p>Trumpi naujausi signalai iš Lietuvos ir pasaulio sporto.</p>
          </div>
          <div className="radar-page-list">
            {radar.length ? radar.map((item) => <ShortSignalCard key={item.id} item={item} />) : <p>Šiuo metu naujų signalų nėra.</p>}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

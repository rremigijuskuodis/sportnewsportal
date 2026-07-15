import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, NewsCard, SportCategoryNav } from "@/components/portal-ui";
import { loadPortalFeed } from "@/lib/supabase";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Visos naujienos | Sporto Radaras",
  description: "Lietuvos sporto naujienų archyvas: rezultatai, futbolas, krepšinis ir sporto vadyba."
};

export default async function NewsArchivePage() {
  const { articleFeed } = await loadPortalFeed();
  const items = [...articleFeed].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <main className="page-shell">
      <Header />
      <SportCategoryNav />
      <section className="content-block archive-page">
        <div className="block-head">
          <div>
            <span className="section-kicker">Archyvas</span>
            <h1>Visos naujienos</h1>
            <p>Čia lieka ir ankstesni publikuoti straipsniai – ne tik šiandienos naujienos.</p>
          </div>
          <Link href="/" className="ghost-link">Į pradžią</Link>
        </div>
        <div className="section-grid archive-grid">
          {items.map((item) => <NewsCard key={item.id} item={item} />)}
        </div>
        {!items.length ? <p className="search-empty">Publikuotų straipsnių kol kas nėra.</p> : null}
      </section>
      <Footer />
    </main>
  );
}

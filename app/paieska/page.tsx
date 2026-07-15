import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard, Header, SportCategoryNav, Footer } from "@/components/portal-ui";
import { loadPortalFeed } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Paieška",
  description: "Ieškokite Lietuvos sporto naujienų pagal temą, sporto šaką ar šaltinį.",
  robots: { index: false, follow: true }
};

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = String(searchParams.q || "").trim();
  const { articleFeed, shortFeed } = await loadPortalFeed();
  const haystack = (item: (typeof articleFeed)[number]) => [item.title, item.summary, item.lead, item.sport, item.category, item.sourceName].join(" ").toLocaleLowerCase("lt-LT");
  const results = query ? [...articleFeed, ...shortFeed].filter((item) => haystack(item).includes(query.toLocaleLowerCase("lt-LT"))).slice(0, 40) : [];

  return (
    <main className="page-shell">
      <Header />
      <SportCategoryNav />
      <section className="content-block search-results-page">
        <span className="section-kicker">Paieška</span>
        <h1>{query ? `Paieškos rezultatai: „${query}“` : "Ieškoti naujienų"}</h1>
        {!query ? <p className="search-empty">Įrašykite temą, komandą, sporto šaką arba šaltinį.</p> : null}
        {query && !results.length ? <p className="search-empty">Rezultatų neradome. Pabandykite kitą paieškos frazę.</p> : null}
        <div className="section-grid">
          {results.map((item) => <NewsCard key={item.id} item={item} />)}
        </div>
        <Link href="/" className="primary-link search-back">Grįžti į pradžią</Link>
      </section>
      <Footer />
    </main>
  );
}

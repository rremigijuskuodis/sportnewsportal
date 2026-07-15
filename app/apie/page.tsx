import type { Metadata } from "next";
import { Footer, Header, SportCategoryNav } from "@/components/portal-ui";

export const metadata: Metadata = {
  title: "Apie Sporto Radarą",
  description: "Kas yra Sporto Radaras, ką aprašome ir kas leidžia portalą.",
  alternates: { canonical: "/apie" }
};

export default function AboutPage() {
  return (
    <main className="page-shell editorial-shell">
      <Header />
      <SportCategoryNav />
      <article className="editorial-page">
        <span className="section-kicker">Apie mus</span>
        <h1>Sporto naujienos platesniu kampu</h1>
        <p className="editorial-lead">
          „Sporto Radaras“ – VšĮ Sporto inovacijų centro kuriamas Lietuvos sporto naujienų
          portalas. Mums svarbūs ne tik rezultatai, bet ir žmonės, klubai, federacijos,
          bendruomenės, sporto vadyba bei inovacijos.
        </p>
        <h2>Ką rasite portale?</h2>
        <p>
          Publikuojame aktualias Lietuvos ir pasaulio sporto naujienas, rezultatų apžvalgas,
          kontekstą bei trumpą gyvą sporto radarą. Siekiame, kad mažiau matomos sporto šakos
          turėtų vietą šalia populiariausių temų.
        </p>
        <h2>Kas atsako už portalą?</h2>
        <p>
          Portalo leidėjas – VšĮ Sporto inovacijų centras, įmonės kodas 307709669.
          Redakciniai ir bendradarbiavimo klausimai priimami kontaktų puslapyje.
        </p>
      </article>
      <Footer />
    </main>
  );
}

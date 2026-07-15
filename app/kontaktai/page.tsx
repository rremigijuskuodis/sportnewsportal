import type { Metadata } from "next";
import { Footer, Header, SportCategoryNav } from "@/components/portal-ui";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kontaktai",
  description: `${siteConfig.publisher} kontaktai ir rekvizitai.`,
  alternates: { canonical: "/kontaktai" }
};

export default function ContactsPage() {
  return (
    <main className="page-shell contact-shell">
      <Header />
      <SportCategoryNav />
      <section className="contact-card" aria-labelledby="contact-title">
        <span className="section-kicker">Kontaktai</span>
        <h1 id="contact-title">Susisiekime</h1>
        <p className="contact-intro">
          „Sporto Radarą“ leidžia ir administruoja {siteConfig.publisher}.
        </p>

        <dl className="contact-details">
          <div><dt>Įstaiga</dt><dd>{siteConfig.publisher}</dd></div>
          <div><dt>Įmonės kodas</dt><dd>{siteConfig.publisherCode}</dd></div>
          <div><dt>El. paštas</dt><dd><a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></dd></div>
          <div><dt>Telefonas</dt><dd><a href="tel:+37069093370">+370 690 93370</a></dd></div>
        </dl>
      </section>
      <Footer />
    </main>
  );
}

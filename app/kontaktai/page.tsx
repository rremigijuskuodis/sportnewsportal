import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kontaktai | Sporto redakcija",
  description: "VŠĮ Sporto inovacijų centro kontaktai ir rekvizitai."
};

export default function ContactsPage() {
  return (
    <main className="page-shell contact-shell">
      <header className="site-header">
        <Link href="/" className="brandmark" aria-label="Sporto redakcija – pradinis puslapis">
          <img className="brand-logo" src="/brand/sporto-radaras-logo.png" alt="Sporto Radaras" />
        </Link>
      </header>

      <section className="contact-card" aria-labelledby="contact-title">
        <span className="section-kicker">Kontaktai</span>
        <h1 id="contact-title">Susisiekime</h1>
        <p className="contact-intro">
          Sporto naujienų portalą administruoja VŠĮ Sporto inovacijų centras.
        </p>

        <dl className="contact-details">
          <div>
            <dt>Įstaiga</dt>
            <dd>VŠĮ Sporto inovacijų centras</dd>
          </div>
          <div>
            <dt>Įmonės kodas</dt>
            <dd>307709669</dd>
          </div>
          <div>
            <dt>El. paštas</dt>
            <dd><a href="mailto:remigijus@sicenterhub.com">remigijus@sicenterhub.com</a></dd>
          </div>
          <div>
            <dt>Telefonas</dt>
            <dd><a href="tel:+37069093370">+370 690 93370</a></dd>
          </div>
        </dl>

        <Link href="/" className="primary-link contact-back">Grįžti į portalą</Link>
      </section>
    </main>
  );
}

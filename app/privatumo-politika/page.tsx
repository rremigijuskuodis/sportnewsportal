import type { Metadata } from "next";
import { Footer, Header, SportCategoryNav } from "@/components/portal-ui";

export const metadata: Metadata = {
  title: "Privatumo politika",
  description: "Sporto Radaro privatumo ir analitikos naudojimo informacija.",
  alternates: { canonical: "/privatumo-politika" }
};

export default function PrivacyPage() {
  return (
    <main className="page-shell editorial-shell">
      <Header />
      <SportCategoryNav />
      <article className="editorial-page">
        <span className="section-kicker">Privatumas</span>
        <h1>Privatumo politika</h1>
        <p className="editorial-lead">Gerbiame lankytojų pasirinkimą ir renkame tik portalui valdyti reikalingus duomenis.</p>
        <h2>Techniniai duomenys</h2>
        <p>
          Svetainės talpinimo ir saugumo paslaugų teikėjai gali apdoroti techninius užklausų
          duomenis, pavyzdžiui, IP adresą, naršyklės tipą ir užklausos laiką, kad portalas veiktų
          saugiai ir stabiliai.
        </p>
        <h2>„Google Analytics“</h2>
        <p>
          Analitika įjungiama tik gavus lankytojo sutikimą. Ji naudojama bendroms lankomumo,
          skaitomiausių temų ir puslapių naudojimo tendencijoms suprasti. Reklaminiai slapukai
          pagal numatytuosius nustatymus išjungti.
        </p>
        <h2>Jūsų pasirinkimas</h2>
        <p>
          Galite nesutikti su analitika – portalas dėl to veiks taip pat. Sutikimo pasirinkimą
          galima panaikinti išvalius svetainės duomenis naršyklėje.
        </p>
        <h2>Valdytojas</h2>
        <p>
          Duomenų valdytojas – VšĮ Sporto inovacijų centras, įmonės kodas 307709669.
          Privatumo klausimai priimami adresu remigijus@sicenterhub.com.
        </p>
      </article>
      <Footer />
    </main>
  );
}

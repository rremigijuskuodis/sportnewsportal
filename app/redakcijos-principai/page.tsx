import type { Metadata } from "next";
import { Footer, Header, SportCategoryNav } from "@/components/portal-ui";

export const metadata: Metadata = {
  title: "Redakcijos principai",
  description: "Sporto Radaro šaltinių, tikslumo, taisymų ir publikavimo principai.",
  alternates: { canonical: "/redakcijos-principai" }
};

export default function EditorialPrinciplesPage() {
  return (
    <main className="page-shell editorial-shell">
      <Header />
      <SportCategoryNav />
      <article className="editorial-page">
        <span className="section-kicker">Pasitikėjimas</span>
        <h1>Redakcijos principai</h1>
        <p className="editorial-lead">
          Skelbiame tik tokią informaciją, kurios šaltinį galime nurodyti ir kurios faktus
          galima pagrįstai patikrinti.
        </p>
        <h2>Šaltiniai ir autorystė</h2>
        <p>
          Prie publikacijų nurodome pirminį informacijos šaltinį. Kitų leidinių turinys nėra
          kopijuojamas pažodžiui – faktai apibendrinami, pateikiamas savas kontekstas ir nuoroda.
          Nuotraukų autoriai bei licencijos nurodomi, kai ši informacija prieinama.
        </p>
        <h2>Tikslumas ir rizika</h2>
        <p>
          Rezultatai, datos, vardai ir statistika tikrinami pagal pateiktus šaltinius. Jautrios,
          nepatvirtintos ar didelės rizikos temos nėra publikuojamos be žmogaus peržiūros.
        </p>
        <h2>Taisymai</h2>
        <p>
          Pastebėję esminę klaidą ją pataisome, o reikšmingo pakeitimo atveju publikacijoje
          pažymime atnaujinimą. Apie klaidą galima pranešti per kontaktų puslapį.
        </p>
        <h2>Automatizuoti procesai</h2>
        <p>
          Technologijos padeda stebėti šaltinius, grupuoti temas ir parengti juodraščius, tačiau
          publikacijoms taikomos tos pačios tikslumo, šaltinių ir rizikos taisyklės.
        </p>
      </article>
      <Footer />
    </main>
  );
}

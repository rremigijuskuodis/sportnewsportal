# SicenterHub News

Deployment sync marker: 2026-07-07

Pirma sporto naujienų portalo versija, paruošta Vercel + Supabase architektūrai.

## Ką šis karkasas daro

- rodo pagrindinį straipsnių feedą;
- rodo trumpų naujienų šoninį feedą;
- turi fallback mock duomenis, jei Supabase dar neprijungtas;
- turi SQL schemą straipsniams ir social queue;
- paruoštas SEO ir future social automatikai.

## Pirmas paleidimas lokaliai

1. Įrašyk `.env.local` pagal `.env.example`.
2. Įdiek priklausomybes.
3. Paleisk `npm run dev`.

## Supabase

Įkelk `supabase/schema.sql` į Supabase SQL editorių.

Svarbūs stulpeliai:

- `format` = `short` arba `article`
- `status` = `published`
- `published_at` nusako rodomą laiką

## Vercel

Vercel deployment'ui reikės šių env:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Tolesni žingsniai

1. Prijungti realų Supabase projektą.
2. Susieti Apps Script generatorių su `articles` lentele.
3. Pridėti social queue ir autopostingą.
4. Uždėti sitemap, RSS ir indexing logiką.

## Apps Script publikavimas

Portalui jau paruoštas atskiras Apps Script modulis:

- `PortalPublisher.gs`

Paleidimo eiga:

1. Į Apps Script projektą pridėti `PortalPublisher.gs`.
2. Paleisti `setSupabaseConfig()`.
3. Straipsnių lape pažymėti `editor_decision = approved`.
4. Paleisti `publishApprovedArticles()`.

Kas vyksta:

- `draft_ready` + `approved` straipsniai keliami į `public.articles`.
- `published_url` užpildomas portalo nuoroda.
- `published_at` įrašomas publikavimo laikas.

## Auto publish

Apps Script meniu dabar yra:

- `Ijungti auto-publish triggeri`
- `Isjungti auto-publish triggeri`

Kai triggeris ijungtas:

- kas 15 min. tikrinami `approved` + `draft_ready` straipsniai;
- jie automatiskai publikuojami i `public.articles`;
- po publikavimo sukuriami `social_queue` irasai Facebook, Instagram ir X tinklams, jei yra tekstai.

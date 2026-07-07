import type { FeedItem } from "@/lib/types";

const today = "2026-07-07";

export const mockShortFeed: FeedItem[] = [
  {
    id: "signal-1",
    title: "LKL klubai dėlioja vasaros sudėtis: lietuvių gynėjų rinka juda sparčiau",
    summary: "Klubai ieško pigesnių rotacijos sprendimų, todėl liepos vidurys gali tapti aktyviausiu parašų laikotarpiu.",
    bodyMarkdown:
      "LKL rinkoje ryškėja ankstyvi komplektacijos signalai. Klubai dar saugo biudžetus, tačiau lietuvių gynėjų rinka juda sparčiau nei tikėtasi.",
    category: "transferai",
    sport: "krepšinis",
    sourceName: "Sporto radaras",
    slug: "lkl-klubai-delioja-vasaros-sudetis",
    format: "short",
    publishedAt: `${today}T14:18:00+03:00`,
    label: "Radaras",
    whyItMatters: "Ankstyvi sprendimai dažnai išduoda, kurie klubai turi aiškiausią sezono planą.",
    priorityScore: 4,
    shortNewsPossible: true,
    draftRecommended: true,
    riskLevel: "low"
  },
  {
    id: "signal-2",
    title: "A lygos klubai aktyvina vasaros langą prieš lemiamą sezono atkarpą",
    summary: "Vieni ieško puolėjų, kiti pirmiausia stiprina gynybos grandį ir trumpalaikį stabilumą.",
    bodyMarkdown:
      "A lygoje artėjant lemiamai sezono daliai klubai pradeda ieškoti greito efekto ir žaidėjų, kurie gali iškart įeiti į struktūrą.",
    category: "transferai",
    sport: "futbolas",
    sourceName: "Sporto radaras",
    slug: "a-lygos-klubai-aktyvina-vasaros-langa",
    format: "short",
    publishedAt: `${today}T13:42:00+03:00`,
    label: "Signalas",
    whyItMatters: "Vasaros langas dažnai tiesiogiai pakeičia lentelės viršų ir kovą dėl išlikimo.",
    priorityScore: 4,
    shortNewsPossible: true,
    draftRecommended: true,
    riskLevel: "low"
  },
  {
    id: "signal-3",
    title: "Vilniuje daugėja kalbų apie naują tarptautinį jaunimo turnyrą rudenį",
    summary: "Organizatoriai vertina partnerių susidomėjimą ir ieško platesnio miestų bei federacijų įsitraukimo.",
    bodyMarkdown:
      "Jaunimo turnyro idėja Vilniuje įgauna pagreitį, nes organizatoriai jau kalba ne tik apie datą, bet ir apie regioninį mastą.",
    category: "renginiai",
    sport: "kitos sporto šakos",
    sourceName: "Sporto radaras",
    slug: "vilniuje-daugeja-kalbu-apie-nauja-jaunimo-turnyra",
    format: "short",
    publishedAt: `${today}T12:58:00+03:00`,
    label: "Renginiai",
    whyItMatters: "Tokie turnyrai tampa įėjimo tašku naujoms partnerystėms ir platesnei bendruomenei.",
    priorityScore: 3,
    shortNewsPossible: true,
    draftRecommended: false,
    riskLevel: "low"
  },
  {
    id: "signal-4",
    title: "Federacijos tikrina rudens kalendoriaus dubliavimus tarp regioninių startų",
    summary: "Kelių sporto šakų bendruomenėse daugėja susidūrimų dėl datų ir savanorių resursų.",
    bodyMarkdown:
      "Kalendoriaus dubliavimai tampa vadybiniu klausimu, nes tie patys miestai ir komandos nebegali išsidalinti savaitgalių.",
    category: "kalendorius",
    sport: "sporto vadyba",
    sourceName: "Sporto radaras",
    slug: "federacijos-tikrina-rudens-kalendoriaus-dubliavimus",
    format: "short",
    publishedAt: `${today}T12:16:00+03:00`,
    label: "AI įžvalga",
    whyItMatters: "Geras kalendorius tiesiogiai veikia dalyvių skaičių, partnerių vertę ir renginių kokybę.",
    priorityScore: 3,
    shortNewsPossible: true,
    draftRecommended: true,
    riskLevel: "medium"
  },
  {
    id: "signal-5",
    title: "Lietuvos paplūdimio tinklinio poros renka taškus prieš svarbų tarptautinį etapą",
    summary: "Keli stabilūs rezultatai gali ženkliai pagerinti startines pozicijas kitose savaitėse.",
    bodyMarkdown:
      "Paplūdimio tinklinio rinktinėms svarbus ne vien galutinis laimėjimas, bet ir ritmas prieš artimiausius tarptautinius etapus.",
    category: "rezultatai",
    sport: "kitos sporto šakos",
    sourceName: "Sporto radaras",
    slug: "papludimio-tinklinio-poros-renka-taskus",
    format: "short",
    publishedAt: `${today}T11:37:00+03:00`,
    label: "Rezultatai",
    whyItMatters: "Mažesnėse sporto šakose net vienas geras etapas gali atverti geresnį viso sezono kelią.",
    priorityScore: 3,
    shortNewsPossible: true,
    draftRecommended: false,
    riskLevel: "low"
  },
  {
    id: "signal-6",
    title: "Diskusijos dėl arenų užimtumo Kaune gali paliesti rudenio turnyrų organizatorius",
    summary: "Jei grafikai nesusiderins, daliai renginių gali tekti ieškoti alternatyvių vietų.",
    bodyMarkdown:
      "Arenų užimtumas tampa ne tik logistikos, bet ir pajamų klausimu, nes renginio vieta smarkiai keičia bilietų bei rėmėjų potencialą.",
    category: "infrastruktūra",
    sport: "sporto vadyba",
    sourceName: "Sporto radaras",
    slug: "diskusijos-del-arenos-uzimtumo-kaune",
    format: "short",
    publishedAt: `${today}T10:54:00+03:00`,
    label: "Rizika",
    whyItMatters: "Infrastruktūros ribojimai greitai persikelia į finansinę ir komunikacinę renginių pusę.",
    priorityScore: 4,
    shortNewsPossible: true,
    draftRecommended: true,
    riskLevel: "medium"
  },
  {
    id: "signal-7",
    title: "U17 rinktinių vasaros ciklas kelia daugiau dėmesio regionų akademijoms",
    summary: "Skautingas krypsta ne tik į didmiesčius, bet ir į mažesnius sporto centrus.",
    bodyMarkdown:
      "Jaunimo rinktinių ciklai padeda išryškinti ne vien pavardes, bet ir stipriau dirbančias regionų struktūras.",
    category: "jaunimas",
    sport: "futbolas",
    sourceName: "Sporto radaras",
    slug: "u17-rinktiniu-vasaros-ciklas-kelia-demesio-regionams",
    format: "short",
    publishedAt: `${today}T09:48:00+03:00`,
    label: "Jaunimas",
    whyItMatters: "Tai signalas, kur ateityje gali augti nauji klubų ir federacijų prioritetai.",
    priorityScore: 2,
    shortNewsPossible: true,
    draftRecommended: false,
    riskLevel: "low"
  },
  {
    id: "signal-8",
    title: "Partnerių rinkoje daugėja klausimų dėl sporto renginių matuojamos grąžos",
    summary: "Rėmėjai nori aiškesnių skaičių apie auditoriją, įsitraukimą ir ilgalaikį poveikį.",
    bodyMarkdown:
      "Sporto projektams vis dažniau reikia ne vien idėjos, bet ir aiškiai pamatuojamos vertės rėmėjams bei miestams.",
    category: "partnerystės",
    sport: "sporto vadyba",
    sourceName: "Sporto radaras",
    slug: "partneriu-rinkoje-daugiau-klausimu-del-grazos",
    format: "short",
    publishedAt: `${today}T08:55:00+03:00`,
    label: "Vadyba",
    whyItMatters: "Be aiškių rodiklių vis sunkiau pritraukti ilgalaikį finansavimą sporto iniciatyvoms.",
    priorityScore: 5,
    shortNewsPossible: true,
    draftRecommended: true,
    riskLevel: "low"
  }
];

export const mockArticleFeed: FeedItem[] = [
  {
    id: "article-1",
    title: "Lietuvos sporto naujienų portalai keičiasi: greitis lieka, bet svarbiausia tampa aiškumas",
    summary: "Auditorija nori ne triukšmo, o patikimai sudėliotos dienos sporto darbotvarkės — nuo rezultatų iki vadybinių signalų.",
    lead: "Naujos kartos sporto portalui neužtenka vien greitai perkelti antraštę. Reikia atsirinkti, kas svarbu, ir tai pateikti švariai bei patogiai skaityti.",
    bodyMarkdown:
      "Lietuvos sporto informacijos lauke daugėja ne tik naujienų, bet ir triukšmo. Dėl to skaitytojas vis dažniau ieško ne didesnio kiekio, o geresnės atrankos.\n\n" +
      "Būtent todėl modernus sporto portalas turi derinti du sluoksnius: greitą radarą, kuris leidžia sekti dienos pulsą, ir pilnus straipsnius, kurie suteikia kontekstą, kryptį bei pasitikėjimą.\n\n" +
      "Tokio modelio tikslas yra ne kopijuoti tradicinį portalą, o sukurti švaresnę redakcinę patirtį, kur vienodai matomos tiek populiarios sporto šakos, tiek mažesnės bendruomenės, federacijos ir renginiai.",
    category: "analizė",
    sport: "sporto vadyba",
    sourceName: "SicenterHub redakcija",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Pilna sporto arena ir ryški mėlyna šviesa",
    slug: "lietuvos-sporto-naujienu-portalai-keiciasi",
    format: "article",
    publishedAt: `${today}T08:10:00+03:00`,
    readTimeMinutes: 4,
    status: "published",
    whyItMatters: "Jei portalas aiškiai atskiria signalą nuo triukšmo, skaitytojas jį naudoja kasdien, o ne tik atsitiktinai.",
    priorityScore: 5,
    featured: true,
    draftRecommended: true,
    riskLevel: "low"
  },
  {
    id: "article-2",
    title: "LKL vasaros rinka įsibėgėja: klubai renkasi tarp kantrybės ir greitų parašų",
    summary: "Biudžetų spaudimas verčia komandas anksčiau priimti sprendimus, tačiau skubėjimas gali kainuoti sezono balansą.",
    lead: "Pirmieji vasaros sprendimai LKL dažnai pasako daugiau nei garsiausi parašai rugpjūtį — jie parodo, ar klubas žino, ko ieško.",
    bodyMarkdown:
      "LKL klubų vasara šiemet prasidėjo atsargiau, tačiau rinkoje jau juntamas didesnis judėjimas lietuvių rotacinių žaidėjų segmente.\n\n" +
      "Komandos, kurios turi aiškesnę sportinę kryptį, gali išvengti brangių paskutinės minutės sprendimų. Tuo tarpu klubai, kurie laukia per ilgai, rizikuoja permokėti už vaidmens žaidėjus.\n\n" +
      "Rinkos tempas ypač svarbus klubams, kurie nori išlaikyti konkurencingumą ne tik lygoje, bet ir tarptautiniuose turnyruose.",
    category: "aktualu",
    sport: "krepšinis",
    sourceName: "SicenterHub redakcija",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Krepšinio rungtynių momentas",
    slug: "lkl-vasaros-rinka-isibegeja",
    format: "article",
    publishedAt: `${today}T10:25:00+03:00`,
    readTimeMinutes: 5,
    status: "published",
    whyItMatters: "Nuo vasaros komplektacijos kokybės dažnai tiesiogiai priklauso, ar klubas kovos dėl viršaus, ar tik gesins spragas.",
    priorityScore: 5,
    draftRecommended: true,
    riskLevel: "low"
  },
  {
    id: "article-3",
    title: "A lygos vasara: komandų sprendimus vis stipriau diktuoja ne tik rezultatai, bet ir stabilumas",
    summary: "Klubai ieško ne vien talento — jiems vis svarbiau nuspėjama struktūra, žaidėjų prieinamumas ir finansinė drausmė.",
    lead: "Vasaros langas A lygoje nėra tik papildymas. Jis dažnai tampa lakmuso popierėliu, ar klubas veikia kaip sistema.",
    bodyMarkdown:
      "A lygos komandos artėdamos prie antros sezono pusės sprendžia dvi užduotis vienu metu: kaip išlaikyti rezultatą dabar ir kaip nesusikurti didesnių problemų rudenį.\n\n" +
      "Todėl rinkoje ieškoma ne tik ryškių vardų, bet ir žaidėjų, kurie gali greitai įsilieti į struktūrą. Stabilumas šiame etape tampa beveik tokia pačia verte kaip individuali kokybė.\n\n" +
      "Toks požiūris ypač svarbus komandoms, kurioms kiekvienas taškas sezono pabaigoje bus kritinis.",
    category: "aktualu",
    sport: "futbolas",
    sourceName: "SicenterHub redakcija",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Futbolo stadionas ir žaidėjas su kamuoliu",
    slug: "a-lygos-vasara-stabilumas-svarbiau-nei-garsus-pirkiniai",
    format: "article",
    publishedAt: `${today}T11:05:00+03:00`,
    readTimeMinutes: 4,
    status: "published",
    whyItMatters: "Sezono vidurio sprendimai dažnai lemia ne vien lentelę, bet ir klubo reputaciją kitam ciklui.",
    priorityScore: 4,
    draftRecommended: true,
    riskLevel: "low"
  },
  {
    id: "article-4",
    title: "Sporto vadyboje daugėja vieno klausimo: kaip renginiams įrodyti realią vertę partneriams",
    summary: "Rėmėjai prašo ne tik logotipų matomumo, bet ir duomenų apie auditoriją, poveikį bei tęstinumą.",
    lead: "Sporto projektams nebepakanka būti gražiai pristatytiems — jie turi būti pamatuojami.",
    bodyMarkdown:
      "Partnerių lūkesčiai sporto renginiams tampa vis konkretesni. Jei anksčiau pakakdavo pažado apie matomumą, dabar dažniau prašoma aiškių įrodymų: kas ateis, ką jie veiks ir kokia bus grąža.\n\n" +
      "Tai keičia ne tik pardavimo kalbą, bet ir patį renginių planavimą. Organizatoriai turi anksčiau galvoti apie auditorijos duomenis, komunikacijos struktūrą ir turinio tęstinumą po renginio.\n\n" +
      "Ilgainiui tai gali pakelti visos sporto industrijos brandą, nes išryškėja ne pažadai, o sistemingas darbas.",
    category: "vadyba",
    sport: "sporto vadyba",
    sourceName: "SicenterHub redakcija",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Susitikimas biure prie nešiojamųjų kompiuterių",
    slug: "sporto-vadyboje-daugeja-klausimu-del-realios-vertes-partneriams",
    format: "article",
    publishedAt: `${today}T09:40:00+03:00`,
    readTimeMinutes: 6,
    status: "published",
    whyItMatters: "Kas išmoks parodyti vertę skaičiais, tas pirmas pasiims stipresnius partnerius ir ilgesnius kontraktus.",
    priorityScore: 5,
    draftRecommended: true,
    riskLevel: "low"
  },
  {
    id: "article-5",
    title: "Mažesnės sporto bendruomenės nori ne trupinių, o nuolatinio matomumo",
    summary: "Federacijos ir klubai vis garsiau kalba apie poreikį būti matomi ne tik pergalių dienomis.",
    lead: "Kai portale nuosekliai matomos mažesnės sporto šakos, laimi ne tik jų bendruomenės — laimi visas sporto laukas.",
    bodyMarkdown:
      "Lietuvos sporto ekosistema daug platesnė nei kelios didžiosios lygos. Tačiau informacijos matomumas vis dar pasiskirsto netolygiai.\n\n" +
      "Mažesnėms bendruomenėms nuoseklus dėmesys reiškia daugiau nei reputaciją. Tai padeda pritraukti partnerius, stiprina renginius ir skatina jaunimo įsitraukimą.\n\n" +
      "Todėl modernus portalas turi būti kuriamas taip, kad jo struktūra leistų kilti įvairioms sporto istorijoms, o ne tik vienadieniams rekordams.",
    category: "bendruomenė",
    sport: "kitos sporto šakos",
    sourceName: "SicenterHub redakcija",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Sporto komanda bėga stadiono takeliu",
    slug: "mazesnes-sporto-bendruomenes-nori-nuolatinio-matomumo",
    format: "article",
    publishedAt: `${today}T07:55:00+03:00`,
    readTimeMinutes: 4,
    status: "published",
    whyItMatters: "Nuolatinis matomumas padeda mažesnėms sporto šakoms augti ilgalaikiai, o ne tik epizodiškai.",
    priorityScore: 4,
    draftRecommended: true,
    riskLevel: "low"
  },
  {
    id: "article-6",
    title: "Renginių kalendorius tampa strateginiu ginklu: kas laimi, kai datos nesusikerta",
    summary: "Tvarkingas sezono planavimas leidžia išvengti auditorijos išsiskaidymo ir palengvina partnerių aktyvaciją.",
    lead: "Kalendorius sporte atrodo techninis dalykas, bet iš tiesų jis dažnai nulemia renginio kokybę ir pajamas.",
    bodyMarkdown:
      "Kai viename mieste ar regione susikerta keli sporto renginiai, nukenčia visi: mažėja auditorija, sudėtingėja savanorių paieška ir silpnėja komunikacijos fokusas.\n\n" +
      "Todėl kalendoriaus planavimas turėtų būti ankstyvas ir bendras, o ne atskiras kiekvienos organizacijos sprendimas. Tai ypač aktualu rudenį, kai veiklos tankis smarkiai išauga.\n\n" +
      "Portalas gali tapti ir viešu orientyru, kuris padeda bendruomenei matyti, kaip formuojasi sporto sezono ritmas.",
    category: "renginiai",
    sport: "renginiai",
    sourceName: "SicenterHub redakcija",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Didelis renginys arenoje su šviesomis",
    slug: "renginiu-kalendorius-tampa-strateginiu-ginklu",
    format: "article",
    publishedAt: `${today}T06:45:00+03:00`,
    readTimeMinutes: 5,
    status: "published",
    whyItMatters: "Gera datų architektūra reiškia geresnį lankomumą, aiškesnę komunikaciją ir daugiau vertės partneriams.",
    priorityScore: 4,
    draftRecommended: true,
    riskLevel: "low"
  },
  {
    id: "article-7",
    title: "Jaunimo turnyrai Lietuvoje gali tapti daugiau nei savaitgalio įvykiu",
    summary: "Kai turnyras turi aiškią tapatybę, jis veikia kaip miesto, akademijų ir partnerių susitikimo taškas.",
    lead: "Jaunimo sporto renginys šiandien gali būti ne tik varžybos, bet ir platforma bendruomenei, edukacijai bei partnerystėms.",
    bodyMarkdown:
      "Lietuvoje vis dažniau ieškoma modelių, kaip jaunimo turnyrus paversti ilgesnės vertės projektu. Vien tik tvarkingo organizavimo nebepakanka.\n\n" +
      "Svarbu, kad renginys turėtų aiškų pasakojimą, programą tėvams ir treneriams, o taip pat suprantamą komunikaciją partneriams bei miestui.\n\n" +
      "Tokiu atveju net vienas gerai sustyguotas turnyras gali tapti kasmetiniu sporto kalendoriaus traukos tašku.",
    category: "jaunimas",
    sport: "kitos sporto šakos",
    sourceName: "SicenterHub redakcija",
    imageUrl: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Jauni sportininkai aikštėje",
    slug: "jaunimo-turnyrai-lietuvoje-gali-tapti-daugiau-nei-savaitgalio-ivykiu",
    format: "article",
    publishedAt: `${today}T12:25:00+03:00`,
    readTimeMinutes: 4,
    status: "published",
    whyItMatters: "Geras jaunimo renginys kuria ne vien emociją, bet ir ilgalaikę reputaciją miestui bei organizatoriams.",
    priorityScore: 4,
    draftRecommended: true,
    riskLevel: "low"
  },
  {
    id: "article-8",
    title: "Kodėl sporto portalo dešinė kolona vėl svarbi: ne reklamai, o gyvam radarui",
    summary: "Trumpų signalų zona gali tapti viena naudingiausių vietų portale, jei ji pateikia ne triukšmą, o kryptį.",
    lead: "Šoninė juosta veikia tik tada, kai ji gyva, redakciškai atrinkta ir padeda greitai suprasti dienos pulsą.",
    bodyMarkdown:
      "Daugelis portalų šonines zonas ilgainiui pavertė triukšmu. Tačiau sporto naujienų portale jos gali atgimti kaip vertinga priemonė skaitytojui, jei jose dominuoja ne atsitiktiniai blokai, o aiškiai atrinkti signalai.\n\n" +
      "Sporto radaras turi būti trumpas, ritmingas ir redakciškai naudingas. Jis turi parodyti ne vien kas įvyko, bet ir kodėl verta stabtelėti būtent prie šios temos.\n\n" +
      "Toks modulis ypač svarbus mobiliai auditorijai, kuri nori greito suvokimo, o tik tada sprendžia, ar verta eiti į pilną straipsnį.",
    category: "produktas",
    sport: "sporto vadyba",
    sourceName: "SicenterHub redakcija",
    imageUrl: "https://images.unsplash.com/photo-1494173853739-c21f58b16055?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Telefonas ir naujienų skaitymas",
    slug: "kodel-sporto-portalo-desine-kolona-vel-svarbi",
    format: "article",
    publishedAt: `${today}T13:15:00+03:00`,
    readTimeMinutes: 4,
    status: "published",
    whyItMatters: "Gerai sukonstruotas radaras didina gylį, nes ne konkuruoja su straipsniais, o į juos atveda.",
    priorityScore: 4,
    draftRecommended: true,
    riskLevel: "low"
  }
];

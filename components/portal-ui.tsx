"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FeedItem, MatchStats } from "@/lib/types";

type NavItem = {
  label: string;
  href: string;
};

type CategorySection = {
  title: string;
  sport: string;
  items: FeedItem[];
};

type EventItem = {
  title: string;
  dateLabel: string;
  place: string;
  description: string;
  href: string;
  imageUrl?: string;
};

const defaultSports: NavItem[] = [
  { label: "Visos", href: "/naujienos" },
  { label: "Krepšinis", href: "/#krepsinis" },
  { label: "Futbolas", href: "/#futbolas" },
  { label: "Kitos sporto šakos", href: "/#kitos-sporto-sakos" },
  { label: "Sporto vadyba", href: "/#sporto-vadyba" }
];

function formatTime(value: string, withDate = false) {
  return new Intl.DateTimeFormat("lt-LT", {
    dateStyle: withDate ? "medium" : undefined,
    timeStyle: "short"
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("lt-LT", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(new Date(value));
}

function toTitle(value: string) {
  const normalized = value.toLowerCase().trim();
  const labels: Record<string, string> = {
    basketball: "Krepšinis",
    football: "Futbolas",
    soccer: "Futbolas",
    volleyball: "Tinklinis",
    handball: "Rankinis",
    futsal: "Futsalas",
    canoe_kayak: "Baidarės ir kanojos",
    athletics: "Lengvoji atletika",
    swimming: "Plaukimas",
    tennis: "Tenisas",
    cycling: "Dviračių sportas",
    multi_sport: "Įvairios sporto šakos",
    result: "Rezultatas",
    news: "Naujienos",
    interview: "Interviu",
    analysis: "Analizė",
    event: "Renginys",
    events: "Renginiai",
    broadcast: "Transliacija",
    management: "Sporto vadyba"
  };
  if (labels[normalized]) return labels[normalized];

  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (char) => char.toUpperCase());
}

function getSportClass(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("krep")) return "is-basketball";
  if (normalized.includes("fut")) return "is-football";
  if (normalized.includes("vady")) return "is-business";
  if (normalized.includes("rengin")) return "is-event";
  return "is-other";
}

function getSportBucket(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("krep") || normalized.includes("basket")) return "basketball";
  if (normalized.includes("fut") || normalized.includes("foot") || normalized.includes("soccer")) return "football";
  if (normalized.includes("vady") || normalized.includes("management")) return "management";
  return "other";
}

function getWhyText(item: FeedItem) {
  return item.whyItMatters || item.lead || item.summary;
}

function getHeroTitleClass(title: string) {
  if (title.length > 88) return "is-very-long";
  if (title.length > 58) return "is-long";
  return "";
}

function useLiveRefresh(intervalMs = 75000) {
  const router = useRouter();

  useEffect(() => {
    const refreshVisiblePage = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const interval = window.setInterval(refreshVisiblePage, intervalMs);
    document.addEventListener("visibilitychange", refreshVisiblePage);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshVisiblePage);
    };
  }, [intervalMs, router]);
}

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brandmark" aria-label="Sporto Radaras – pradinis puslapis">
        <img className="brand-logo" src="/brand/sporto-radaras-logo.png" alt="Sporto Radaras" />
      </Link>

      <div className="header-tools">
        <form className="search-shell" action="/paieska" role="search">
          <span aria-hidden="true">⌕</span>
          <input name="q" placeholder="Ieškoti naujienų" aria-label="Ieškoti naujienų" />
        </form>
        <a className="radar-link" href="/radaras">
          <span className="live-dot" />
          Gyvas radaras
        </a>
        <a className="submit-button" href="mailto:news@sicenterhub.com">
          Siųsti naujieną
        </a>
      </div>
    </header>
  );
}

export function SportCategoryNav() {
  return (
    <nav className="sport-nav" aria-label="Sporto kategorijos">
      {defaultSports.map((item) => (
        <a key={item.label} href={item.href} className="sport-nav-link">
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function HeroNews({ item }: { item: FeedItem }) {
  return (
    <section className="hero-news">
      <div className="hero-copy">
        <div className="hero-meta">
          <span className={`tag ${getSportClass(item.sport)}`}>{toTitle(item.sport)}</span>
          <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
        </div>

        <span className="section-kicker">Dienos tema</span>
        <h1>{item.title}</h1>
        <p className="hero-lead">{item.lead || item.summary}</p>

        <div className="hero-actions">
          <Link href={`/${item.slug}`} className="primary-link">
            Skaityti straipsnį
          </Link>
          <div className="hero-editor-note">
            <strong>Kodėl verta spausti?</strong>
            <span>{getWhyText(item)}</span>
          </div>
        </div>
      </div>

      <div className="hero-side">
        <Link href={`/${item.slug}`} className="hero-visual">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.imageAlt || item.title} />
          ) : (
            <div className="image-fallback">
              <span>Redakcijos atranka</span>
            </div>
          )}
        </Link>

        <div className="hero-side-card">
          <span className="section-kicker">Redakcijos kampas</span>
          <h3>Ne tik rezultatai, bet ir kontekstas</h3>
          <p>
            Čia keliamos temos, kurios svarbios klubams, federacijoms, projektams,
            partnerystėms ir visai sporto ekosistemai.
          </p>
        </div>
      </div>
    </section>
  );
}

export function HeroShowcase({
  featured,
  radar
}: {
  featured: FeedItem[];
  radar: FeedItem[];
}) {
  const items = featured;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, [items]);

  if (!items.length) return null;

  const activeItem = items[activeIndex];

  return (
    <section className="showcase-grid">
      <div className="showcase-main">
        <Link href={`/${activeItem.slug}`} className="showcase-visual">
          {activeItem.imageUrl ? (
            <img
              src={activeItem.imageUrl}
              alt={activeItem.imageAlt || activeItem.title}
              fetchPriority="high"
              decoding="async"
              style={{ objectPosition: `${activeItem.imageFocusX ?? 50}% ${activeItem.imageFocusY ?? 30}%` }}
            />
          ) : (
            <div className="image-fallback">
              <span>Redakcijos atranka</span>
            </div>
          )}
          <div className="showcase-overlay" />
        </Link>

        <div className="showcase-copy">
          <div className="hero-meta">
            <span className={`tag ${getSportClass(activeItem.sport)}`}>{toTitle(activeItem.sport)}</span>
            <time dateTime={activeItem.publishedAt}>{formatDate(activeItem.publishedAt)}</time>
          </div>

          <span className="section-kicker light">Pagrindinė naujiena</span>
          <h1 className={getHeroTitleClass(activeItem.title)}>{activeItem.title}</h1>
          <p className="hero-lead">{activeItem.lead || activeItem.summary}</p>

          <div className="showcase-actions">
            <Link href={`/${activeItem.slug}`} className="primary-link">
              Skaityti daugiau
            </Link>
          </div>
        </div>

        <div className="showcase-tabs">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`showcase-tab ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-selected={index === activeIndex}
              aria-label={`Rodyti naujieną: ${item.title}`}
            >
              <span>{toTitle(item.category || item.sport)}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>
      </div>

      <SportRadarSidebar
        items={radar}
        title="Sporto radaras"
        description="Aktualiausi trumpi signalai iš sporto pasaulio"
        compact
        maxItems={12}
        scrollable
      />
    </section>
  );
}

export function NewsCard({
  item,
  compact = false
}: {
  item: FeedItem;
  compact?: boolean;
}) {
  return (
    <article className={`news-card ${compact ? "compact" : ""}`}>
      <Link href={`/${item.slug}`} className="news-card-link">
        <div className="news-card-copy">
          <div className="card-meta">
            <span className={`tag ${getSportClass(item.sport)}`}>{toTitle(item.sport)}</span>
            <span className="card-time">{formatTime(item.publishedAt, true)}</span>
          </div>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
          <div className="card-footer">
            <span>{item.sourceName}</span>
            {item.readTimeMinutes ? <span>{item.readTimeMinutes} min skaitymo</span> : null}
          </div>
        </div>

        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.imageAlt || item.title}
            className="news-card-image"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </Link>
    </article>
  );
}

export function TopStoriesGrid({ items }: { items: FeedItem[] }) {
  return (
    <section className="content-block">
      <div className="block-head">
        <div>
          <span className="section-kicker">Svarbiausia šiandien</span>
          <h2>Dienos temos</h2>
        </div>
      </div>

      <div className="top-stories-grid">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} compact />
        ))}
      </div>
    </section>
  );
}

export function ShortSignalCard({ item }: { item: FeedItem }) {
  return (
    <article className="signal-card">
      <div className="signal-topline">
        <time dateTime={item.publishedAt}>{formatTime(item.publishedAt)}</time>
        <span className={`tag ${getSportClass(item.sport)}`}>{toTitle(item.sport)}</span>
      </div>
      <h4>{item.title}</h4>
      {item.summary ? <p className="signal-summary">{item.summary}</p> : null}
      {item.practicalAction ? (
        <div className="signal-action">
          <strong>Ką stebėti?</strong>
          <span>{item.practicalAction}</span>
        </div>
      ) : null}
    </article>
  );
}

export function SportRadarSidebar({
  items,
  title = "Sporto radaras",
  description = "Trumpi signalai, kurie leidžia suprasti dienos pulsą",
  compact = false,
  maxItems,
  scrollable = false
}: {
  items: FeedItem[];
  title?: string;
  description?: string;
  compact?: boolean;
  maxItems?: number;
  scrollable?: boolean;
}) {
  const itemLimit = maxItems || (compact ? 3 : 10);

  return (
    <aside id="radaras" className={`radar-panel ${compact ? "compact" : ""} ${scrollable ? "scrollable" : ""}`}>
      <div className="block-head radar-head">
        <div>
          <span className="section-kicker live-kicker"><span className="live-dot" /> Gyvas srautas</span>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>

      <div className="signals-list">
        {items.slice(0, itemLimit).map((item) => (
          <ShortSignalCard key={item.id} item={item} />
        ))}
      </div>

      <Link href="/radaras" className="ghost-link">
        Visi signalai
      </Link>
    </aside>
  );
}

export function LatestNewsFeed({ items }: { items: FeedItem[] }) {
  const filters = useMemo(() => {
    const values = ["Visos", ...new Set(items.map((item) => toTitle(item.sport)))];
    return values;
  }, [items]);
  const [activeFilter, setActiveFilter] = useState("Visos");

  const visibleItems = useMemo(() => {
    if (activeFilter === "Visos") return items;
    return items.filter((item) => toTitle(item.sport) === activeFilter);
  }, [activeFilter, items]);

  if (!items.length) return null;

  return (
    <section className="content-block" id="naujienos">
      <div className="block-head latest-head">
        <div>
          <span className="section-kicker">Naujausia</span>
          <h2>Naujausios naujienos</h2>
        </div>
        <div className="filter-row">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="latest-list">
        {visibleItems.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export function WhyItMattersBox({ text }: { text: string }) {
  return (
    <section className="why-box">
      <span className="section-kicker">Kodėl tai svarbu?</span>
      <p>{text}</p>
    </section>
  );
}

export function MatchStatsBox({ stats }: { stats?: MatchStats }) {
  if (!stats) return null;
  const rows = [...(stats.team_stats || []), ...(stats.periods || [])];
  return (
    <section className="match-stats-box" aria-label="Rungtynių statistika">
      <div className="match-stats-head">
        <span className="section-kicker">Statistika</span>
        {stats.competition ? <small>{stats.competition}</small> : null}
      </div>
      {stats.event ? <h2>{stats.event}</h2> : null}
      {stats.home_team || stats.away_team || stats.final_score ? (
        <div className="match-scoreline">
          <strong>{stats.home_team || "Šeimininkai"}</strong>
          <b>{stats.final_score || "–"}</b>
          <strong>{stats.away_team || "Svečiai"}</strong>
        </div>
      ) : null}
      {rows.length ? (
        <div className="match-stats-table">
          {rows.map((row, index) => (
            <div className="match-stats-row" key={`${row.label || "rodiklis"}-${index}`}>
              <span>{row.label || "Rodiklis"}</span>
              <b>{row.home ?? "–"}</b>
              <b>{row.away ?? "–"}</b>
            </div>
          ))}
        </div>
      ) : null}
      {stats.leaders?.length ? (
        <ul className="match-leaders">
          {stats.leaders.map((leader, index) => <li key={`${leader.player || "lyderis"}-${index}`}><strong>{leader.label || "Lyderis"}:</strong> {leader.player || "–"} {leader.value ? `(${leader.value})` : ""}</li>)}
        </ul>
      ) : null}
      {stats.note ? <p className="match-stats-note">{stats.note}</p> : null}
    </section>
  );
}

export function RelatedNews({ items }: { items: FeedItem[] }) {
  return (
    <section className="content-block compact-block">
      <div className="block-head">
        <div>
          <span className="section-kicker">Naujausia</span>
          <h2>Kitos naujienos</h2>
        </div>
      </div>

      <div className="related-list">
        {items.slice(0, 5).map((item) => (
          <NewsCard key={item.id} item={item} compact />
        ))}
      </div>
    </section>
  );
}

export function EventCalendarPreview({ items }: { items: EventItem[] }) {
  if (!items.length) return null;

  return (
      <section className="content-block" id="renginiai">
      <div className="block-head">
        <div>
          <span className="section-kicker">Renginių kalendorius</span>
          <h2>Artimiausi akcentai</h2>
        </div>
      </div>

      <div className="event-list">
        {items.map((item) => (
          <article key={item.title} className="event-card">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="event-card-image" loading="lazy" decoding="async" /> : null}
            <strong>{item.dateLabel}</strong>
            <h3>{item.title}</h3>
            <p>Šaltinis: {item.place}</p>
            <details className="event-details">
              <summary>Daugiau informacijos</summary>
              <p>{item.description}</p>
              <a href={item.href} target="_blank" rel="noreferrer">Atidaryti renginio šaltinį</a>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}

export function NewsletterSignup() {
  return (
    <section className="newsletter-box">
      <div>
        <span className="section-kicker">Naujienlaiškis</span>
        <h2>Gauk sporto signalus vienoje aiškioje ryto santraukoje</h2>
        <p>
          Trumpi radarai, svarbiausios temos, vadybinės įžvalgos ir straipsniai, kurių
          nenori praleisti sporto bendruomenė.
        </p>
      </div>

      <form className="newsletter-form">
        <input type="email" placeholder="Jūsų el. paštas" />
        <button type="submit">Prenumeruoti</button>
      </form>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Sporto Radaras</strong>
        <p>VšĮ Sporto inovacijų centro kuriamas Lietuvos sporto naujienų portalas.</p>
      </div>
      <div className="footer-links">
        <a href="/naujienos">Naujienos</a>
        <a href="/radaras">Sporto radaras</a>
        <Link href="/apie">Apie mus</Link>
        <Link href="/redakcijos-principai">Redakcijos principai</Link>
        <Link href="/privatumo-politika">Privatumas</Link>
        <Link href="/kontaktai">Kontaktai</Link>
      </div>
    </footer>
  );
}

export function HomePortal({
  hero,
  latest,
  radar,
  sections,
  events
}: {
  hero: FeedItem;
  latest: FeedItem[];
  radar: FeedItem[];
  sections: CategorySection[];
  events: EventItem[];
}) {
  useLiveRefresh();

  const featuredPool = [hero, ...latest]
    .filter((item, index, items) => Boolean(item.imageUrl) && items.findIndex((candidate) => candidate.id === item.id) === index)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const featuredItems: FeedItem[] = [hero];
  const featuredBuckets = new Set([getSportBucket(hero.sport)]);

  for (const item of featuredPool) {
    if (featuredItems.length >= 5) break;
    const bucket = getSportBucket(item.sport);
    if (item.id !== hero.id && !featuredBuckets.has(bucket)) {
      featuredItems.push(item);
      featuredBuckets.add(bucket);
    }
  }

  for (const item of featuredPool) {
    if (featuredItems.length >= 5) break;
    if (!featuredItems.some((candidate) => candidate.id === item.id)) featuredItems.push(item);
  }
  const featuredIds = new Set(featuredItems.map((item) => item.id));
  const olderItems = latest.filter((item) => item.imageUrl && !featuredIds.has(item.id));
  const olderSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.imageUrl && !featuredIds.has(item.id))
    }))
    .filter((section) => section.items.length > 0);

  return (
    <main className="page-shell">
      <Header />
      <SportCategoryNav />

      <HeroShowcase featured={featuredItems} radar={radar} />

      <div className="main-column home-main-column">
          <LatestNewsFeed items={olderItems} />

          {olderSections.map((section) => (
            <section key={section.title} className="content-block" id={section.sport}>
              <div className="block-head">
                <div>
                  <span className="section-kicker">{section.title}</span>
                  <h2>{section.title}</h2>
                </div>
              </div>
              <div className="section-grid">
                {section.items.map((item) => (
                  <NewsCard key={item.id} item={item} compact />
                ))}
              </div>
            </section>
          ))}

      </div>

      <Footer />
    </main>
  );
}

export function ArticlePage({
  item,
  related,
  radar
}: {
  item: FeedItem;
  related: FeedItem[];
  radar: FeedItem[];
}) {
  useLiveRefresh();

  return (
    <main className="page-shell article-shell">
      <Header />
      <SportCategoryNav />

      <div className="article-layout">
        <article className="article-main">
          <div className="article-intro">
            <div className="card-meta">
              <span className={`tag ${getSportClass(item.sport)}`}>{toTitle(item.sport)}</span>
              <span className="card-time">{formatDate(item.publishedAt)}</span>
            </div>
            <h1>{item.title}</h1>
            <p className="article-lead">{item.lead || item.summary}</p>
          </div>

          {item.imageUrl ? (
            <figure className="article-image-figure">
              <img
                className="article-hero-image"
                src={item.imageUrl}
                alt={item.imageAlt || item.title}
                fetchPriority="high"
                decoding="async"
                style={{ objectPosition: `${item.imageFocusX ?? 50}% ${item.imageFocusY ?? 30}%` }}
              />
              <figcaption>
                Nuotrauka: {item.imageAuthor || item.sourceName}
                {item.imagePageUrl ? <> · <a href={item.imagePageUrl} target="_blank" rel="noreferrer">šaltinis</a></> : null}
                {item.imageLicense ? <> · {item.imageLicense}</> : null}
              </figcaption>
            </figure>
          ) : null}

          <WhyItMattersBox text={getWhyText(item)} />
          <MatchStatsBox stats={item.matchStats} />

          <div className="article-body">
            {(item.bodyMarkdown || item.summary).split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="article-sidebar">
          <RelatedNews items={related} />
          <SportRadarSidebar
            items={radar}
            title="Sporto radaras"
            description="Temos, kurios šiandien juda greičiausiai ir gali išaugti į didesnes istorijas"
            maxItems={5}
            scrollable
          />
        </aside>
      </div>

      <Footer />
    </main>
  );
}

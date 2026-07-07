"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FeedItem } from "@/lib/types";

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
};

const defaultSports: NavItem[] = [
  { label: "Visos", href: "#naujienos" },
  { label: "Krepšinis", href: "#krepsinis" },
  { label: "Futbolas", href: "#futbolas" },
  { label: "Kitos sporto šakos", href: "#kitos-sporto-sakos" },
  { label: "Sporto vadyba", href: "#sporto-vadyba" },
  { label: "Renginiai", href: "#renginiai" }
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

function getStatusTone(item: FeedItem) {
  if (item.riskLevel === "high" || item.label?.toLowerCase().includes("riz")) {
    return "danger";
  }
  if (item.category.toLowerCase().includes("rezultat")) {
    return "success";
  }
  return "neutral";
}

function getVisibleItems(items: FeedItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (item.riskLevel === "high" && item.status !== "published") return false;
    if (item.possibleDuplicate) {
      const key = item.topicKey || item.slug;
      if (seen.has(key)) return false;
      seen.add(key);
    }
    return true;
  });
}

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brandmark">
        <span className="brandmark-badge">S</span>
        <span>
          <strong>Sporto redakcija</strong>
          <small>Lietuvos sporto naujienos aiškiau</small>
        </span>
      </Link>

      <div className="header-tools">
        <label className="search-shell" aria-label="Paieška">
          <span>⌕</span>
          <input placeholder="Ieškoti naujienų, klubų, federacijų..." />
        </label>
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
          <span className={`status-dot ${getStatusTone(item)}`}>{item.priorityScore || 4}/5</span>
          <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
        </div>

        <span className="section-kicker">Dienos naujiena</span>
        <h1>{item.title}</h1>
        <p className="hero-lead">{item.lead || item.summary}</p>

        <div className="hero-actions">
          <Link href={`/${item.slug}`} className="primary-link">
            Skaityti straipsnį
          </Link>
          <span className="hero-source">Šaltinis: {item.sourceName}</span>
        </div>
      </div>

      <Link href={`/${item.slug}`} className="hero-visual">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.imageAlt || item.title} />
        ) : (
          <div className="image-fallback">
            <span>Sporto redakcijos atranka</span>
          </div>
        )}
      </Link>
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
            {item.readTimeMinutes ? <span>{item.readTimeMinutes} min</span> : null}
          </div>
        </div>

        {!compact ? (
          item.imageUrl ? (
            <img src={item.imageUrl} alt={item.imageAlt || item.title} className="news-card-image" />
          ) : (
            <div className="news-card-image placeholder" />
          )
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
          <h2>4 temos, kurias verta pamatyti pirmiausia</h2>
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
      <Link href={`/${item.slug}`}>
        <h4>{item.title}</h4>
      </Link>
      <p>{item.whyItMatters || item.summary}</p>
    </article>
  );
}

export function SportRadarSidebar({
  items,
  title = "Sporto radaras",
  description = "Trumpi signalai, kuriuos verta sekti dabar"
}: {
  items: FeedItem[];
  title?: string;
  description?: string;
}) {
  return (
    <aside className="radar-panel">
      <div className="block-head">
        <div>
          <span className="section-kicker">Gyvas srautas</span>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>

      <div className="signals-list">
        {items.slice(0, 10).map((item) => (
          <ShortSignalCard key={item.id} item={item} />
        ))}
      </div>

      <Link href="#radaras" className="ghost-link">
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

  return (
    <section className="content-block" id="naujienos">
      <div className="block-head latest-head">
        <div>
          <span className="section-kicker">Naujausia</span>
          <h2>Chronologinis naujienų srautas</h2>
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

export function RelatedNews({ items }: { items: FeedItem[] }) {
  return (
    <section className="content-block compact-block">
      <div className="block-head">
        <div>
          <span className="section-kicker">Susijusios naujienos</span>
          <h2>Tęsk skaitymą</h2>
        </div>
      </div>

      <div className="related-list">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} compact />
        ))}
      </div>
    </section>
  );
}

export function EventCalendarPreview({ items }: { items: EventItem[] }) {
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
            <strong>{item.dateLabel}</strong>
            <h3>{item.title}</h3>
            <p>{item.place}</p>
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
        <h2>Gauk svarbiausius sporto signalus vienoje santraukoje</h2>
        <p>
          Tinka ir skaitytojams, ir sporto organizacijoms: ryto naujienų radaras,
          svarbiausios temos bei vadybinės įžvalgos.
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
        <strong>Sporto redakcija</strong>
        <p>Švaresnis, greitesnis ir aiškesnis Lietuvos sporto naujienų portalas.</p>
      </div>
      <div className="footer-links">
        <a href="#naujienos">Naujienos</a>
        <a href="#radaras">Sporto radaras</a>
        <a href="mailto:news@sicenterhub.com">Kontaktai</a>
      </div>
    </footer>
  );
}

export function HomePortal({
  hero,
  topStories,
  latest,
  radar,
  sections,
  events
}: {
  hero: FeedItem;
  topStories: FeedItem[];
  latest: FeedItem[];
  radar: FeedItem[];
  sections: CategorySection[];
  events: EventItem[];
}) {
  return (
    <main className="page-shell">
      <Header />
      <SportCategoryNav />

      <div className="main-grid">
        <div className="main-column">
          <HeroNews item={hero} />
          <TopStoriesGrid items={topStories} />
          <div className="radar-mobile" id="radaras">
            <SportRadarSidebar items={radar} />
          </div>
          <LatestNewsFeed items={latest} />

          {sections.map((section) => (
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

          <EventCalendarPreview items={events} />
          <NewsletterSignup />
        </div>

        <div className="sidebar-column">
          <SportRadarSidebar items={radar} />
        </div>
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
            <img className="article-hero-image" src={item.imageUrl} alt={item.imageAlt || item.title} />
          ) : null}

          <WhyItMattersBox text={item.whyItMatters || item.summary} />

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
            description="Trumpi signalai, kurie gali virsti kitomis didelėmis temomis"
          />
        </aside>
      </div>

      <Footer />
    </main>
  );
}

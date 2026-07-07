"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

function getWhyText(item: FeedItem) {
  return item.whyItMatters || item.lead || item.summary;
}

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brandmark" aria-label="Sporto redakcija – pradinis puslapis">
        <span className="brandmark-badge">SR</span>
        <span className="brandmark-copy">
          <strong>Sporto redakcija</strong>
          <small>Lietuvos sporto pulsas</small>
        </span>
      </Link>

      <div className="header-tools">
        <label className="search-shell" aria-label="Paieška">
          <span aria-hidden="true">⌕</span>
          <input placeholder="Ieškoti naujienų" />
        </label>
        <a className="radar-link" href="#radaras">
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
          <span className={`status-dot ${getStatusTone(item)}`}>
            Prioritetas {item.priorityScore || 4}/5
          </span>
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
  headlines
}: {
  featured: FeedItem[];
  headlines: FeedItem[];
}) {
  const items = featured.length ? featured : headlines;
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
            <img src={activeItem.imageUrl} alt={activeItem.imageAlt || activeItem.title} />
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
            <span className={`status-dot ${getStatusTone(activeItem)}`}>
              Prioritetas {activeItem.priorityScore || 4}/5
            </span>
            <time dateTime={activeItem.publishedAt}>{formatDate(activeItem.publishedAt)}</time>
          </div>

          <span className="section-kicker light">Pagrindinė naujiena</span>
          <h1>{activeItem.title}</h1>
          <p className="hero-lead">{activeItem.lead || activeItem.summary}</p>

          <div className="showcase-actions">
            <Link href={`/${activeItem.slug}`} className="primary-link">
              Skaityti daugiau
            </Link>
            <div className="hero-editor-note dark">
              <strong>Kodėl verta atkreipti dėmesį?</strong>
              <span>{getWhyText(activeItem)}</span>
            </div>
          </div>
        </div>

        <div className="showcase-tabs">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`showcase-tab ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <span>{toTitle(item.category || item.sport)}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>
      </div>

      <aside className="headlines-panel">
        <div className="headlines-top">
          <div>
            <span className="section-kicker">Dabar</span>
            <h3>Naujausia</h3>
          </div>
          <a href="#naujienos">Visos naujienos</a>
        </div>

        <div className="headlines-list">
          {headlines.slice(0, 7).map((item) => (
            <Link key={item.id} href={`/${item.slug}`} className="headline-item">
              <div className="headline-copy">
                <span className={`tag small ${getSportClass(item.sport)}`}>{toTitle(item.sport)}</span>
                <strong>{item.title}</strong>
                <small>{formatTime(item.publishedAt)}</small>
              </div>
            </Link>
          ))}
        </div>
      </aside>
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
  const whyText = getWhyText(item);
  const showWhy = Boolean(whyText && whyText.trim() !== item.summary.trim());

  return (
    <article className="signal-card">
      <div className="signal-topline">
        <time dateTime={item.publishedAt}>{formatTime(item.publishedAt)}</time>
        <span className={`tag ${getSportClass(item.sport)}`}>{toTitle(item.sport)}</span>
      </div>
      <Link href={`/${item.slug}`}>
        <h4>{item.title}</h4>
      </Link>
      <p className="signal-summary">{item.summary}</p>
      {showWhy ? (
        <div className="signal-insight">
          <strong>Kodėl svarbu?</strong>
          <span>{whyText}</span>
        </div>
      ) : null}
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
  description = "Trumpi signalai, kurie leidžia suprasti dienos pulsą"
}: {
  items: FeedItem[];
  title?: string;
  description?: string;
}) {
  return (
    <aside className="radar-panel">
      <div className="block-head radar-head">
        <div>
          <span className="section-kicker live-kicker"><span className="live-dot" /> Gyvas srautas</span>
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
        <strong>Sporto redakcija</strong>
        <p>Modernus Lietuvos sporto naujienų portalas su gyvu radaru ir redakciniu filtru.</p>
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

      <HeroShowcase featured={[hero, ...latest].slice(0, 5)} headlines={latest} />

      <TopStoriesGrid items={topStories} />

      <div className="main-grid home-feed-grid" id="radaras">
        <div className="main-column">
          <div className="radar-mobile">
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

          <WhyItMattersBox text={getWhyText(item)} />

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
          />
        </aside>
      </div>

      <Footer />
    </main>
  );
}

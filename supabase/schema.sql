create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body_markdown text,
  match_stats jsonb,
  seo_title text,
  meta_description text,
  category text not null default 'news',
  sport text not null default 'multi_sport',
  format text not null check (format in ('short', 'article')),
  status text not null default 'published',
  label text,
  lead text,
  priority_score integer,
  risk_level text default 'low',
  short_news_possible boolean default false,
  draft_recommended boolean default false,
  possible_duplicate boolean default false,
  why_it_matters text,
  practical_action text,
  source_name text not null default 'SicenterHub',
  source_url text,
  image_url text,
  image_alt text,
  image_page_url text,
  image_author text,
  image_license text,
  image_license_url text,
  source_note text,
  research_urls text[] not null default '{}',
  social_facebook text,
  social_instagram text,
  social_x text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles add column if not exists lead text;
alter table public.articles add column if not exists match_stats jsonb;
alter table public.articles add column if not exists priority_score integer;
alter table public.articles add column if not exists risk_level text default 'low';
alter table public.articles add column if not exists short_news_possible boolean default false;
alter table public.articles add column if not exists draft_recommended boolean default false;
alter table public.articles add column if not exists possible_duplicate boolean default false;
alter table public.articles add column if not exists why_it_matters text;
alter table public.articles add column if not exists practical_action text;
alter table public.articles add column if not exists image_page_url text;
alter table public.articles add column if not exists image_author text;
alter table public.articles add column if not exists image_license text;
alter table public.articles add column if not exists image_license_url text;

create index if not exists articles_status_format_published_at_idx
  on public.articles (status, format, published_at desc);

create table if not exists public.social_queue (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  network text not null check (network in ('facebook', 'instagram', 'x')),
  post_text text not null,
  post_image_url text,
  status text not null default 'queued',
  scheduled_at timestamptz,
  posted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists social_queue_status_scheduled_at_idx
  on public.social_queue (status, scheduled_at asc);

create unique index if not exists social_queue_article_network_unique_idx
  on public.social_queue (article_id, network);

alter table public.articles enable row level security;
alter table public.social_queue enable row level security;

create policy "public read published articles"
  on public.articles
  for select
  using (status = 'published');

create policy "public read queued socials"
  on public.social_queue
  for select
  using (status = 'queued');

alter table public.articles add column if not exists lead text;
alter table public.articles add column if not exists priority_score integer;
alter table public.articles add column if not exists risk_level text default 'low';
alter table public.articles add column if not exists short_news_possible boolean default false;
alter table public.articles add column if not exists draft_recommended boolean default false;
alter table public.articles add column if not exists possible_duplicate boolean default false;
alter table public.articles add column if not exists why_it_matters text;
alter table public.articles add column if not exists practical_action text;

-- Sporto redakcijos administravimo zona
-- Paleisti vieną kartą Supabase SQL Editor lange.

create table if not exists public.admin_users (
  email text primary key,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.admin_users (email, active)
values ('r.remigijus.kuodis@gmail.com', true)
on conflict (email) do update set active = excluded.active;

alter table public.admin_users enable row level security;

create or replace function public.is_portal_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and active = true
  );
$$;

revoke all on function public.is_portal_admin() from public;
grant execute on function public.is_portal_admin() to authenticated;

drop policy if exists "admin can read own access" on public.admin_users;
create policy "admin can read own access"
  on public.admin_users for select to authenticated
  using (public.is_portal_admin());

alter table public.articles add column if not exists content_origin text not null default 'ai';
alter table public.articles add column if not exists editor_locked boolean not null default false;
alter table public.articles add column if not exists editor_notes text;
alter table public.articles add column if not exists is_featured boolean not null default false;
alter table public.articles add column if not exists scheduled_at timestamptz;
alter table public.articles add column if not exists image_focus_x integer not null default 50;
alter table public.articles add column if not exists image_focus_y integer not null default 30;

drop policy if exists "admins read all articles" on public.articles;
drop policy if exists "admins create articles" on public.articles;
drop policy if exists "admins update articles" on public.articles;
drop policy if exists "admins delete articles" on public.articles;

create policy "admins read all articles"
  on public.articles for select to authenticated
  using (public.is_portal_admin());
create policy "admins create articles"
  on public.articles for insert to authenticated
  with check (public.is_portal_admin());
create policy "admins update articles"
  on public.articles for update to authenticated
  using (public.is_portal_admin())
  with check (public.is_portal_admin());
create policy "admins delete articles"
  on public.articles for delete to authenticated
  using (public.is_portal_admin());

create table if not exists public.portal_settings (
  id text primary key default 'portal',
  automation_enabled boolean not null default true,
  article_interval_hours integer not null default 6 check (article_interval_hours between 1 and 24),
  articles_per_day integer not null default 2 check (articles_per_day between 0 and 50),
  articles_per_run integer not null default 1 check (articles_per_run between 1 and 10),
  article_model text not null default 'gpt-5.4-mini' check (article_model in ('gpt-5.4-mini', 'gpt-5.4')),
  radar_enabled boolean not null default true,
  radar_interval_minutes integer not null default 120 check (radar_interval_minutes between 15 and 360),
  radar_model text not null default 'gpt-5.4-mini',
  auto_approve_enabled boolean not null default true,
  minimum_priority integer not null default 3 check (minimum_priority between 1 and 5),
  updated_at timestamptz not null default now()
);

insert into public.portal_settings (id) values ('portal') on conflict (id) do nothing;
alter table public.portal_settings enable row level security;

drop policy if exists "admins manage portal settings" on public.portal_settings;
create policy "admins manage portal settings"
  on public.portal_settings for all to authenticated
  using (public.is_portal_admin())
  with check (public.is_portal_admin());

create table if not exists public.article_audit_log (
  id bigint generated always as identity primary key,
  article_id uuid,
  action text not null,
  changed_by uuid,
  old_record jsonb,
  new_record jsonb,
  created_at timestamptz not null default now()
);

alter table public.article_audit_log enable row level security;
drop policy if exists "admins read article history" on public.article_audit_log;
create policy "admins read article history"
  on public.article_audit_log for select to authenticated
  using (public.is_portal_admin());

create or replace function public.log_article_admin_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null then
    insert into public.article_audit_log (article_id, action, changed_by, old_record, new_record)
    values (
      coalesce(new.id, old.id),
      tg_op,
      auth.uid(),
      case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
      case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
    );
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists article_admin_audit_trigger on public.articles;
create trigger article_admin_audit_trigger
after insert or update or delete on public.articles
for each row execute function public.log_article_admin_change();


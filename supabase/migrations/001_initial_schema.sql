-- Takobon — Initial Schema
-- Run this in the Supabase SQL Editor (supabase.com → SQL Editor → New query)

-- ─────────────────────────────────────────────
-- CATALOG TABLES (publicly readable, admin-write)
-- ─────────────────────────────────────────────

create table if not exists publishers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  country     text not null default 'IT',
  logo_url    text,
  slug        text unique not null,
  created_at  timestamptz not null default now()
);

create table if not exists series (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  title_it            text,
  type                text not null check (type in ('comic', 'manga', 'graphic_novel', 'bd')),
  publisher_id        uuid references publishers(id) on delete set null,
  cover_url           text,
  description_it      text,
  status              text not null default 'ongoing' check (status in ('ongoing', 'completed', 'cancelled')),
  genre               text[] default '{}',
  start_year          int,
  slug                text unique not null,
  created_by_user_id  uuid,
  is_verified         boolean not null default false,
  created_at          timestamptz not null default now()
);

create table if not exists issues (
  id               uuid primary key default gen_random_uuid(),
  series_id        uuid not null references series(id) on delete cascade,
  number           int not null,
  title            text,
  cover_url        text,
  release_date_it  date,
  cover_price_eur  numeric(6,2),
  isbn             text,
  description      text,
  created_at       timestamptz not null default now(),
  unique (series_id, number)
);

create table if not exists volumes (
  id               uuid primary key default gen_random_uuid(),
  series_id        uuid not null references series(id) on delete cascade,
  number           int not null,
  title            text,
  cover_url        text,
  release_date_it  date,
  cover_price_eur  numeric(6,2),
  isbn             text,
  description      text,
  created_at       timestamptz not null default now(),
  unique (series_id, number)
);

create table if not exists upcoming_releases (
  id               uuid primary key default gen_random_uuid(),
  item_type        text not null check (item_type in ('issue', 'volume')),
  item_id          uuid not null,
  expected_date_it date,
  is_confirmed     boolean not null default false,
  source_url       text,
  created_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- USER TABLES (RLS enforced)
-- ─────────────────────────────────────────────

create table if not exists users (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  avatar_url  text,
  country     text not null default 'IT',
  created_at  timestamptz not null default now()
);

create table if not exists user_collection_items (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references users(id) on delete cascade,
  item_type           text not null check (item_type in ('issue', 'volume')),
  item_id             uuid not null,
  status              text not null check (status in ('owned', 'wished', 'missing')),
  purchase_price_eur  numeric(6,2),
  purchase_date       date,
  notes               text,
  added_at            timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

create table if not exists user_series_follows (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  series_id   uuid not null references series(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, series_id)
);

create table if not exists collection_snapshots (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references users(id) on delete cascade,
  snapshot_date        date not null,
  total_items          int not null default 0,
  total_est_value_eur  numeric(10,2) not null default 0,
  created_at           timestamptz not null default now(),
  unique (user_id, snapshot_date)
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────

create index if not exists idx_series_slug on series(slug);
create index if not exists idx_series_type on series(type);
create index if not exists idx_series_publisher on series(publisher_id);
create index if not exists idx_issues_series on issues(series_id);
create index if not exists idx_volumes_series on volumes(series_id);
create index if not exists idx_collection_user on user_collection_items(user_id);
create index if not exists idx_collection_status on user_collection_items(status);
create index if not exists idx_follows_user on user_series_follows(user_id);
create index if not exists idx_snapshots_user on collection_snapshots(user_id, snapshot_date);

-- Full-text search on series titles
create index if not exists idx_series_fts on series
  using gin(to_tsvector('italian', coalesce(title_it, '') || ' ' || title));

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

alter table publishers enable row level security;
alter table series enable row level security;
alter table issues enable row level security;
alter table volumes enable row level security;
alter table upcoming_releases enable row level security;
alter table users enable row level security;
alter table user_collection_items enable row level security;
alter table user_series_follows enable row level security;
alter table collection_snapshots enable row level security;

-- Catalog: anyone can read
create policy "Catalog is publicly readable" on publishers for select using (true);
create policy "Catalog is publicly readable" on series for select using (true);
create policy "Catalog is publicly readable" on issues for select using (true);
create policy "Catalog is publicly readable" on volumes for select using (true);
create policy "Upcoming releases are publicly readable" on upcoming_releases for select using (true);

-- Users: can only read/update own profile
create policy "Users can read own profile" on users for select using (auth.uid() = id);
create policy "Users can update own profile" on users for update using (auth.uid() = id);
create policy "Users can insert own profile" on users for insert with check (auth.uid() = id);

-- Collection: full CRUD on own data only
create policy "Users manage own collection" on user_collection_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own follows" on user_series_follows
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own snapshots" on collection_snapshots
  for select using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ─────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

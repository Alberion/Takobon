# Takobon — Architecture

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js 14+ (App Router) + TypeScript | Web-first, SSR, shares logic with future React Native |
| Styling | Tailwind CSS + shadcn/ui | Fast, mobile-first, accessible components |
| Animations | Framer Motion | Subtle premium feel |
| Data fetching | TanStack Query | Caching, stale-while-revalidate |
| Backend | Supabase | PostgreSQL + Auth + Storage + RLS in one managed service |
| Hosting | Vercel | Zero-config Next.js deployment |
| Auth | Supabase Auth | Email/password + Google OAuth, built-in |
| Search | PostgreSQL full-text search (Supabase) | Sufficient for MVP catalog size |
| Images | Supabase Storage | Cover art + user avatars |
| Admin | Supabase Studio + protected `/admin` route | No custom admin UI needed at MVP |
| Future mobile | Expo (React Native) | Reuses same Supabase backend |

---

## Project Structure

```
/
├── app/                        # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── collection/
│   │   │   ├── wishlist/
│   │   │   └── missing/
│   │   ├── search/
│   │   ├── upcoming/
│   │   ├── series/[slug]/
│   │   │   └── [type]/[id]/
│   │   └── profile/
│   ├── onboarding/
│   ├── admin/
│   └── api/                    # API routes
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── takobon/                # app-specific components
├── lib/
│   ├── supabase/               # typed Supabase clients (server + browser)
│   └── queries/                # reusable DB query functions
└── styles/
    └── globals.css             # CSS variables / design tokens
```

---

## Database Schema

```sql
-- Core catalog (admin-managed + user-contributed)

publishers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  country     text DEFAULT 'IT',
  logo_url    text,
  slug        text UNIQUE NOT NULL,
  created_at  timestamptz DEFAULT now()
)

series (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text NOT NULL,
  title_it          text,
  type              text CHECK (type IN ('comic','manga','graphic_novel','bd')),
  publisher_id      uuid REFERENCES publishers(id),
  cover_url         text,
  description_it    text,
  status            text CHECK (status IN ('ongoing','completed','cancelled')),
  genre             text[],
  start_year        int,
  slug              text UNIQUE NOT NULL,
  created_by_user_id uuid,
  is_verified       boolean DEFAULT false,
  created_at        timestamptz DEFAULT now()
)

issues (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id        uuid REFERENCES series(id) ON DELETE CASCADE,
  number           int NOT NULL,
  title            text,
  cover_url        text,
  release_date_it  date,
  cover_price_eur  numeric(6,2),
  isbn             text,
  description      text
)

volumes (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id        uuid REFERENCES series(id) ON DELETE CASCADE,
  number           int NOT NULL,
  title            text,
  cover_url        text,
  release_date_it  date,
  cover_price_eur  numeric(6,2),
  isbn             text,
  description      text
)

-- User data

users (
  id          uuid PRIMARY KEY REFERENCES auth.users(id),
  username    text UNIQUE,
  avatar_url  text,
  country     text DEFAULT 'IT',
  created_at  timestamptz DEFAULT now()
)

user_collection_items (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid REFERENCES users(id) ON DELETE CASCADE,
  item_type          text CHECK (item_type IN ('issue','volume')),
  item_id            uuid NOT NULL,
  status             text CHECK (status IN ('owned','wished','missing')),
  purchase_price_eur numeric(6,2),
  purchase_date      date,
  notes              text,
  added_at           timestamptz DEFAULT now()
)

user_series_follows (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES users(id) ON DELETE CASCADE,
  series_id  uuid REFERENCES series(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, series_id)
)

-- Content curation

upcoming_releases (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type           text CHECK (item_type IN ('issue','volume')),
  item_id             uuid NOT NULL,
  expected_date_it    date,
  is_confirmed        boolean DEFAULT false,
  source_url          text,
  created_at          timestamptz DEFAULT now()
)

-- Collection value snapshots (for growth chart)

collection_snapshots (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES users(id) ON DELETE CASCADE,
  snapshot_date    date NOT NULL,
  total_items      int DEFAULT 0,
  total_est_value_eur numeric(10,2) DEFAULT 0,
  created_at       timestamptz DEFAULT now()
)
```

**Notes:**
- `is_verified` on series distinguishes admin-added from user-contributed entries
- `collection_snapshots` recorded weekly via Supabase pg_cron scheduled function
- Row-Level Security (RLS) on all user tables — users can only read/write their own data
- `series` and catalog tables are publicly readable, write-protected to admin only

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/series` | Browse/search series (full-text search) |
| GET | `/api/series/:id` | Series detail + issues or volumes |
| GET | `/api/items/:type/:id` | Issue or volume detail |
| GET | `/api/collection` | Authenticated user's collection |
| POST | `/api/collection` | Add item to collection |
| PATCH | `/api/collection/:id` | Update status / price |
| DELETE | `/api/collection/:id` | Remove from collection |
| GET | `/api/collection/missing` | Missing items per followed series |
| GET | `/api/wishlist` | User wishlist |
| GET | `/api/dashboard` | Aggregated stats for dashboard |
| GET | `/api/upcoming` | Upcoming releases feed |
| POST | `/api/series` | User submits new series (unverified) |
| GET | `/api/admin/series` | Admin: manage series catalog |
| POST | `/api/admin/upcoming` | Admin: curate upcoming releases |

All routes delegate to Supabase via typed client. No separate backend service.

---

## Authentication

- **Provider:** Supabase Auth
- **Methods:** Email/password + Google OAuth
- **Session:** Supabase JWT, handled via Next.js middleware
- **Protected routes:** Middleware redirects unauthenticated users to `/login`
- **Admin routes:** Checked against a hardcoded admin user ID or a `role` field on the `users` table

---

## Search

- **MVP:** PostgreSQL full-text search via Supabase
- **Index:** `tsvector` on `series.title` + `series.title_it`
- **Upgrade path:** Algolia or Typesense when catalog exceeds ~1,000 series

---

## Dashboard Metrics

All metrics computed via SQL aggregates on demand. No separate analytics pipeline.

Weekly snapshot job via Supabase pg_cron:
```sql
INSERT INTO collection_snapshots (user_id, snapshot_date, total_items, total_est_value_eur)
SELECT
  user_id,
  CURRENT_DATE,
  COUNT(*) FILTER (WHERE status = 'owned'),
  SUM(COALESCE(purchase_price_eur, cover_price_eur, 0)) FILTER (WHERE status = 'owned')
FROM user_collection_items
JOIN (SELECT id, cover_price_eur FROM issues UNION ALL SELECT id, cover_price_eur FROM volumes) items
  ON items.id = user_collection_items.item_id
GROUP BY user_id;
```

---

## Infrastructure

| Service | Plan | Cost |
|---|---|---|
| Supabase | Free (500MB DB, 1GB storage) | $0 |
| Vercel | Hobby (free) | $0 |
| Domain | custom (optional) | ~$15/yr |

**Total MVP infra cost: ~$0/month**

Upgrade triggers:
- Supabase Pro ($25/mo) when > 500MB DB or need daily backups
- Vercel Pro ($20/mo) when team grows or need custom CI

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://wcdhmesghnjelfasqvqn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>  # server-only, never exposed to client
```

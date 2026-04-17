# Takobon — Product Plan

## Product Summary

A mobile-first (web-first for MVP) collector app for comic and manga fans in the Italian market. The goal is to validate the B2C collector experience fast, with a clean architecture that can evolve into a B2B platform for comic shops.

---

## MVP Scope

### In scope
- User authentication (email + Google OAuth)
- Onboarding flow (pick genres, first series)
- Series catalog (browsable, searchable)
- Collection management (mark owned / wished / missing)
- Series detail page (issues list or volumes list)
- Item detail page
- Wishlist view
- Missing items tracker
- Upcoming releases (admin-curated)
- Collector dashboard with key stats
- Estimated collection value
- User profile

### Out of scope for MVP
- Barcode scanning
- Store integrations / pull lists
- Social features
- AI recommendations
- Push notifications
- Native mobile app (web-first, PWA-friendly)
- Real-time market valuation
- Publisher tooling

---

## User Flows

### Onboarding
Landing → Sign up → Pick interests → Add first series → Dashboard

### Adding to Collection
Search series → Series detail → Tap issue/volume → Mark Owned / Wished / Missing → Optional: enter purchase price

### Discovery
Upcoming releases feed → Tap item → See series context → Add to Wishlist

### Dashboard loop
Open app → See stats update → Get rewarded by collection growth → Be reminded of missing items → Return

---

## Information Architecture

```
App
├── Dashboard (home)
├── My Collection
│   ├── Library (owned items, by series)
│   ├── Wishlist
│   └── Missing Issues/Volumes
├── Discover
│   ├── Search
│   ├── Browse by type / publisher / genre
│   └── Upcoming Releases
├── Series Detail
│   └── Item Detail
└── Profile / Settings
```

---

## Page Routes

```
/                           → landing / redirect to dashboard
/login                      → auth
/signup                     → auth
/onboarding                 → first-run flow

/dashboard                  → collector dashboard (home)
/collection                 → library (owned items)
/collection/wishlist        → wishlist
/collection/missing         → missing issues/volumes

/search                     → search
/upcoming                   → upcoming releases

/series/[slug]              → series detail
/series/[slug]/[type]/[id]  → issue or volume detail

/profile                    → user profile & stats
/admin                      → admin panel (protected)
```

---

## Core Screens

1. **Dashboard** — stats cards, recent activity, quick actions
2. **Collection Library** — series grid, filter/sort, completion badges
3. **Series Detail** — cover, metadata, issues/volumes list with status indicators
4. **Item Detail** — cover, details, mark owned/wished/missing, price field
5. **Search** — instant results, type filters
6. **Upcoming Releases** — chronological feed, add to wishlist
7. **Wishlist** — list view, estimated value
8. **Missing Tracker** — grouped by series, gaps highlighted
9. **Onboarding** — 3-step flow, interest picker, first series add
10. **Profile** — stats, join date, activity

---

## Italian Market & Data Strategy

No comprehensive free Italian comics API exists. The main Italian distributor is Anteprima (anteprima.net) but has no public API.

**Approach:**
1. **Manual admin seeding** — top ~50 Italian series before launch (Bonelli, Panini, Star Comics, BAO)
2. **User-contributed entries** — users can add series, marked `is_verified: false`, reviewed by admin
3. **ISBN lookup (future)** — Open Library / ISBNdb for enrichment
4. **Anteprima (future)** — manual weekly curation or light scraper for upcoming releases

**Italian publishers to prioritize:**
Sergio Bonelli Editore, Panini Comics, Star Comics, BAO Publishing, Feltrinelli Comics, Tunué

---

## Collection Value Estimation

```
Estimated value = SUM of:
  - purchase_price_eur  (if user entered one)
  - else cover_price_eur  (from catalog item)
  - else 0  (excluded from total, flagged)
```

- Clearly labeled: "Stima basata sul prezzo di copertina — non riflette il valore di mercato attuale"
- User can override price per item at any time
- No external pricing API for MVP

---

## Dashboard Metrics

All computed via SQL aggregates on demand.

| Metric | Approach |
|---|---|
| Total owned items | COUNT WHERE status = 'owned' |
| Total series followed | COUNT on user_series_follows |
| Missing items | COUNT WHERE status = 'missing' |
| Wishlist count | COUNT WHERE status = 'wished' |
| Completion % per series | owned / total issues in series |
| Recently added | ORDER BY added_at DESC LIMIT 10 |
| Monthly additions | GROUP BY month |
| Collection growth | Weekly snapshots via pg_cron |
| Estimated value | SUM of cover_price or purchase_price |

---

## Development Phases

### Phase 0 — Foundation (2 weeks)
- Supabase project setup, schema, RLS policies
- Next.js scaffold, Tailwind, shadcn/ui, auth flow
- Admin data entry: seed top 30 Italian series
- Basic series browse and search

### Phase 1 — Core Collection (3 weeks)
- Series detail + item detail pages
- Mark owned / wished / missing
- Collection library view
- Wishlist + missing tracker
- User profile

### Phase 2 — Dashboard & Polish (2 weeks)
- Collector dashboard with all metrics
- Collection value estimation
- Growth chart (weekly snapshot job)
- Onboarding flow
- UX polish, animations, mobile responsiveness

### Phase 3 — Discovery & Content (1 week)
- Upcoming releases section
- User-submitted series flow
- Browse by publisher / genre / type

### Phase 4 — Beta Launch (1 week)
- QA, performance testing
- Vercel deployment
- PWA manifest
- First beta users

**Total: ~9 weeks** (solo dev, UX designer in parallel)

---

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Catalog cold-start | High | Manual seed 50 top Italian series before beta |
| No Italian comic API | Medium | Manual entry + user contributions |
| Solo dev bandwidth | High | Strict scope, managed services |
| Cover image rights | Medium | Low-res public covers first |
| Anteprima data freshness | Low | Manual weekly curation |

---

## 6-Week Fast MVP (cut list)

- Upcoming releases → 5 static mock cards
- Growth chart → current snapshot only
- User-contributed series → admin-only catalog
- Genre/publisher browsing → search only
- Onboarding personalization → skip to empty dashboard

Core loop: Auth → Add items → Library → Wishlist → Missing → Dashboard

---

## v2 Roadmap

- React Native (Expo) mobile app — same Supabase backend
- Barcode scanning — ISBN lookup via Open Library
- Comic shop integration — pull lists, demand signals
- Push notifications — new issue alerts
- Advanced valuation — pricing API or community prices
- Social layer — follow friends, compare collections
- B2B store dashboard

---

## Build Order

1. Supabase schema + RLS policies
2. Next.js scaffold + auth
3. Series catalog seed (parallel with UX design)
4. Series browse + search UI
5. Series detail + item detail
6. Collection CRUD (owned / wished / missing)
7. Collection library view
8. Wishlist + missing tracker
9. Dashboard metrics + UI
10. Collection value estimation
11. Onboarding flow
12. Upcoming releases
13. User-submitted series form
14. PWA manifest + mobile polish
15. Beta deploy + QA

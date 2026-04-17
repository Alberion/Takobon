# Takobon

A premium comic and manga collector app for the Italian market.

Takobon helps collectors track what they own, discover what they're missing, manage a wishlist, and understand their collection through a rewarding dashboard. Built to feel like a personal archive — calm, intelligent, and visual-first.

## Vision

- **B2C:** A collector app people love using
- **B2B (future):** A platform comic shops use to manage pull lists, reservations, and demand signals

## Documentation

| Document | Description |
|---|---|
| [Product Plan](docs/product-plan.md) | MVP scope, user flows, information architecture, development phases |
| [Design System](docs/design-system.md) | Visual identity, color tokens, typography, component principles |
| [Architecture](docs/architecture.md) | Tech stack, database schema, API structure, infrastructure |

## Tech Stack

- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Hosting:** Vercel + Supabase
- **Auth:** Supabase Auth (email + Google OAuth)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.

## Project Structure

```
app/
  (auth)/       # login, signup
  (app)/        # dashboard, collection, search, upcoming, series, profile
  onboarding/   # first-run flow
  admin/        # admin panel
lib/
  supabase/     # server + browser clients
components/
  ui/           # shadcn/ui components
  takobon/      # app-specific components
docs/           # product, design, and architecture docs
```

## Team

- 1 engineer (founder)
- 1 UX designer

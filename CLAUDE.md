# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Run production server
```

There are no lint or test scripts configured.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + `styles/design-system.css` for brand CSS variables (earthy green/amber palette, dark mode)
- **MongoDB** via **Mongoose** — connection pooled in `lib/db/connectDB.ts` (Vercel-safe singleton)
- **Clerk** for auth — `@clerk/nextjs` v7; `auth()` used in API routes to get `userId`
- **SWR** for all client data fetching — `SWRProvider` in `components/` auto-signs out on 401

## Architecture

### Data flow
React screens → custom hooks (`hooks/`) → SWR fetches `/api/*` → API routes validate auth + `connectDB()` → Mongoose → MongoDB Atlas.

### Gamification engine (`lib/algorithms/`)
Three pure functions compute derived state from historical records:
- `streakCounter` — green/blue/amber/gray day classification → current & longest streak
- `plantStage` — aggregates metrics to advance virtual plant through 8 growth stages
- `badges` — 12 badges unlocked by stat thresholds (first_gym, streak_7, plant_stage_6, etc.)

These run client-side inside hooks (`useStreak`, `usePlantStage`, `useBadges`), not on the server.

### API surface
| Route | Purpose |
|---|---|
| `/api/records` | CRUD for daily `Record` documents, keyed by `dateKey` (YYYY-MM-DD) |
| `/api/badges` | Fetch/sync earned badges |
| `/api/settings` | User preferences (water goal, etc.) |

Unique constraint: `(userId, dateKey)` — one record per user per day.

### Component structure
`AppShell` → `ThemeProvider` + `BottomNav` + feature screens (`CheckInScreen`, `CalendarScreen`, `StatsScreen`, `PlantScreen`). `CheckInScreen` is composed of sub-cards (GutFeelingCard, HydrationCard, etc.).

## Environment variables

```
MONGODB_URI
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Firebase (web push notifications)
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_VAPID_KEY
FIREBASE_SERVICE_ACCOUNT_KEY   # full service account JSON, stringified
CRON_SECRET                    # used by Vercel Cron to authenticate /api/cron/reminders
```

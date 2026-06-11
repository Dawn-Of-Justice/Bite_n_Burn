# UI Improvements Design — Bite & Burn

**Date:** 2026-04-12  
**Scope:** Skeleton UI, bottom nav active pip, page transitions, empty states, AppShell skeleton

---

## Overview

Five coordinated UI improvements to make the app feel polished and responsive. All improvements are additive — no existing logic or data flow changes.

---

## 1. Shared Skeleton Primitive

**File:** `components/common/Skeleton.tsx`

A single `Skeleton` component accepts `width`, `height` (default `12px`), and `radius` (default `8px`) props and renders a shimmer div. The shimmer keyframe and `--skeleton-bg` CSS variable are added to `styles/design-system.css`.

```css
/* design-system.css additions */
--skeleton-bg: rgba(74, 55, 40, 0.1);

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

Dark mode: `[data-theme="dark"]` overrides `--skeleton-bg` to `rgba(244, 227, 215, 0.08)`.

The component uses `background: linear-gradient(90deg, var(--skeleton-bg) 25%, transparent 50%, var(--skeleton-bg) 75%)` with `background-size: 200% 100%` and the shimmer animation.

---

## 2. Per-Screen Skeleton Components

Each screen gets a dedicated skeleton component that mirrors the real screen's layout. These are rendered when SWR `isLoading` is true or `settings` is null.

### `components/checkin/CheckInSkeleton.tsx`
Renders:
- Sticky header bar (title + streak pill shapes)
- Date label + heading bars
- 3 skeleton cards (PoyoCard, KazhichoCard, HydrationCard shapes) with inner bar placeholders

### `components/stats/StatsSkeleton.tsx`
Renders:
- PageHeader skeletons (title + subtitle)
- Gradient motivational card placeholder
- "This Week" card with 3 circular icon skeletons + number bars
- 2-column grid of 4 stat cards (number + label bars)

### `components/plant/PlantSkeleton.tsx`
Renders:
- PageHeader skeletons
- Large plant card: circular plant shape (80×80) + title bar + progress bar skeleton
- BadgeShelf skeleton: 4×3 grid of circular badge skeletons

### `components/calendar/CalendarSkeleton.tsx`
Renders:
- PageHeader skeletons
- Month nav row (two circle buttons + title bar)
- 7-column weekday header bars
- Full calendar grid of day cell skeletons (42 cells)

### Usage pattern (same for all screens)
```tsx
// Example: CheckInScreen.tsx
// Use !settings as the loading guard (consistent with existing pattern).
// CheckInScreen also checks isLoading from useDayRecord for the yesterday record.
if (!settings) return <CheckInSkeleton />
```

---

## 3. AppShell Loading Skeleton

**File:** `components/AppShell.tsx`

Replace the current emoji spinner:
```tsx
// Before
return (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <div style={{ fontSize: 52 }}>🌱</div>
    <p>Loading...</p>
  </div>
)

// After
return <AppShellSkeleton />
```

**File:** `components/common/AppShellSkeleton.tsx`

Renders a full-screen skeleton that matches the app chrome: a sticky top bar skeleton + 3 stacked card skeletons + a bottom nav with 5 skeleton icon slots. This makes the first load feel instant rather than blank.

---

## 4. Bottom Nav Active Pip

**File:** `components/common/BottomNav.tsx`

Add a `framer-motion` `layoutId="nav-pip"` element rendered only on the active nav item. It appears as a 3px tall, 18px wide `--brand-forest` pill at the bottom of the active icon. `framer-motion` automatically animates it sliding between tabs.

```tsx
{isActive && (
  <motion.div
    layoutId="nav-pip"
    style={{ width: 18, height: 3, background: 'var(--brand-forest)', borderRadius: '2px 2px 0 0' }}
  />
)}
```

No additional dependencies — `framer-motion` is already installed.

---

## 5. Page Transitions

**File:** `app/layout.tsx`

Wrap `{children}` in a `framer-motion` `AnimatePresence` + `motion.div` keyed on the current pathname. Animation: `opacity 0→1`, `y 8→0`, duration `0.2s ease-out`.

```tsx
// layout.tsx
'use client'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

// Inside AppShell render:
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

The `AppShell.tsx` already wraps children — the motion wrapper goes inside `AppShell` so it only applies to authenticated, onboarded users.

---

## 6. Empty States

Two screens need empty state handling for new users (zero records).

### Stats screen — `components/stats/StatsScreen.tsx`
When `records.length === 0`, render an empty state card instead of the stats grid:
- Icon: 📊
- Title: "No data yet!"
- Body: "Check in today to start seeing your stats here."
- Button: Links to `/` (check-in screen)

### BadgeShelf — `components/plant/BadgeShelf.tsx`
The existing `badges.length === 0` check already shows a text message. Upgrade it to a proper empty state with icon 🏆, title, body text, and a styled CTA button linking to `/`.

---

## File Change Summary

| File | Change |
|---|---|
| `styles/design-system.css` | Add `--skeleton-bg`, dark mode override, `@keyframes shimmer` |
| `components/common/Skeleton.tsx` | **New** — shared shimmer primitive |
| `components/common/AppShellSkeleton.tsx` | **New** — full-screen app chrome skeleton |
| `components/checkin/CheckInSkeleton.tsx` | **New** |
| `components/stats/StatsSkeleton.tsx` | **New** |
| `components/plant/PlantSkeleton.tsx` | **New** |
| `components/calendar/CalendarSkeleton.tsx` | **New** |
| `components/AppShell.tsx` | Use `AppShellSkeleton` instead of emoji spinner; add `AnimatePresence` page transition wrapper |
| `components/checkin/CheckInScreen.tsx` | Return `<CheckInSkeleton />` when `!settings` |
| `components/stats/StatsScreen.tsx` | Return `<StatsSkeleton />` when `!settings`; add empty state |
| `components/plant/PlantScreen.tsx` | Return `<PlantSkeleton />` when `!settings` |
| `components/calendar/CalendarScreen.tsx` | Return `<CalendarSkeleton />` when `!settings` |
| `components/plant/BadgeShelf.tsx` | Upgrade empty state to styled card |
| `components/common/BottomNav.tsx` | Add `layoutId="nav-pip"` motion pip |

---

## Out of Scope

- No changes to API routes, hooks, or data models
- No new npm dependencies
- Settings screen skeleton deferred (settings loads fast, low impact)

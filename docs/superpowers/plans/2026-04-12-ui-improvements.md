# UI Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add skeleton UI, bottom nav active pip, page transitions, and empty states across all screens to make the app feel polished and responsive.

**Architecture:** A shared `Skeleton` primitive with a CSS shimmer animation is composed into per-screen skeleton components. Each screen returns its skeleton when `!settings`. AppShell gets the skeleton on first load + `AnimatePresence` page transitions. BottomNav gets a `framer-motion` `layoutId` pip that slides between tabs.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, framer-motion (already installed), Tailwind CSS 4 + `styles/design-system.css` for CSS vars

> **Note:** There are no test scripts configured in this project. Each task verifies correctness by running `npm run dev` and inspecting in the browser. Manual verification steps replace automated test runs.

---

## File Map

| File | Status | Responsibility |
|---|---|---|
| `styles/design-system.css` | Modify | Add `--skeleton-bg`, dark mode override, `@keyframes shimmer` |
| `components/common/Skeleton.tsx` | Create | Shared shimmer block primitive |
| `components/common/AppShellSkeleton.tsx` | Create | Full-screen chrome skeleton for first load |
| `components/checkin/CheckInSkeleton.tsx` | Create | Skeleton matching CheckIn layout |
| `components/stats/StatsSkeleton.tsx` | Create | Skeleton matching Stats layout |
| `components/plant/PlantSkeleton.tsx` | Create | Skeleton matching Plant + BadgeShelf layout |
| `components/calendar/CalendarSkeleton.tsx` | Create | Skeleton matching Calendar grid layout |
| `components/AppShell.tsx` | Modify | Use `AppShellSkeleton`; add `AnimatePresence` page transitions |
| `components/checkin/CheckInScreen.tsx` | Modify | Return `<CheckInSkeleton />` when `!settings` |
| `components/stats/StatsScreen.tsx` | Modify | Return `<StatsSkeleton />` when `!settings`; add empty state |
| `components/plant/PlantScreen.tsx` | Modify | Return `<PlantSkeleton />` when `!settings` |
| `components/calendar/CalendarScreen.tsx` | Modify | Return `<CalendarSkeleton />` when `!settings` |
| `components/plant/BadgeShelf.tsx` | Modify | Upgrade empty state to styled card with CTA |
| `components/common/BottomNav.tsx` | Modify | Add `layoutId="nav-pip"` framer-motion pip |

---

## Task 1: CSS Skeleton Variables + Shared Skeleton Primitive

**Files:**
- Modify: `styles/design-system.css`
- Create: `components/common/Skeleton.tsx`

- [ ] **Step 1: Add shimmer CSS to `styles/design-system.css`**

Open `styles/design-system.css`. Add inside `:root { }` (after `--shadow-card`):

```css
  /* Skeleton loading */
  --skeleton-bg:       rgba(74, 55, 40, 0.10);
  --skeleton-bg-light: rgba(74, 55, 40, 0.04);
```

Add inside `[data-theme="dark"] { }` (after `--border-color`):

```css
  --skeleton-bg:       rgba(244, 227, 215, 0.08);
  --skeleton-bg-light: rgba(244, 227, 215, 0.02);
```

Add at the bottom of the file (after the `input[type=number]` block):

```css
/* Skeleton shimmer animation */
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

- [ ] **Step 2: Create `components/common/Skeleton.tsx`**

```tsx
'use client'
import type { CSSProperties } from 'react'

interface Props {
  width?: number | string
  height?: number | string
  radius?: number | string
  style?: CSSProperties
}

export function Skeleton({ width, height = 12, radius = 8, style }: Props) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'linear-gradient(90deg, var(--skeleton-bg) 25%, var(--skeleton-bg-light) 50%, var(--skeleton-bg) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
        flexShrink: 0,
        ...style,
      }}
    />
  )
}
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`. Open any page. Open DevTools → Elements, temporarily add `--skeleton-bg: red` to `:root` and confirm it overrides. Remove it. Shimmer won't be visible yet — that's fine, it will be tested as part of Task 2.

- [ ] **Step 4: Commit**

```bash
git add styles/design-system.css components/common/Skeleton.tsx
git commit -m "feat: add skeleton shimmer CSS vars and shared Skeleton primitive"
```

---

## Task 2: AppShellSkeleton + AppShell Loading State

**Files:**
- Create: `components/common/AppShellSkeleton.tsx`
- Modify: `components/AppShell.tsx`

- [ ] **Step 1: Create `components/common/AppShellSkeleton.tsx`**

```tsx
'use client'
import { Skeleton } from '@/components/common/Skeleton'

export function AppShellSkeleton() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', paddingBottom: 72 }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <Skeleton width={90} height={14} />
        <Skeleton width={72} height={24} radius={20} />
      </div>
      {/* Body cards */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skeleton width={140} height={18} style={{ marginBottom: 4 }} />
        <Skeleton width={90} height={12} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={80} radius={20} />
        <Skeleton width="100%" height={80} radius={20} />
        <Skeleton width="100%" height={80} radius={20} />
      </div>
      {/* Bottom nav */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        background: 'var(--bg-nav)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 64,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Skeleton width={22} height={22} radius={6} />
            <Skeleton width={28} height={8} radius={4} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update `components/AppShell.tsx` to use the skeleton**

Replace the loading return block (lines 27–34 in the current file). The full updated `AppShell.tsx`:

```tsx
'use client'
import { useAuth } from '@clerk/nextjs'
import { SignIn } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useSettings } from '@/hooks/useSettings'
import { BottomNav } from '@/components/common/BottomNav'
import { OnboardingScreen } from '@/components/settings/OnboardingScreen'
import { ThemeProvider } from '@/components/common/ThemeProvider'
import { WhatsNewModal } from '@/components/common/WhatsNewModal'
import { AppShellSkeleton } from '@/components/common/AppShellSkeleton'
import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  const { settings, isLoading } = useSettings()
  const pathname = usePathname()

  if (!isLoaded || (isSignedIn && isLoading)) {
    return <AppShellSkeleton />
  }

  if (!isSignedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16, padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 56 }}>🌱</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--brand-forest)', margin: '8px 0 4px' }}>Bite & Burn</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Kazhicho? Poyo? Track it.</p>
        </div>
        <SignIn routing="hash" />
      </div>
    )
  }

  if (settings && !settings.onboardingCompleted) {
    return <OnboardingScreen />
  }

  return (
    <ThemeProvider theme={settings?.theme ?? 'system'}>
      <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative', minHeight: '100vh', paddingBottom: 72 }}>
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
        <BottomNav />
        <WhatsNewModal />
      </div>
    </ThemeProvider>
  )
}
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`. Open the app in an incognito tab (to catch the loading state). Confirm:
- The skeleton chrome (header bars + card bars + nav) appears briefly on first load instead of the 🌱 emoji
- Navigating between tabs shows a short fade transition (opacity + slight slide up)

- [ ] **Step 4: Commit**

```bash
git add components/common/AppShellSkeleton.tsx components/AppShell.tsx
git commit -m "feat: replace loading spinner with AppShellSkeleton, add page transitions"
```

---

## Task 3: CheckIn Skeleton

**Files:**
- Create: `components/checkin/CheckInSkeleton.tsx`
- Modify: `components/checkin/CheckInScreen.tsx`

- [ ] **Step 1: Create `components/checkin/CheckInSkeleton.tsx`**

```tsx
'use client'
import { Skeleton } from '@/components/common/Skeleton'
import { Card } from '@/components/common/Card'

export function CheckInSkeleton() {
  return (
    <div>
      {/* DailySummaryBar skeleton */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Skeleton width={90} height={14} />
        <Skeleton width={72} height={24} radius={20} />
      </div>

      <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Date + heading */}
        <div style={{ marginBottom: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton width={60} height={11} />
          <Skeleton width={160} height={18} />
        </div>

        {/* 4 card skeletons (Poyo, Kazhicho, Hydration, Gut) */}
        {[0, 1, 2, 3].map(i => (
          <Card key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Skeleton width={80} height={12} />
            <Skeleton width="100%" height={32} radius={12} />
          </Card>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire skeleton into `components/checkin/CheckInScreen.tsx`**

Add the import at the top (after the existing imports):

```tsx
import { CheckInSkeleton } from '@/components/checkin/CheckInSkeleton'
```

Replace the existing `if (!settings) return null;` guard (line 68) with:

```tsx
if (!settings) return <CheckInSkeleton />
```

- [ ] **Step 3: Verify in browser**

In DevTools → Network, throttle to "Slow 3G". Reload the check-in screen (`/`). Confirm the shimmer card skeleton appears before the real cards animate in.

- [ ] **Step 4: Commit**

```bash
git add components/checkin/CheckInSkeleton.tsx components/checkin/CheckInScreen.tsx
git commit -m "feat: add CheckIn skeleton loading state"
```

---

## Task 4: Stats Skeleton + Empty State

**Files:**
- Create: `components/stats/StatsSkeleton.tsx`
- Modify: `components/stats/StatsScreen.tsx`

- [ ] **Step 1: Create `components/stats/StatsSkeleton.tsx`**

```tsx
'use client'
import { Skeleton } from '@/components/common/Skeleton'
import { Card } from '@/components/common/Card'

export function StatsSkeleton() {
  return (
    <div>
      {/* PageHeader skeleton */}
      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skeleton width={160} height={22} />
        <Skeleton width={110} height={12} />
      </div>

      <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Motivational card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--brand-forest), var(--brand-leaf))',
          borderRadius: 'var(--radius-card)',
          padding: '18px 20px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Skeleton width="60%" height={14} style={{ opacity: 0.35 }} />
        </div>

        {/* This Week card */}
        <Card>
          <Skeleton width={70} height={12} style={{ marginBottom: 12 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ textAlign: 'center', padding: '10px 0', background: 'var(--bg-primary)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Skeleton width={24} height={24} radius="50%" />
                <Skeleton width={36} height={20} radius={6} />
                <Skeleton width={44} height={9} radius={4} />
              </div>
            ))}
          </div>
        </Card>

        {/* Streak stat grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[0, 1, 2, 3].map(i => (
            <Card key={i} style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Skeleton width={36} height={26} radius={6} />
              <Skeleton width={50} height={9} radius={4} />
              <Skeleton width={70} height={9} radius={4} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire skeleton and add empty state into `components/stats/StatsScreen.tsx`**

Add imports at the top:

```tsx
import Link from 'next/link'
import { StatsSkeleton } from '@/components/stats/StatsSkeleton'
```

Replace the existing `if (!settings) return null;` guard with:

```tsx
if (!settings) return <StatsSkeleton />
```

After the `const message = getMotivationalMessage(todayColor)` line and before `return (`, add the empty state guard:

```tsx
if (records.length === 0) {
  return (
    <div>
      <PageHeader title="Stats & Progress" subtitle="Ente journey kando?" />
      <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>📊</div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>No data yet!</h2>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 220 }}>
          Check in today to start seeing your stats here.
        </p>
        <Link
          href="/"
          style={{
            marginTop: 8,
            background: 'var(--brand-leaf)',
            color: '#fff',
            textDecoration: 'none',
            padding: '10px 24px',
            borderRadius: 50,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Check in now →
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Navigate to `/stats`. On slow network: confirm skeleton appears. With a fresh account (0 records): confirm the empty state card with "Check in now →" link renders instead of zero-filled stats.

- [ ] **Step 4: Commit**

```bash
git add components/stats/StatsSkeleton.tsx components/stats/StatsScreen.tsx
git commit -m "feat: add Stats skeleton and empty state for new users"
```

---

## Task 5: Plant Skeleton

**Files:**
- Create: `components/plant/PlantSkeleton.tsx`
- Modify: `components/plant/PlantScreen.tsx`

- [ ] **Step 1: Create `components/plant/PlantSkeleton.tsx`**

```tsx
'use client'
import { Skeleton } from '@/components/common/Skeleton'
import { Card } from '@/components/common/Card'

export function PlantSkeleton() {
  return (
    <div>
      {/* PageHeader skeleton */}
      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skeleton width={150} height={22} />
        <Skeleton width={100} height={12} />
      </div>

      <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Plant display card */}
        <Card style={{ textAlign: 'center', padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Skeleton width={80} height={80} radius="50%" />
          <Skeleton width={130} height={18} style={{ marginTop: 4 }} />
          <Skeleton width={90} height={12} />
          <Skeleton width="100%" height={8} radius={4} style={{ marginTop: 6 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 2 }}>
            <Skeleton width={40} height={10} radius={4} />
            <Skeleton width={60} height={10} radius={4} />
            <Skeleton width={40} height={10} radius={4} />
          </div>
        </Card>

        {/* Score guide card */}
        <Card>
          <Skeleton width={120} height={12} style={{ marginBottom: 10 }} />
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Skeleton width={10} height={10} radius={3} />
                <Skeleton width={120} height={10} radius={4} />
              </div>
              <Skeleton width={36} height={10} radius={4} />
            </div>
          ))}
        </Card>

        {/* Badge shelf skeleton */}
        <Card>
          <Skeleton width={110} height={14} style={{ marginBottom: 12 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px' }}>
                <Skeleton width={42} height={42} radius="50%" />
                <Skeleton width={32} height={8} radius={4} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire skeleton into `components/plant/PlantScreen.tsx`**

Add import:

```tsx
import { PlantSkeleton } from '@/components/plant/PlantSkeleton'
```

Replace the existing loading return block (lines 15–20 in the current file):

```tsx
// Before:
if (!settings || !plantInfo) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <span style={{ fontSize: 48 }}>🌱</span>
    </div>
  )
}

// After:
if (!settings || !plantInfo) return <PlantSkeleton />
```

- [ ] **Step 3: Verify in browser**

Navigate to `/plant`. On slow network: confirm the plant circle skeleton + badge grid skeleton appears before the animated plant renders.

- [ ] **Step 4: Commit**

```bash
git add components/plant/PlantSkeleton.tsx components/plant/PlantScreen.tsx
git commit -m "feat: add Plant skeleton loading state"
```

---

## Task 6: Calendar Skeleton

**Files:**
- Create: `components/calendar/CalendarSkeleton.tsx`
- Modify: `components/calendar/CalendarScreen.tsx`

- [ ] **Step 1: Create `components/calendar/CalendarSkeleton.tsx`**

```tsx
'use client'
import { Skeleton } from '@/components/common/Skeleton'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function CalendarSkeleton() {
  return (
    <div>
      {/* PageHeader skeleton */}
      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skeleton width={160} height={22} />
        <Skeleton width={130} height={12} />
      </div>

      <div style={{ padding: '16px 16px 24px' }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Skeleton width={36} height={36} radius="50%" />
          <Skeleton width={110} height={16} />
          <Skeleton width={36} height={36} radius="50%" />
        </div>

        {/* Weekday header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
          {WEEKDAYS.map(d => (
            <div key={d} style={{ display: 'flex', justifyContent: 'center' }}>
              <Skeleton width={16} height={10} radius={4} />
            </div>
          ))}
        </div>

        {/* Calendar grid — 42 cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {Array.from({ length: 42 }).map((_, i) => (
            <Skeleton key={i} width="100%" height={36} radius={10} />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire skeleton into `components/calendar/CalendarScreen.tsx`**

Add import:

```tsx
import { CalendarSkeleton } from '@/components/calendar/CalendarSkeleton'
```

The `CalendarScreen` currently has no explicit `!settings` guard — it conditionally passes `null` to `computeCalendarColor`. Add a guard right after the hook calls (after `const recordMap = ...` line):

```tsx
// After: const recordMap = new Map((records ?? []).map(r => [r.dateKey, r]))
if (!settings) return <CalendarSkeleton />
```

- [ ] **Step 3: Verify in browser**

Navigate to `/calendar`. On slow network: confirm the month nav + 42-cell grid skeleton appears before the coloured day cells render.

- [ ] **Step 4: Commit**

```bash
git add components/calendar/CalendarSkeleton.tsx components/calendar/CalendarScreen.tsx
git commit -m "feat: add Calendar skeleton loading state"
```

---

## Task 7: Bottom Nav Active Pip

**Files:**
- Modify: `components/common/BottomNav.tsx`

- [ ] **Step 1: Rewrite `components/common/BottomNav.tsx` with the motion pip**

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckSquare, CalendarDays, Sprout, BarChart3, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', icon: CheckSquare, label: "innu's" },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/plant', icon: Sprout, label: 'Plant' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      background: 'var(--bg-nav)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 64,
      paddingBottom: 'env(safe-area-inset-bottom)',
      backdropFilter: 'blur(16px)',
      zIndex: 100,
    }}>
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
        const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)
        return (
          <Link
            key={to}
            href={to}
            prefetch={false}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '6px 12px',
              textDecoration: 'none',
              color: isActive ? 'var(--brand-forest)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 400,
              fontSize: 10,
              transition: 'color 0.2s',
              position: 'relative',
            }}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            {label}
            {isActive && (
              <motion.div
                layoutId="nav-pip"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: 18,
                  height: 3,
                  background: 'var(--brand-forest)',
                  borderRadius: '2px 2px 0 0',
                }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: Verify in browser**

Navigate between tabs. Confirm the forest-green 3px pip slides smoothly from tab to tab. Check that it appears correctly on dark mode.

- [ ] **Step 3: Commit**

```bash
git add components/common/BottomNav.tsx
git commit -m "feat: add sliding active pip to BottomNav"
```

---

## Task 8: BadgeShelf Empty State Upgrade

**Files:**
- Modify: `components/plant/BadgeShelf.tsx`

- [ ] **Step 1: Upgrade the empty state in `components/plant/BadgeShelf.tsx`**

Add import at top:

```tsx
import Link from 'next/link'
```

Replace the existing empty state block:

```tsx
// Before:
{badges.length === 0 && (
  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
    Start checking in to earn badges! Kollam aavum! 🌱
  </p>
)}

// After:
{badges.length === 0 && (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '12px 0 4px', textAlign: 'center' }}>
    <div style={{ fontSize: 40 }}>🏆</div>
    <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>No badges yet</p>
    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
      Start checking in to earn achievements. Kollam aavum!
    </p>
    <Link
      href="/"
      style={{
        marginTop: 4,
        background: 'var(--brand-amber)',
        color: '#fff',
        textDecoration: 'none',
        padding: '8px 20px',
        borderRadius: 50,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      Start →
    </Link>
  </div>
)}
```

- [ ] **Step 2: Verify in browser**

Navigate to `/plant` on an account with no badges. Confirm the Achievements card shows the emoji, title, body, and amber "Start →" button. Click it — confirm it navigates to `/`.

- [ ] **Step 3: Commit**

```bash
git add components/plant/BadgeShelf.tsx
git commit -m "feat: upgrade BadgeShelf empty state with CTA"
```

---

## Self-Review

### Spec coverage check

| Spec requirement | Task |
|---|---|
| `--skeleton-bg` CSS var + `@keyframes shimmer` | Task 1 |
| `Skeleton.tsx` shared primitive | Task 1 |
| `AppShellSkeleton.tsx` | Task 2 |
| AppShell uses skeleton on load | Task 2 |
| Page transitions via `AnimatePresence` | Task 2 |
| `CheckInSkeleton` wired to CheckInScreen | Task 3 |
| `StatsSkeleton` wired to StatsScreen | Task 4 |
| Stats empty state | Task 4 |
| `PlantSkeleton` wired to PlantScreen | Task 5 |
| `CalendarSkeleton` wired to CalendarScreen | Task 6 |
| BottomNav active pip | Task 7 |
| BadgeShelf empty state upgrade | Task 8 |

All spec requirements covered. ✓

### Placeholder scan
No TBDs or incomplete steps. Every task includes full component code. ✓

### Type consistency
- `Skeleton` props: `width`, `height`, `radius`, `style` — used consistently across all skeleton components. ✓
- `layoutId="nav-pip"` string used in one place only (BottomNav). ✓
- `AppShellSkeleton` imported in `AppShell.tsx` — names match. ✓
- All skeleton component names match their import paths. ✓

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

const spring = { type: 'spring' as const, stiffness: 420, damping: 32 }

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 'calc(12px + env(safe-area-inset-bottom))',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: 432,
      background: 'var(--bg-nav)',
      border: '1px solid var(--border-color)',
      borderRadius: 30,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 62,
      padding: '0 6px',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: 'var(--shadow-float)',
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
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              minWidth: 50,
              minHeight: 48,
              padding: '4px 8px',
              textDecoration: 'none',
              color: isActive ? 'var(--brand-leaf)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 400,
              fontSize: 10,
              transition: 'color 0.2s',
            }}
          >
            {isActive && (
              <motion.span
                layoutId="nav-active"
                transition={spring}
                style={{
                  position: 'absolute',
                  inset: 4,
                  borderRadius: 20,
                  background: 'var(--tint-leaf)',
                }}
              />
            )}
            <motion.span
              animate={{ scale: isActive ? 1.12 : 1, y: isActive ? -1 : 0 }}
              transition={{ type: 'spring' as const, stiffness: 480, damping: 20 }}
              style={{ position: 'relative', display: 'flex' }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            </motion.span>
            <span style={{ position: 'relative' }}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

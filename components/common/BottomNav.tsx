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

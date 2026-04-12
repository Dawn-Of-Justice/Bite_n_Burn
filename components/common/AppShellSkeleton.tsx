'use client'
import { Skeleton } from '@/components/common/Skeleton'

function getInitialTheme(): 'dark' | undefined {
  if (typeof window === 'undefined') return undefined
  const stored = localStorage.getItem('theme') ?? 'system'
  if (stored === 'dark') return 'dark'
  if (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return undefined
}

export function AppShellSkeleton() {
  const darkTheme = getInitialTheme()

  return (
    <div data-theme={darkTheme} style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', paddingBottom: 72 }}>
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

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

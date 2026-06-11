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

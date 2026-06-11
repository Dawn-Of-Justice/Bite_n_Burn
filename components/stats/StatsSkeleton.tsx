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

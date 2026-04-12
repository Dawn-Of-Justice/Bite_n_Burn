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

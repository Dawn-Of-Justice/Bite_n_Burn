'use client'
import { Card } from '@/components/common/Card';
import { TapCounter } from '@/components/common/TapCounter';
import type { DailyRecord } from '@/lib/types/records';
import type { UserSettings } from '@/lib/types/settings';
import { hasMetWaterGoal } from '@/lib/utils/water';

interface Props {
  record: Partial<DailyRecord>;
  settings: UserSettings;
  onUpdate: (partial: Partial<DailyRecord>) => void;
}

export function HydrationCard({ record, settings, onUpdate }: Props) {
  const count = record.waterCount ?? 0;
  const met = hasMetWaterGoal(count, settings);

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Vellam? 💧</h2>
        {met && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-leaf)', background: 'rgba(82,183,136,0.15)', borderRadius: 20, padding: '2px 10px' }}>Goal met! 🎯</span>}
      </div>
      <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--text-secondary)' }}>Tap the drop to log water</p>

      <TapCounter
        value={count}
        goal={settings.waterGoalValue}
        unit={settings.waterGoalUnit}
        onChange={(val) => onUpdate({ waterCount: val })}
      />
    </Card>
  );
}

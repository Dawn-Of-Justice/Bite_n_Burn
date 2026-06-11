'use client'
import { Droplets } from 'lucide-react';
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
    <Card accent="#48CAE4">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--tint-sky)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Droplets size={19} color="#48CAE4" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Vellam? 💧</h2>
            <p style={{ margin: '1px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>Tap the drop to log water</p>
          </div>
        </div>
        {met && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-leaf)', background: 'var(--tint-leaf)', borderRadius: 20, padding: '2px 10px', whiteSpace: 'nowrap' }}>Goal met! 🎯</span>}
      </div>

      <TapCounter
        value={count}
        goal={settings.waterGoalValue}
        unit={settings.waterGoalUnit}
        onChange={(val) => onUpdate({ waterCount: val })}
      />
    </Card>
  );
}

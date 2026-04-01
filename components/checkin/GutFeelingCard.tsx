'use client'
import { motion } from 'framer-motion';
import { Card } from '@/components/common/Card';
import type { DailyRecord, GutFeeling } from '@/lib/types/records';

interface Props {
  record: Partial<DailyRecord>;
  onUpdate: (partial: Partial<DailyRecord>) => void;
}

const OPTIONS: { value: GutFeeling; emoji: string; label: string }[] = [
  { value: 'great', emoji: '😄', label: 'Kollam!' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'rough', emoji: '😩', label: 'Tough day' },
];

export function GutFeelingCard({ record, onUpdate }: Props) {
  return (
    <Card>
      <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Nannayirunno? 🤔</h2>
      <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--text-secondary)' }}>How did today feel overall?</p>
      <div style={{ display: 'flex', gap: 10 }}>
        {OPTIONS.map(({ value, emoji, label }) => {
          const active = record.gutFeeling === value;
          return (
            <motion.button
              key={value}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate({ gutFeeling: active ? null : value })}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '10px 0',
                borderRadius: 14,
                border: active ? '2px solid var(--brand-leaf)' : '2px solid var(--border-color)',
                background: active ? 'rgba(82,183,136,0.12)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 26 }}>{emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: active ? 'var(--brand-forest)' : 'var(--text-secondary)' }}>{label}</span>
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
}

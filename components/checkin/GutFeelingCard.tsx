'use client'
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';
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

const spring = { type: 'spring' as const, stiffness: 420, damping: 20 };

export function GutFeelingCard({ record, onUpdate }: Props) {
  return (
    <Card accent="#52B788">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--tint-leaf)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <HeartPulse size={19} color="#52B788" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Nannayirunno? 🤔</h2>
          <p style={{ margin: '1px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>How did today feel overall?</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {OPTIONS.map(({ value, emoji, label }) => {
          const active = record.gutFeeling === value;
          return (
            <motion.button
              key={value}
              whileTap={{ scale: 0.9 }}
              animate={{ y: active ? -4 : 0, scale: active ? 1.03 : 1 }}
              transition={spring}
              onClick={() => onUpdate({ gutFeeling: active ? null : value })}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '12px 0',
                minHeight: 72,
                borderRadius: 14,
                border: active ? '2px solid var(--brand-leaf)' : '2px solid var(--border-color)',
                background: active ? 'var(--tint-leaf)' : 'transparent',
                boxShadow: active ? '0 6px 16px -6px rgba(82,183,136,0.45)' : 'none',
                cursor: 'pointer',
                transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
              }}
            >
              <motion.span
                animate={{ scale: active ? 1.3 : 1, y: active ? -2 : 0 }}
                transition={{ type: 'spring' as const, stiffness: 500, damping: 15 }}
                style={{ fontSize: 26, display: 'inline-block' }}
              >
                {emoji}
              </motion.span>
              <span style={{ fontSize: 11, fontWeight: 700, color: active ? 'var(--brand-forest)' : 'var(--text-secondary)' }}>{label}</span>
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
}

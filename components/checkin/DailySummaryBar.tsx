'use client'
import { motion } from 'framer-motion';
import { Flame, Snowflake } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useStreak } from '@/hooks/useStreak';

interface Props {
  viewingYesterday?: boolean;
}

export function DailySummaryBar({ viewingYesterday }: Props) {
  const { settings } = useSettings();
  const { currentStreak } = useStreak(settings ?? undefined);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      background: 'var(--bg-nav)',
      borderBottom: '1px solid color-mix(in srgb, var(--border-color) 55%, transparent)',
      backdropFilter: 'blur(22px) saturate(1.5)',
      WebkitBackdropFilter: 'blur(22px) saturate(1.5)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontFamily: 'var(--font-display-stack)',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: 'var(--brand-forest)',
        }}>
          Bite & Burn
        </span>
        {viewingYesterday && (
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-sky)', background: 'var(--tint-sky)', borderRadius: 20, padding: '2px 8px' }}>
            Yesterday
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {settings && settings.streakFreezeTokens > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#E0F0FF', borderRadius: 20, padding: '4px 10px' }}>
            <Snowflake size={14} color="#4A90D9" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#4A90D9' }}>×{settings.streakFreezeTokens}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: currentStreak > 0 ? 'var(--tint-amber)' : 'var(--bg-inset)', borderRadius: 20, padding: '4px 12px' }}>
          <motion.span
            animate={currentStreak > 0
              ? { rotate: [0, -10, 10, -6, 6, 0], scale: [1, 1.12, 1.06, 1.1, 1.04, 1] }
              : { rotate: 0, scale: 1 }}
            transition={currentStreak > 0
              ? { duration: 1.4, repeat: Infinity, repeatDelay: 2.8, ease: 'easeInOut' }
              : undefined}
            style={{ display: 'inline-flex' }}
          >
            <Flame size={16} color={currentStreak > 0 ? '#E09F3E' : 'var(--text-secondary)'} />
          </motion.span>
          <span style={{ fontSize: 14, fontWeight: 800, color: currentStreak > 0 ? '#E09F3E' : 'var(--text-secondary)' }}>
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>
    </div>
  );
}

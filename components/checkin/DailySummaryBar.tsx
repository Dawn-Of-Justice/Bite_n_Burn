'use client'
import { Flame, Snowflake } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useStreak } from '@/hooks/useStreak';

export function DailySummaryBar() {
  const { settings } = useSettings();
  const { currentStreak } = useStreak(settings ?? undefined);

  return (
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
      <div>
        <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand-forest)' }}>Bite & Burn</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {settings && settings.streakFreezeTokens > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#E0F0FF', borderRadius: 20, padding: '4px 10px' }}>
            <Snowflake size={14} color="#4A90D9" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#4A90D9' }}>×{settings.streakFreezeTokens}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: currentStreak > 0 ? 'rgba(224,159,62,0.15)' : 'var(--border-color)', borderRadius: 20, padding: '4px 12px' }}>
          <Flame size={16} color={currentStreak > 0 ? '#E09F3E' : 'var(--text-secondary)'} />
          <span style={{ fontSize: 14, fontWeight: 800, color: currentStreak > 0 ? '#E09F3E' : 'var(--text-secondary)' }}>
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>
    </div>
  );
}

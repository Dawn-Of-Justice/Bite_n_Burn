'use client'
import { useAllRecords } from '@/hooks/useAllRecords'

import { useSettings } from '@/hooks/useSettings';
import { useStreak } from '@/hooks/useStreak';
import { computeCalendarColor, COLOR_STYLES } from '@/lib/algorithms/calendarColor';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { getMotivationalMessage } from '@/lib/utils/motivational';
import { subDays, format } from 'date-fns';
import type { CalendarColor } from '@/lib/types/records';

export function StatsScreen() {
  const { settings } = useSettings();
  const records = useAllRecords()
  const { currentStreak, longestStreak } = useStreak(settings ?? undefined);

  if (!settings) return null;

  ;
  const recordMap = new Map(records.map(r => [r.dateKey, r]));

  // Last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const key = format(date, 'yyyy-MM-dd');
    const record = recordMap.get(key) ?? null;
    return {
      key,
      label: format(date, 'EEE'),
      color: computeCalendarColor(record, settings) as CalendarColor,
    };
  });

  // All-time stats
  const colorCounts: Record<CalendarColor, number> = { green: 0, blue: 0, amber: 0, red: 0, gray: 0 };
  for (const r of records) {
    colorCounts[computeCalendarColor(r, settings)]++;
  }
  const gymDays = records.filter(r => r.didGym === true).length;
  const waterGoalDays = records.filter(r => r.waterCount >= settings.waterGoalValue).length;
  const junkFreeDays = records.filter(r => r.ateJunk === false).length;

  // Today's color for motivational message
  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const todayRecord = recordMap.get(todayKey) ?? null;
  const todayColor = todayRecord ? computeCalendarColor(todayRecord, settings) : null;
  const message = getMotivationalMessage(todayColor);

  return (
    <div>
      <PageHeader title="Stats & Progress" subtitle="Ente journey kano?" />

      <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Motivational message */}
        <Card style={{ background: 'linear-gradient(135deg, var(--brand-forest), var(--brand-leaf))', border: 'none' }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.5 }}>
            {message}
          </p>
        </Card>

        {/* Streak stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Current Streak', value: currentStreak, suffix: 'days', color: '#E09F3E' },
            { label: 'Longest Streak', value: longestStreak, suffix: 'days', color: 'var(--brand-forest)' },
            { label: 'Gym Days', value: gymDays, suffix: 'total', color: 'var(--brand-leaf)' },
            { label: 'Water Goal Days', value: waterGoalDays, suffix: 'total', color: 'var(--brand-sky)' },
            { label: 'Junk-Free Days', value: junkFreeDays, suffix: 'total', color: '#52B788' },
            { label: 'Total Check-ins', value: records.length, suffix: 'days', color: 'var(--brand-amber)' },
          ].map(({ label, value, suffix, color }) => (
            <Card key={label} style={{ padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{suffix}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{label}</div>
            </Card>
          ))}
        </div>

        {/* Last 7 days */}
        <Card>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800 }}>Last 7 Days</h4>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 64 }}>
            {last7.map(({ key, label, color }) => {
              const style = COLOR_STYLES[color];
              return (
                <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', height: color === 'gray' ? 12 : color === 'red' ? 28 : color === 'amber' ? 36 : color === 'blue' ? 44 : 56, background: style.bg, borderRadius: '4px 4px 0 0', transition: 'height 0.4s ease' }} />
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Day breakdown */}
        <Card>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800 }}>All-Time Breakdown</h4>
          {(Object.entries(colorCounts) as [CalendarColor, number][]).map(([color, count]) => {
            const total = records.length || 1;
            return (
              <div key={color} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3 }}>
                  <span>{COLOR_STYLES[color].label}</span>
                  <span style={{ fontWeight: 700 }}>{count}</span>
                </div>
                <div style={{ height: 6, background: 'var(--border-color)', borderRadius: 4 }}>
                  <div style={{ height: '100%', width: `${(count / total) * 100}%`, background: COLOR_STYLES[color].bg, borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

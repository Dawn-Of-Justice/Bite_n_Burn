'use client'
import Link from 'next/link'
import { useAllRecords } from '@/hooks/useAllRecords'
import { useSettings } from '@/hooks/useSettings';
import { useStreak } from '@/hooks/useStreak';
import { computeCalendarColor, COLOR_STYLES } from '@/lib/algorithms/calendarColor';
import { hasMetWaterGoal } from '@/lib/utils/water';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { getMotivationalMessage } from '@/lib/utils/motivational';
import { subDays, format } from 'date-fns';
import type { CalendarColor, GutFeeling } from '@/lib/types/records';
import { StatsSkeleton } from '@/components/stats/StatsSkeleton';

const GUT_EMOJI: Record<GutFeeling, string> = { great: '😄', okay: '😐', rough: '😩' };

export function StatsScreen() {
  const { settings } = useSettings();
  const { records, isLoading: recordsLoading } = useAllRecords()
  const { currentStreak, longestStreak } = useStreak(settings ?? undefined);

  if (!settings) return <StatsSkeleton />;

  if (!recordsLoading && records.length === 0) {
    return (
      <div>
        <PageHeader title="Stats & Progress" subtitle="Ente journey kando?" />
        <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 56 }}>📊</div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>No data yet!</h2>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 220 }}>
            Check in today to start seeing your stats here.
          </p>
          <Link
            href="/"
            style={{
              marginTop: 8,
              background: 'var(--brand-leaf)',
              color: '#fff',
              textDecoration: 'none',
              padding: '10px 24px',
              borderRadius: 50,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Check in now →
          </Link>
        </div>
      </div>
    )
  }

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
      gutFeeling: record?.gutFeeling ?? null,
    };
  });

  // Weekly insight (last 7 days)
  const last7Records = last7.map(({ key }) => recordMap.get(key) ?? null);
  const weekGym = last7Records.filter(r => r?.didGym === true).length;
  const weekWater = last7Records.filter(r => r && hasMetWaterGoal(r.waterCount, settings)).length;
  const weekJunkFree = last7Records.filter(r => r?.ateJunk === false).length;

  // All-time stats
  const colorCounts: Record<CalendarColor, number> = { green: 0, blue: 0, amber: 0, red: 0, gray: 0 };
  for (const r of records) {
    colorCounts[computeCalendarColor(r, settings)]++;
  }
  const gymDays = records.filter(r => r.didGym === true).length;
  const waterGoalDays = records.filter(r => hasMetWaterGoal(r.waterCount, settings)).length;
  const junkFreeDays = records.filter(r => r.ateJunk === false).length;

  // Gut feeling breakdown
  const gutCounts = records.reduce(
    (acc, r) => { if (r.gutFeeling) acc[r.gutFeeling]++; return acc; },
    { great: 0, okay: 0, rough: 0 } as Record<GutFeeling, number>
  );

  // Today's color for motivational message
  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const todayRecord = recordMap.get(todayKey) ?? null;
  const todayColor = todayRecord ? computeCalendarColor(todayRecord, settings) : null;
  const message = getMotivationalMessage(todayColor);

  return (
    <div>
      <PageHeader title="Stats & Progress" subtitle="Ente journey kando?" />

      <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Motivational message */}
        <Card style={{ background: 'linear-gradient(135deg, var(--brand-forest), var(--brand-leaf))', border: 'none' }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.5 }}>
            {message}
          </p>
        </Card>

        {/* Weekly insight */}
        <Card>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800 }}>This Week</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Gym', value: weekGym, color: 'var(--brand-leaf)', emoji: '💪' },
              { label: 'Water Goal', value: weekWater, color: 'var(--brand-sky)', emoji: '💧' },
              { label: 'Junk-Free', value: weekJunkFree, color: 'var(--brand-amber)', emoji: '🥗' },
            ].map(({ label, value, color, emoji }) => (
              <div key={label} style={{ textAlign: 'center', padding: '10px 0', background: 'var(--bg-primary)', borderRadius: 12 }}>
                <div style={{ fontSize: 20 }}>{emoji}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}<span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>/7</span></div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
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

        {/* Last 7 days bar chart */}
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

        {/* Gut feeling */}
        <Card>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800 }}>How You've Been Feeling</h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
            {last7.map(({ key, label, gutFeeling }) => (
              <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 20 }}>{gutFeeling ? GUT_EMOJI[gutFeeling] : '·'}</span>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['great', 'okay', 'rough'] as GutFeeling[]).map(g => (
              <div key={g} style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: 'var(--bg-primary)', borderRadius: 10 }}>
                <div style={{ fontSize: 20 }}>{GUT_EMOJI[g]}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{gutCounts[g]}</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'capitalize' }}>{g}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* All-time breakdown */}
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

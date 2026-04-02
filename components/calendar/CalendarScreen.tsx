'use client'
import { useState } from 'react';
import { format, getDaysInMonth, startOfMonth, getDay, isToday as isTodayFn, parseISO, isFuture } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { CalendarDay } from '@/components/calendar/CalendarDay';
import { DayDetailModal } from '@/components/calendar/DayDetailModal';
import { useCalendarMonth } from '@/hooks/useCalendarMonth';
import { useSettings } from '@/hooks/useSettings';
import { computeCalendarColor, COLOR_STYLES } from '@/lib/algorithms/calendarColor';
import type { DailyRecord, CalendarColor } from '@/lib/types/records';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function CalendarScreen() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selected, setSelected] = useState<DailyRecord | null>(null);

  const { settings } = useSettings();
  const records = useCalendarMonth(year, month);
  const recordMap = new Map((records ?? []).map(r => [r.dateKey, r]));

  const daysInMonth = getDaysInMonth(new Date(year, month - 1));
  const startDay = getDay(startOfMonth(new Date(year, month - 1)));

  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  return (
    <div>
      <PageHeader title="Balance Calendar" subtitle="Ee maasam enthua nadanne?" />

      <div style={{ padding: '16px 16px 24px' }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={prevMonth} style={{ background: 'var(--border-color)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft size={18} color="var(--text-secondary)" />
          </button>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
            {format(new Date(year, month - 1), 'MMMM yyyy')}
          </h3>
          <button onClick={nextMonth} style={{ background: 'var(--border-color)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronRight size={18} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Weekday headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
          {WEEKDAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', padding: '4px 0' }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = recordMap.get(dateKey) ?? null;
            const color: CalendarColor | null = settings ? computeCalendarColor(record, settings) : null;
            const future = isFuture(parseISO(dateKey)) && dateKey !== format(today, 'yyyy-MM-dd');
            const todayFlag = isTodayFn(parseISO(dateKey));

            return (
              <CalendarDay
                key={dateKey}
                day={day}
                color={color}
                isToday={todayFlag}
                isFuture={future}
                onClick={record && !future ? () => setSelected(record) : undefined}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20, justifyContent: 'center' }}>
          {(Object.entries(COLOR_STYLES) as [CalendarColor, typeof COLOR_STYLES[CalendarColor]][]).map(([color, s]) => (
            <div key={color} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 12, borderRadius: 4, background: s.bg }} />
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {selected && settings && (
        <DayDetailModal record={selected} settings={settings} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

'use client'
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { format, getDaysInMonth, startOfMonth, getDay, isToday as isTodayFn, parseISO, isFuture } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { CalendarDay } from '@/components/calendar/CalendarDay';
import { DayDetailModal } from '@/components/calendar/DayDetailModal';
import { useCalendarMonth } from '@/hooks/useCalendarMonth';
import { useSettings } from '@/hooks/useSettings';
import { computeCalendarColor, COLOR_STYLES } from '@/lib/algorithms/calendarColor';
import type { DailyRecord, CalendarColor } from '@/lib/types/records';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const navButtonStyle: CSSProperties = {
  background: 'var(--tint-leaf)',
  border: '1px solid var(--border-color)',
  borderRadius: '50%',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
};

const monthLabelVariants = {
  enter: (dir: number) => ({ x: dir * 28, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -28, opacity: 0 }),
};

export function CalendarScreen() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selected, setSelected] = useState<DailyRecord | null>(null);
  const [direction, setDirection] = useState(0);

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
    setDirection(-1);
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    setDirection(1);
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  const monthKey = `${year}-${month}`;

  return (
    <div>
      <PageHeader title="Balance Calendar" subtitle="Ee maasam enthua nadanne?" />

      <div style={{ padding: '16px 12px 24px' }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
          <motion.button
            onClick={prevMonth}
            aria-label="Previous month"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring' as const, stiffness: 420, damping: 18 }}
            style={navButtonStyle}
          >
            <ChevronLeft size={18} color="var(--brand-forest)" />
          </motion.button>

          <div style={{ overflow: 'hidden', flex: 1, display: 'flex', justifyContent: 'center' }}>
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.h3
                key={monthKey}
                custom={direction}
                variants={monthLabelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{ margin: 0, fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}
              >
                {format(new Date(year, month - 1), 'MMMM yyyy')}
              </motion.h3>
            </AnimatePresence>
          </div>

          <motion.button
            onClick={nextMonth}
            aria-label="Next month"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring' as const, stiffness: 420, damping: 18 }}
            style={navButtonStyle}
          >
            <ChevronRight size={18} color="var(--brand-forest)" />
          </motion.button>
        </div>

        {/* Calendar widget */}
        <Card accent="var(--brand-leaf)" style={{ padding: '14px 12px 16px' }}>
          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
            {WEEKDAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)', padding: '4px 0', letterSpacing: 0.4, textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid — keyed by month so cells re-stagger on navigation */}
          <div key={monthKey} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const record = recordMap.get(dateKey) ?? null;
              const color: CalendarColor | null = settings ? computeCalendarColor(record, settings) : null;
              const future = isFuture(parseISO(dateKey)) && dateKey !== format(today, 'yyyy-MM-dd');
              const todayFlag = isTodayFn(parseISO(dateKey));

              const isPastEmpty = !record && !future && !todayFlag;

              return (
                <CalendarDay
                  key={dateKey}
                  day={day}
                  index={i}
                  color={color}
                  isToday={todayFlag}
                  isFuture={future}
                  isPastEmpty={isPastEmpty}
                  onClick={record && !future ? () => setSelected(record) : undefined}
                />
              );
            })}
          </div>
        </Card>

        {/* Legend — tinted pill chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18, justifyContent: 'center' }}>
          {(Object.entries(COLOR_STYLES) as [CalendarColor, typeof COLOR_STYLES[CalendarColor]][]).map(([color, s]) => (
            <div
              key={color}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 11px',
                borderRadius: 999,
                background: `color-mix(in srgb, ${s.bg} 13%, transparent)`,
                border: `1px solid color-mix(in srgb, ${s.bg} 28%, transparent)`,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.bg, boxShadow: `0 0 0 2px color-mix(in srgb, ${s.bg} 25%, transparent)` }} />
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>{s.label}</span>
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

'use client'
import { motion } from 'framer-motion';
import type { CalendarColor } from '@/lib/types/records';
import { COLOR_STYLES } from '@/lib/algorithms/calendarColor';

interface Props {
  day: number | null;
  color: CalendarColor | null;
  isToday: boolean;
  isFuture: boolean;
  onClick?: () => void;
}

export function CalendarDay({ day, color, isToday, isFuture, onClick }: Props) {
  if (!day) return <div />;

  const colorStyle = color ? COLOR_STYLES[color] : null;

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.88 } : {}}
      onClick={onClick}
      style={{
        aspectRatio: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        opacity: isFuture ? 0.3 : 1,
        border: isToday ? '2px solid var(--brand-forest)' : '2px solid transparent',
        background: colorStyle ? colorStyle.bg : 'transparent',
        transition: 'background 0.2s',
      }}
    >
      <span style={{
        fontSize: 13,
        fontWeight: isToday ? 800 : 500,
        color: colorStyle ? colorStyle.text : 'var(--text-primary)',
      }}>
        {day}
      </span>
    </motion.div>
  );
}

'use client'
import { motion } from 'framer-motion';
import type { CalendarColor } from '@/lib/types/records';
import { COLOR_STYLES } from '@/lib/algorithms/calendarColor';

interface Props {
  day: number | null;
  color: CalendarColor | null;
  isToday: boolean;
  isFuture: boolean;
  isPastEmpty?: boolean;
  onClick?: () => void;
  /** Position in the month grid — drives the stagger-pop entrance */
  index?: number;
}

export function CalendarDay({ day, color, isToday, isFuture, isPastEmpty, onClick, index = 0 }: Props) {
  if (!day) return <div />;

  const colorStyle = color ? COLOR_STYLES[color] : null;

  let border = '2px solid transparent';
  if (isToday) border = '2px solid var(--brand-forest)';
  else if (isPastEmpty) border = '2px dashed var(--border-color)';

  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: isFuture ? 0.3 : 1 }}
      transition={{ type: 'spring' as const, stiffness: 420, damping: 24, delay: index * 0.008 }}
      whileTap={onClick ? { scale: 0.88 } : {}}
      onClick={onClick}
      style={{
        aspectRatio: '1',
        minHeight: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: colorStyle ? 12 : 10,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        border,
        background: colorStyle ? colorStyle.bg : 'transparent',
        transition: 'background 0.2s',
        // Gentle pulsing ring on today (shared keyframe from design-system.css)
        animation: isToday ? 'bnb-pulse-ring 2.2s ease-out infinite' : undefined,
      }}
    >
      {/* Subtle inner highlight on recorded (colored) days */}
      {colorStyle && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.05) 55%, transparent)',
          }}
        />
      )}

      <span style={{
        position: 'relative',
        fontSize: 13,
        fontWeight: isToday ? 800 : colorStyle ? 700 : 500,
        color: colorStyle ? colorStyle.text : 'var(--text-primary)',
        textShadow: colorStyle ? '0 1px 2px rgba(0,0,0,0.12)' : undefined,
      }}>
        {day}
      </span>
    </motion.div>
  );
}

'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, UtensilsCrossed, Droplets } from 'lucide-react';
import type { DailyRecord } from '@/lib/types/records';
import type { UserSettings } from '@/lib/types/settings';
import { computeCalendarColor, COLOR_STYLES } from '@/lib/algorithms/calendarColor';
import { format, parseISO } from 'date-fns';

interface Props {
  record: DailyRecord | null;
  settings: UserSettings;
  onClose: () => void;
}

const rowSpring = { type: 'spring' as const, stiffness: 380, damping: 26 };

export function DayDetailModal({ record, settings, onClose }: Props) {
  if (!record) return null;
  const color = computeCalendarColor(record, settings);
  const style = COLOR_STYLES[color];

  const waterDisplay = settings.waterGoalUnit === 'liters'
    ? `${(record.waterCount * 0.25).toFixed(1)}L`
    : `${record.waterCount} glasses`;

  const rows = [
    { icon: <Dumbbell size={16} />, label: 'Gym (Poyo?)', value: record.isRestDay ? 'Rest Day 😴' : record.didGym === true ? 'Poyi! 💪' : record.didGym === false ? 'Poyilla 😅' : '—' },
    { icon: <UtensilsCrossed size={16} />, label: 'Junk Food (Kazhicho?)', value: record.ateJunk === true ? 'Kazhichu 😅' : record.ateJunk === false ? 'Illa! 💪' : '—' },
    { icon: <UtensilsCrossed size={16} />, label: 'Sugar Exceeded?', value: record.exceededSugar === true ? 'Kooduthal kazhichu 😬' : record.exceededSugar === false ? 'Control! 👍' : '—' },
    { icon: <Droplets size={16} />, label: 'Water (Vellam?)', value: record.waterCount > 0 ? waterDisplay : '0' },
  ];

  // Stagger counter shared across rows + optional sections
  let staggerIndex = 0;
  const staggered = () => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { ...rowSpring, delay: 0.08 + staggerIndex++ * 0.05 },
  });

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(20, 14, 8, 0.45)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring' as const, damping: 28, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--bg-primary)',
            borderRadius: '24px 24px 0 0',
            border: '1px solid var(--border-color)',
            borderBottom: 'none',
            boxShadow: 'var(--shadow-float)',
            padding: '10px 20px calc(28px + env(safe-area-inset-bottom))',
            width: '100%',
            maxWidth: 480,
            maxHeight: '85vh',
            overflowY: 'auto',
          }}
        >
          {/* Drag handle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{ width: 40, height: 4, borderRadius: 999, background: 'var(--border-color)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{format(parseISO(record.dateKey), 'MMMM d, yyyy')}</h3>
              <span style={{ display: 'inline-block', marginTop: 4, fontSize: 12, fontWeight: 700, color: style.text, background: style.bg, borderRadius: 20, padding: '2px 10px' }}>{style.label}</span>
            </div>
            <motion.button
              onClick={onClose}
              aria-label="Close"
              whileTap={{ scale: 0.88 }}
              style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-color)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
            >
              <X size={18} color="var(--text-secondary)" />
            </motion.button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rows.map(({ icon, label, value }) => (
              <motion.div
                key={label}
                {...staggered()}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                  {icon}
                  <span style={{ fontSize: 13 }}>{label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
              </motion.div>
            ))}

            {record.junkItemsEaten && record.junkItemsEaten.length > 0 && (
              <motion.div
                {...staggered()}
                style={{ padding: '11px 14px', background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}
              >
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>What was eaten:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {record.junkItemsEaten.map(item => (
                    <span key={item} style={{ background: 'var(--brand-amber)', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {record.gutFeeling && (
              <motion.div
                {...staggered()}
                style={{ textAlign: 'center', fontSize: 32, paddingTop: 8 }}
              >
                {record.gutFeeling === 'great' ? '😄' : record.gutFeeling === 'okay' ? '😐' : '😩'}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

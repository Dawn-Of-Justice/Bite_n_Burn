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

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          style={{ background: 'var(--bg-primary)', borderRadius: '24px 24px 0 0', padding: '24px 20px 32px', width: '100%', maxWidth: 480 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{format(parseISO(record.dateKey), 'MMMM d, yyyy')}</h3>
              <span style={{ fontSize: 12, fontWeight: 700, color: style.text, background: style.bg, borderRadius: 20, padding: '2px 10px' }}>{style.label}</span>
            </div>
            <button onClick={onClose} style={{ background: 'var(--border-color)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={18} color="var(--text-secondary)" />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rows.map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                  {icon}
                  <span style={{ fontSize: 13 }}>{label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}

            {record.junkItemsEaten && record.junkItemsEaten.length > 0 && (
              <div style={{ padding: '10px 14px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>What was eaten:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {record.junkItemsEaten.map(item => (
                    <span key={item} style={{ background: 'var(--brand-amber)', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {record.gutFeeling && (
              <div style={{ textAlign: 'center', fontSize: 32, paddingTop: 8 }}>
                {record.gutFeeling === 'great' ? '😄' : record.gutFeeling === 'okay' ? '😐' : '😩'}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

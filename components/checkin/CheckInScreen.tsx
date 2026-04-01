'use client'
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { DailySummaryBar } from '@/components/checkin/DailySummaryBar';
import { KazhichoCard } from '@/components/checkin/KazhichoCard';
import { PoyoCard } from '@/components/checkin/PoyoCard';
import { HydrationCard } from '@/components/checkin/HydrationCard';
import { GutFeelingCard } from '@/components/checkin/GutFeelingCard';
import { useTodayRecord } from '@/hooks/useTodayRecord';
import { useSettings } from '@/hooks/useSettings';
import { defaultDailyRecord } from '@/lib/types/records';
import { todayKey } from '@/lib/utils/date';

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const cardAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 24 } },
};

export function CheckInScreen() {
  const { record, update } = useTodayRecord();
  const { settings } = useSettings();
  const r = record ?? defaultDailyRecord(todayKey());

  const today = new Date();
  const dayStr = format(today, 'EEEE, MMM d');

  if (!settings) return null;

  return (
    <div>
      <DailySummaryBar />
      <div style={{ padding: '16px 16px 24px' }}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{dayStr}</p>
          <h2 style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
            {record?.completedAt ? 'Check-in done! 🎉' : 'Enthayee aaj? ✏️'}
          </h2>
        </div>

        <motion.div variants={stagger} initial="initial" animate="animate" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <motion.div variants={cardAnim}>
            <PoyoCard record={r} onUpdate={update} />
          </motion.div>
          <motion.div variants={cardAnim}>
            <KazhichoCard record={r} settings={settings} onUpdate={update} />
          </motion.div>
          <motion.div variants={cardAnim}>
            <HydrationCard record={r} settings={settings} onUpdate={update} />
          </motion.div>
          <motion.div variants={cardAnim}>
            <GutFeelingCard record={r} onUpdate={update} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

'use client'
import { useState, useEffect, useRef } from 'react';
import { format, subDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Snowflake, Check } from 'lucide-react';
import { DailySummaryBar } from '@/components/checkin/DailySummaryBar';
import { KazhichoCard } from '@/components/checkin/KazhichoCard';
import { PoyoCard } from '@/components/checkin/PoyoCard';
import { HydrationCard } from '@/components/checkin/HydrationCard';
import { GutFeelingCard } from '@/components/checkin/GutFeelingCard';
import { useDayRecord } from '@/hooks/useDayRecord';
import { useSettings } from '@/hooks/useSettings';
import { defaultDailyRecord, type DailyRecord } from '@/lib/types/records';
import { todayKey, yesterdayKey } from '@/lib/utils/date';
import { CheckInSkeleton } from '@/components/checkin/CheckInSkeleton';

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const cardAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 24 } },
};

export function CheckInScreen() {
  const [activeDay, setActiveDay] = useState<'today' | 'yesterday'>('today');
  const { settings, update: updateSettings } = useSettings();

  const tKey = todayKey();
  const yKey = yesterdayKey();

  const { record: todayRecord, update: todayUpdate } = useDayRecord(tKey);
  const { record: yesterdayRecord, update: yesterdayUpdate, isLoading: isYesterdayLoading } = useDayRecord(yKey);

  const isYesterdayMissed = !isYesterdayLoading && !yesterdayRecord?.completedAt;
  const canUseFreeze = !isYesterdayLoading && yesterdayRecord === null && (settings?.streakFreezeTokens ?? 0) > 0;

  useEffect(() => {
    if (activeDay === 'yesterday' && yesterdayRecord?.completedAt) {
      setActiveDay('today');
    }
  }, [yesterdayRecord?.completedAt, activeDay]);

  const useFreeze = async () => {
    if (!settings) return;
    await yesterdayUpdate({ isRestDay: true });
    await updateSettings({ streakFreezeTokens: settings.streakFreezeTokens - 1 });
  };

  const activeKey = activeDay === 'today' ? tKey : yKey;
  const record = activeDay === 'today' ? todayRecord : yesterdayRecord;
  const update = activeDay === 'today' ? todayUpdate : yesterdayUpdate;
  const r = record ?? defaultDailyRecord(activeKey);

  // Saved toast
  const [showSaved, setShowSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const onUpdate = async (partial: Partial<DailyRecord>) => {
    await update(partial);
    setShowSaved(true);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setShowSaved(false), 1500);
  };

  const displayDate = activeDay === 'today' ? new Date() : subDays(new Date(), 1);
  const dayStr = format(displayDate, 'EEEE, MMM d');

  if (!settings) return <CheckInSkeleton />;

  return (
    <div>
      <DailySummaryBar viewingYesterday={activeDay === 'yesterday'} />
      <div style={{ padding: '16px 16px 24px' }}>

        {/* Yesterday tab toggle */}
        {isYesterdayMissed && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => setActiveDay('today')}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 20,
                border: 'none',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                background: activeDay === 'today' ? 'var(--brand-leaf)' : 'var(--border-color)',
                color: activeDay === 'today' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              Today
            </button>
            <button
              onClick={() => setActiveDay('yesterday')}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 20,
                border: 'none',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                background: activeDay === 'yesterday' ? 'var(--brand-sky)' : 'var(--border-color)',
                color: activeDay === 'yesterday' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              Yesterday
            </button>
          </div>
        )}

        {/* Streak freeze banner */}
        {canUseFreeze && activeDay === 'today' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              marginBottom: 16,
              background: 'rgba(74,144,217,0.1)',
              border: '1.5px solid rgba(74,144,217,0.3)',
              borderRadius: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Snowflake size={18} color="#4A90D9" />
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Yesterday was missed</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>Use a freeze to protect your streak ({settings.streakFreezeTokens} left)</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={useFreeze}
              style={{
                background: '#4A90D9',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Use ❄️
            </motion.button>
          </motion.div>
        )}

        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{dayStr}</p>
          <h2 style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
            {record?.completedAt ? 'Check-in done! 🎉' : 'Enthayee innu? ✏️'}
          </h2>
        </div>

        <motion.div variants={stagger} initial="initial" animate="animate" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <motion.div variants={cardAnim}>
            <PoyoCard record={r} onUpdate={onUpdate} />
          </motion.div>
          <motion.div variants={cardAnim}>
            <KazhichoCard record={r} settings={settings} onUpdate={onUpdate} />
          </motion.div>
          <motion.div variants={cardAnim}>
            <HydrationCard record={r} settings={settings} onUpdate={onUpdate} />
          </motion.div>
          <motion.div variants={cardAnim}>
            <GutFeelingCard record={r} onUpdate={onUpdate} />
          </motion.div>
        </motion.div>

        {/* Saved toast */}
        <AnimatePresence>
          {showSaved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                position: 'fixed',
                bottom: 88,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--brand-forest)',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: 50,
                fontSize: 13,
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(45,106,79,0.25)',
                pointerEvents: 'none',
              }}
            >
              <Check size={14} /> Saved
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

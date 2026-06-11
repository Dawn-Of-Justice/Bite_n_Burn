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

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const cardAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 24 } },
};

// One segment per check-in card, in card order: Poyo, Kazhicho, Vellam, Gut
const SEGMENT_COLORS = ['#2D6A4F', '#E09F3E', '#48CAE4', '#52B788'];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Suprabhatham! ☀️';
  if (hour < 17) return 'Good afternoon, alle! 🌤️';
  return 'Sandhya aayi! 🌙';
}

// Confetti burst — pure framer-motion, brand colors
interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rot: number;
  size: number;
  color: string;
  round: boolean;
  delay: number;
}
const CONFETTI_COLORS = ['#2D6A4F', '#52B788', '#E09F3E', '#48CAE4', '#B7E4C7', '#C1121F'];
function makeBurst(): ConfettiPiece[] {
  return Array.from({ length: 22 }, (_, i) => {
    const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.35;
    const dist = 90 + Math.random() * 110;
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 40,
      rot: Math.random() * 360 - 180,
      size: 6 + Math.random() * 7,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      round: i % 2 === 0,
      delay: Math.random() * 0.12,
    };
  });
}

export function CheckInScreen() {
  const [activeDay, setActiveDay] = useState<'today' | 'yesterday'>('today');
  const { settings, update: updateSettings } = useSettings();

  const tKey = todayKey();
  const yKey = yesterdayKey();

  const { record: todayRecord, update: todayUpdate, isLoading: isTodayLoading } = useDayRecord(tKey);
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
  const isActiveLoading = activeDay === 'today' ? isTodayLoading : isYesterdayLoading;
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

  // ---- Daily completion meter (derived locally, view-only) ----
  const doneFlags = [
    r.didGym != null || r.isRestDay === true, // Poyo
    r.ateJunk != null,                        // Kazhicho
    (r.waterCount ?? 0) > 0,                  // Vellam
    r.gutFeeling != null,                     // Gut
  ];
  const doneCount = doneFlags.filter(Boolean).length;

  // ---- One-time celebration when completion hits 4/4 this session ----
  const [confetti, setConfetti] = useState<ConfettiPiece[] | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const prevDoneRef = useRef<{ day: string; count: number } | null>(null);
  const celebrationTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (isActiveLoading) {
      prevDoneRef.current = null; // don't compare across loading boundaries
      return;
    }
    const prev = prevDoneRef.current;
    if (prev && prev.day === activeDay && prev.count < 4 && doneCount === 4) {
      setConfetti(makeBurst());
      setShowCelebration(true);
      celebrationTimers.current.forEach(clearTimeout);
      celebrationTimers.current = [
        setTimeout(() => setConfetti(null), 1400),
        setTimeout(() => setShowCelebration(false), 4200),
      ];
    }
    prevDoneRef.current = { day: activeDay, count: doneCount };
  }, [doneCount, activeDay, isActiveLoading]);

  useEffect(() => () => celebrationTimers.current.forEach(clearTimeout), []);

  const displayDate = activeDay === 'today' ? new Date() : subDays(new Date(), 1);
  const dayStr = format(displayDate, 'EEEE, MMM d');

  if (!settings) return null;

  return (
    <div>
      <DailySummaryBar viewingYesterday={activeDay === 'yesterday'} />
      <div style={{ padding: '16px 16px 24px' }}>

        {/* Today / Yesterday segmented control */}
        {isYesterdayMissed && (
          <div style={{
            display: 'flex',
            marginBottom: 16,
            padding: 4,
            borderRadius: 26,
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}>
            {(['today', 'yesterday'] as const).map(day => {
              const active = activeDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  style={{
                    position: 'relative',
                    flex: 1,
                    minHeight: 40,
                    border: 'none',
                    background: 'transparent',
                    borderRadius: 22,
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 13,
                    color: active ? '#fff' : 'var(--text-secondary)',
                    transition: 'color 0.2s',
                    zIndex: 0,
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="bnb-day-pill"
                      transition={{ type: 'spring' as const, stiffness: 420, damping: 32 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 22,
                        background: day === 'today' ? 'var(--brand-leaf)' : 'var(--brand-sky)',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.14)',
                        zIndex: -1,
                      }}
                    />
                  )}
                  <span style={{ position: 'relative' }}>{day === 'today' ? 'Today' : 'Yesterday'}</span>
                </button>
              );
            })}
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

        {/* Greeting header + completion meter */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--brand-forest)', fontWeight: 800, letterSpacing: '0.01em' }}>
            {getGreeting()}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{dayStr}</p>
          <h2 style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.15 }}>
            {record?.completedAt ? 'Check-in done! 🎉' : 'Enthayee innu? ✏️'}
          </h2>

          {/* 4-segment daily completion meter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 5, flex: 1 }}>
              {doneFlags.map((done, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 7,
                    borderRadius: 4,
                    background: 'var(--bg-inset)',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={false}
                    animate={{ scaleX: done ? 1 : 0 }}
                    transition={{ type: 'spring' as const, stiffness: 260, damping: 26 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 4,
                      background: SEGMENT_COLORS[i],
                      transformOrigin: 'left',
                    }}
                  />
                </div>
              ))}
            </div>
            <span style={{
              fontSize: 12,
              fontWeight: 800,
              whiteSpace: 'nowrap',
              color: doneCount === 4 ? 'var(--brand-leaf)' : 'var(--text-secondary)',
            }}>
              {doneCount}/4{doneCount === 4 ? ' ✓' : ''}
            </span>
          </div>
        </div>

        {/* Perfect check-in banner */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 340, damping: 22 } }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
              style={{
                marginBottom: 14,
                padding: '13px 16px',
                borderRadius: 16,
                textAlign: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 14,
                background: 'linear-gradient(110deg, #2D6A4F, #52B788, #E09F3E, #52B788, #2D6A4F)',
                backgroundSize: '200% 100%',
                animation: 'bnb-shimmer 3s linear infinite',
                boxShadow: 'var(--shadow-float)',
              }}
            >
              Adipoli! Perfect check-in 🎉 Nale kaanam!
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Confetti burst overlay */}
        <AnimatePresence>
          {confetti && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 60, pointerEvents: 'none', overflow: 'hidden' }}>
              {confetti.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                  animate={{ x: p.x, y: p.y, scale: 1, opacity: 0, rotate: p.rot }}
                  transition={{ duration: 1.05, ease: 'easeOut', delay: p.delay }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '38%',
                    width: p.size,
                    height: p.round ? p.size : p.size * 1.6,
                    borderRadius: p.round ? '50%' : 3,
                    background: p.color,
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Saved toast */}
        <AnimatePresence>
          {showSaved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                position: 'fixed',
                bottom: 'calc(96px + env(safe-area-inset-bottom))',
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

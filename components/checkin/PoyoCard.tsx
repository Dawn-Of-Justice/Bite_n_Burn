'use client'
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dumbbell, BedDouble } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { ToggleButton } from '@/components/common/ToggleButton';
import type { DailyRecord } from '@/lib/types/records';

interface Props {
  record: Partial<DailyRecord>;
  onUpdate: (partial: Partial<DailyRecord>) => void;
}

export function PoyoCard({ record, onUpdate }: Props) {
  const [showRestConfirm, setShowRestConfirm] = useState(false);

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <Dumbbell size={20} color="var(--brand-forest)" />
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Poyo? 🏋️</h2>
      </div>
      <p style={{ margin: '2px 0 10px', fontSize: 12, color: 'var(--text-secondary)' }}>Did you hit the gym / exercise today?</p>

      {record.isRestDay ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ background: 'rgba(74,55,40,0.08)', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BedDouble size={18} color="var(--text-secondary)" />
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: 14 }}>Rest Day — streak safe! 😴</span>
          </div>
          <button
            onClick={() => onUpdate({ isRestDay: false, didGym: null })}
            style={{ background: 'none', border: 'none', color: 'var(--brand-ember)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
          >
            Undo
          </button>
        </motion.div>
      ) : (
        <>
          <ToggleButton
            value={record.didGym ?? null}
            onChange={(val) => onUpdate({ didGym: val })}
            labelYes="Poyi! 💪"
            labelNo="Poyilla 😅"
          />
          <AnimatePresence>
            {!showRestConfirm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 10, textAlign: 'center' }}>
                <button
                  onClick={() => setShowRestConfirm(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Mark as Rest Day
                </button>
              </motion.div>
            )}
            {showRestConfirm && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ marginTop: 10, background: 'rgba(74,144,217,0.1)', borderRadius: 12, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Rest day? Streak protected! 🛌</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => { onUpdate({ isRestDay: true, didGym: null }); setShowRestConfirm(false); }}
                    style={{ background: 'var(--brand-sky)', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Athe
                  </button>
                  <button
                    onClick={() => setShowRestConfirm(false)}
                    style={{ background: 'var(--border-color)', color: 'var(--text-secondary)', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}
                  >
                    Illa
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </Card>
  );
}

'use client'
import { AnimatePresence, motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { ToggleButton } from '@/components/common/ToggleButton';
import type { DailyRecord } from '@/lib/types/records';
import type { UserSettings } from '@/lib/types/settings';

interface Props {
  record: Partial<DailyRecord>;
  settings: UserSettings;
  onUpdate: (partial: Partial<DailyRecord>) => void;
}

export function KazhichoCard({ record, settings, onUpdate }: Props) {
  const eaten = record.junkItemsEaten ?? [];

  const toggleItem = (item: string) => {
    const next = eaten.includes(item)
      ? eaten.filter(i => i !== item)
      : [...eaten, item];
    onUpdate({ junkItemsEaten: next });
  };

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <UtensilsCrossed size={20} color="var(--brand-amber)" />
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Kazhicho? 🍟</h2>
      </div>
      <p style={{ margin: '2px 0 10px', fontSize: 12, color: 'var(--text-secondary)' }}>Did you eat junk food today?</p>

      <ToggleButton
        value={record.ateJunk ?? null}
        onChange={(val) => onUpdate({ ateJunk: val })}
        labelYes="Kazhichu 😅"
        labelNo="Illa! 💪"
      />

      <AnimatePresence>
        {record.ateJunk === true && settings.customJunkItems.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ margin: '12px 0 6px', fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>
              Enthanu kazhichu? Tap to mark:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {settings.customJunkItems.map(item => {
                const selected = eaten.includes(item);
                return (
                  <motion.button
                    key={item}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleItem(item)}
                    style={{
                      background: selected ? 'var(--brand-amber)' : 'rgba(224,159,62,0.12)',
                      color: selected ? '#fff' : 'var(--brand-amber)',
                      border: `1.5px solid ${selected ? 'var(--brand-amber)' : 'rgba(224,159,62,0.3)'}`,
                      borderRadius: 20,
                      padding: '4px 12px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {item}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: 14 }}>
        <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--text-secondary)' }}>
          Exceeded sugar? <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>({settings.sugarLimitDescriptor})</span>
        </p>
        <ToggleButton
          value={record.exceededSugar ?? null}
          onChange={(val) => onUpdate({ exceededSugar: val })}
          labelYes="Kooduthal kazhichu 😬"
          labelNo="Control! 👍"
        />
      </div>
    </Card>
  );
}

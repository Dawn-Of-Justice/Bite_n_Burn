'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const DISMISSED_KEY = 'reminder_prompt_dismissed'

interface Props {
  onDone: () => void;
}

export function ReminderPromptModal({ onDone }: Props) {
  const { update } = useSettings();
  const [number, setNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    onDone();
  };

  const handleSave = async () => {
    const digits = number.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Enter a valid number with country code, e.g. 919876543210');
      return;
    }
    setSaving(true);
    await update({ fcmToken: digits, eveningReminderEnabled: true });
    onDone();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="reminder-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          style={{ background: 'var(--bg-primary)', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: 480 }}
        >
          {/* Dismiss button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
            <button
              onClick={dismiss}
              style={{ background: 'var(--border-color)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={16} color="var(--text-secondary)" />
            </button>
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ background: 'rgba(82,183,136,0.15)', borderRadius: 12, padding: '10px 12px', display: 'flex' }}>
              <Bell size={24} color="var(--brand-leaf)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>Never forget to log 🔔</h3>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Get a WhatsApp nudge if you forget</p>
            </div>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '12px 0 20px', lineHeight: 1.6 }}>
            We'll message you at <strong style={{ color: 'var(--text-primary)' }}>9 PM</strong> if you haven't logged your check-in. You can change the time anytime in Settings.
          </p>

          {/* Input */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              WhatsApp Number
            </label>
            <input
              type="tel"
              value={number}
              onChange={e => { setNumber(e.target.value); setError(''); }}
              placeholder="919876543210"
              style={{
                width: '100%',
                background: 'var(--border-color)',
                border: error ? '1.5px solid var(--brand-ember)' : '1.5px solid transparent',
                borderRadius: 12,
                padding: '12px 14px',
                fontSize: 16,
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {error
              ? <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--brand-ember)' }}>{error}</p>
              : <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>Country code + number, no + or spaces</p>
            }
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving}
              style={{ width: '100%', padding: '14px', borderRadius: 16, border: 'none', background: 'var(--brand-forest)', color: '#fff', fontSize: 15, fontWeight: 800, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Saving...' : 'Turn on reminders 💬'}
            </motion.button>
            <button
              onClick={dismiss}
              style={{ width: '100%', padding: '12px', borderRadius: 16, border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Maybe later
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

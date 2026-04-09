'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const WHATS_NEW_KEY = 'whats_new_seen_v1'

const UPDATES = [
  { emoji: '💾', title: 'Save button', desc: 'Changes now buffer locally — tap Save when you\'re done. Update your water count midday, save it, come back later.' },
  { emoji: '📅', title: 'Calendar updates instantly', desc: 'Yesterday\'s check-in now shows in the calendar the moment you save it.' },
  { emoji: '💬', title: 'WhatsApp reminders', desc: 'Get a WhatsApp nudge if you forget to log. Set it up in Settings → Reminders.' },
]

export function WhatsNewModal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(WHATS_NEW_KEY)) {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(WHATS_NEW_KEY, '1')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="whats-new-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismiss}
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
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ background: 'rgba(82,183,136,0.15)', borderRadius: 12, padding: '8px 10px', display: 'flex' }}>
                <Sparkles size={22} color="var(--brand-leaf)" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>What's new 🎉</h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Here's what we've been building</p>
              </div>
            </div>

            {/* Update items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {UPDATES.map(({ emoji, title, desc }) => (
                <div
                  key={title}
                  style={{ display: 'flex', gap: 14, padding: '12px 14px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)' }}
                >
                  <span style={{ fontSize: 26, lineHeight: 1 }}>{emoji}</span>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={dismiss}
              style={{ width: '100%', padding: '14px', borderRadius: 16, border: 'none', background: 'var(--brand-forest)', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}
            >
              Let's check it out! 🌱
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

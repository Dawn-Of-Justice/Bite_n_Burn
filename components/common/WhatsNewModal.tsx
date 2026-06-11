'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const WHATS_NEW_KEY = 'whats_new_seen_v3'

const UPDATES = [
  { emoji: '🌿', title: 'A whole new look', desc: 'Fresh fonts, a warm garden glow behind every screen, glassier cards, and a polished dark mode. Same app, adipoli new vibe.' },
  { emoji: '🎉', title: 'Perfect check-in celebrations', desc: 'A new progress meter tracks your 4 daily check-ins — finish all of them and get a confetti party. Nale kaanam!' },
  { emoji: '⚡', title: 'Feels instant now', desc: 'Skeleton screens replace the blank loading state — the app shows a preview of the layout immediately while data loads.' },
  { emoji: '🧭', title: 'Floating navigation', desc: 'The nav is now a floating glass pill with a smooth indicator that glides between tabs.' },
  { emoji: '📊', title: 'Stats that move', desc: 'Numbers count up, charts grow in, badges glow when earned, and your plant now floats on a glowing mound.' },
  { emoji: '📆', title: 'Smoother calendar', desc: 'Slick month transitions, a pulsing ring on today, and day details in a proper bottom sheet.' },
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
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>What's new in v3 🎉</h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>The big glow-up update</p>
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

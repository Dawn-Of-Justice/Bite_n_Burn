'use client'
// [WHATSAPP] import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { SignIn } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { useSettings } from '@/hooks/useSettings'
import { BottomNav } from '@/components/common/BottomNav'
import { OnboardingScreen } from '@/components/settings/OnboardingScreen'
import { ThemeProvider } from '@/components/common/ThemeProvider'
import { WhatsNewModal } from '@/components/common/WhatsNewModal'
// [WHATSAPP] import { ReminderPromptModal } from '@/components/common/ReminderPromptModal'
import type { ReactNode } from 'react'

// [WHATSAPP] const REMINDER_DISMISSED_KEY = 'reminder_prompt_dismissed'

export function AppShell({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  const { settings, isLoading } = useSettings()
  // [WHATSAPP] const [showReminderPrompt, setShowReminderPrompt] = useState(false)

  // [WHATSAPP] useEffect(() => {
  //   if (settings && !settings.whatsappNumber && !localStorage.getItem(REMINDER_DISMISSED_KEY)) {
  //     const t = setTimeout(() => setShowReminderPrompt(true), 800)
  //     return () => clearTimeout(t)
  //   }
  // }, [settings])

  if (!isLoaded || (isSignedIn && isLoading)) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
        <div style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: 'var(--tint-leaf)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ fontSize: 48, lineHeight: 1, animation: 'bnb-float 3s ease-in-out infinite' }}>🌱</div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontStyle: 'italic', margin: 0 }}>Oru nimisham...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16, padding: 24 }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ fontSize: 64, lineHeight: 1, animation: 'bnb-float 3.5s ease-in-out infinite' }}>🌱</div>
          <h1 style={{
            fontSize: 42,
            fontWeight: 700,
            margin: '14px 0 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            backgroundImage: 'linear-gradient(135deg, var(--brand-leaf), var(--brand-forest))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'var(--brand-forest)',
          }}>
            Bite &amp; Burn
          </h1>
          <motion.p
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, type: 'spring' as const, stiffness: 300, damping: 22 }}
            style={{
              margin: '14px 0 0',
              padding: '7px 16px',
              borderRadius: 999,
              background: 'var(--tint-leaf)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Kazhicho? Poyo? Track it.
          </motion.p>
        </motion.div>
        <SignIn routing="hash" />
      </div>
    )
  }

  if (settings && !settings.onboardingCompleted) {
    return <OnboardingScreen />
  }

  return (
    <ThemeProvider theme={settings?.theme ?? 'system'}>
      <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative', minHeight: '100vh', paddingBottom: 96 }}>
        {children}
        <BottomNav />
        <WhatsNewModal />
        {/* [WHATSAPP] {showReminderPrompt && <ReminderPromptModal onDone={() => setShowReminderPrompt(false)} />} */}
      </div>
    </ThemeProvider>
  )
}

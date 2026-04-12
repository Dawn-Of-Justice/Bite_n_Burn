'use client'
// [WHATSAPP] import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { SignIn } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useSettings } from '@/hooks/useSettings'
import { BottomNav } from '@/components/common/BottomNav'
import { OnboardingScreen } from '@/components/settings/OnboardingScreen'
import { ThemeProvider } from '@/components/common/ThemeProvider'
import { WhatsNewModal } from '@/components/common/WhatsNewModal'
import { AppShellSkeleton } from '@/components/common/AppShellSkeleton'
// [WHATSAPP] import { ReminderPromptModal } from '@/components/common/ReminderPromptModal'
import type { ReactNode } from 'react'

// [WHATSAPP] const REMINDER_DISMISSED_KEY = 'reminder_prompt_dismissed'

export function AppShell({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  const { settings, isLoading } = useSettings()
  const pathname = usePathname()
  // [WHATSAPP] const [showReminderPrompt, setShowReminderPrompt] = useState(false)

  // [WHATSAPP] useEffect(() => {
  //   if (settings && !settings.whatsappNumber && !localStorage.getItem(REMINDER_DISMISSED_KEY)) {
  //     const t = setTimeout(() => setShowReminderPrompt(true), 800)
  //     return () => clearTimeout(t)
  //   }
  // }, [settings])

  if (!isLoaded || (isSignedIn && isLoading)) {
    return <AppShellSkeleton />
  }

  if (!isSignedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16, padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 56 }}>🌱</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--brand-forest)', margin: '8px 0 4px' }}>Bite & Burn</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Kazhicho? Poyo? Track it.</p>
        </div>
        <SignIn routing="hash" />
      </div>
    )
  }

  if (settings && !settings.onboardingCompleted) {
    return <OnboardingScreen />
  }

  return (
    <ThemeProvider theme={settings?.theme ?? 'system'}>
      <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative', minHeight: '100vh', paddingBottom: 72 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <BottomNav />
        <WhatsNewModal />
        {/* [WHATSAPP] {showReminderPrompt && <ReminderPromptModal onDone={() => setShowReminderPrompt(false)} />} */}
      </div>
    </ThemeProvider>
  )
}

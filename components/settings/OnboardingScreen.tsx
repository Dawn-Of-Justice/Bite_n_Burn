'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';
import { useUser } from '@clerk/nextjs'

export function OnboardingScreen() {
  const { settings, update } = useSettings();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(settings?.name || user?.firstName || '');
  const [waterGoal, setWaterGoal] = useState(settings?.waterGoalValue ?? 8);
  const [waterUnit, setWaterUnit] = useState<'glasses' | 'liters'>(settings?.waterGoalUnit ?? 'glasses');
  const [junkInput, setJunkInput] = useState('Chips, Samosa, Pepsi, Mithai, Ice Cream');

  const steps = [
    {
      title: "Namaskaram! 🙏",
      subtitle: "Let's set up your Bite & Burn",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>What should we call you?</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ninte peru?"
            autoFocus
            style={{ background: 'var(--border-color)', border: 'none', borderRadius: 12, padding: '14px 16px', fontSize: 16, color: 'var(--text-primary)', width: '100%' }}
          />
        </div>
      ),
    },
    {
      title: "Vellam! 💧",
      subtitle: "Set your daily water goal",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {(['glasses', 'liters'] as const).map(u => (
              <button key={u} onClick={() => setWaterUnit(u)} style={{ flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: waterUnit === u ? 'var(--brand-sky)' : 'var(--border-color)', color: waterUnit === u ? '#fff' : 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                {u === 'glasses' ? '🥛 Glasses' : '🚰 Liters'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <button onClick={() => setWaterGoal(Math.max(1, waterGoal - 1))} style={{ background: 'var(--border-color)', border: 'none', borderRadius: '50%', width: 48, height: 48, fontSize: 24, cursor: 'pointer', color: 'var(--text-secondary)' }}>-</button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--brand-sky)' }}>{waterGoal}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{waterUnit} per day</div>
            </div>
            <button onClick={() => setWaterGoal(waterGoal + 1)} style={{ background: 'var(--brand-sky)', border: 'none', borderRadius: '50%', width: 48, height: 48, fontSize: 24, cursor: 'pointer', color: '#fff' }}>+</button>
          </div>
        </div>
      ),
    },
    {
      title: "Kazhicho? 🍟",
      subtitle: "Define your junk food list",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>Add comma-separated items. What's your "junk"?</p>
          <textarea
            value={junkInput}
            onChange={e => setJunkInput(e.target.value)}
            rows={3}
            style={{ background: 'var(--border-color)', border: 'none', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: 'var(--text-primary)', resize: 'none', fontFamily: 'inherit' }}
          />
          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            Tip: Separate with commas. You can edit this later in Settings.
          </p>
        </div>
      ),
    },
    {
      title: "Ready aa! 🌱",
      subtitle: "Your plant is waiting to grow!",
      content: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 16 }}>🌱</div>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Check in every day for less than 10 seconds.<br />
            <strong>Kazhicho? Poyo? Vellam?</strong><br /><br />
            Your plant grows with your consistency.<br />
            Kollam aavum! 💪
          </p>
        </div>
      ),
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleNext = async () => {
    if (isLast) {
      const junkItems = junkInput.split(',').map(s => s.trim()).filter(Boolean);
      await update({
        name: name.trim() || 'Friend',
        waterGoalValue: waterGoal,
        waterGoalUnit: waterUnit,
        customJunkItems: junkItems,
        onboardingCompleted: true,
      });
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, maxWidth: 480, margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          style={{ width: '100%' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--brand-forest)', margin: '0 0 6px' }}>{current.title}</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>{current.subtitle}</p>
          </div>
          {current.content}
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: 40, width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={handleNext}
          style={{ background: 'var(--brand-forest)', color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, fontWeight: 800, cursor: 'pointer', width: '100%' }}
        >
          {isLast ? 'Start! Poyi! 🚀' : 'Next →'}
        </button>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i === step ? 'var(--brand-forest)' : 'var(--border-color)', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Droplets } from 'lucide-react';

interface Props {
  value: number;
  goal: number;
  unit: 'glasses' | 'liters';
  onChange: (val: number) => void;
}

export function TapCounter({ value, goal, unit, onChange }: Props) {
  const progress = Math.min(value / goal, 1);
  const size = 96;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;
  const label = unit === 'liters' ? `${(value * 0.25).toFixed(1)}L` : `${value}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center', paddingTop: 4 }}>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onChange(Math.max(0, value - 1))}
        style={{ background: 'var(--border-color)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
      >
        <Minus size={20} />
      </motion.button>

      <div style={{ position: 'relative', width: size, height: size }} onClick={() => onChange(value + 1)}>
        {/* Background ring */}
        <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border-color)" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={progress >= 1 ? 'var(--brand-leaf)' : 'var(--brand-sky)'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.4s ease' }}
          />
        </svg>
        {/* Center tap area */}
        <motion.div
          whileTap={{ scale: 0.92 }}
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Droplets size={20} color={progress >= 1 ? 'var(--brand-leaf)' : 'var(--brand-sky)'} />
          <AnimatePresence mode="wait">
            <motion.span
              key={value}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ fontWeight: 800, fontSize: 18, lineHeight: 1, color: 'var(--text-primary)' }}
            >
              {label}
            </motion.span>
          </AnimatePresence>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>/ {unit === 'liters' ? `${(goal * 0.25).toFixed(1)}L` : `${goal}`}</span>
        </motion.div>
      </div>

      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onChange(value + 1)}
        style={{ background: 'var(--brand-sky)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
      >
        <Plus size={20} />
      </motion.button>
    </div>
  );
}

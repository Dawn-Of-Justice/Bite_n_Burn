'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface Props {
  value: boolean | null;
  onChange: (val: boolean) => void;
  labelYes?: string;
  labelNo?: string;
  disabled?: boolean;
}

const iconPop = {
  initial: { scale: 0, opacity: 0, rotate: -90 },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { type: 'spring' as const, stiffness: 560, damping: 16 },
  },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.1 } },
};

export function ToggleButton({
  value,
  onChange,
  labelYes = 'Athe!',
  labelNo = 'Illa',
  disabled = false,
}: Props) {
  const baseStyle: React.CSSProperties = {
    flex: 1,
    minHeight: 44,
    padding: '10px 8px',
    borderRadius: 14,
    border: 'none',
    cursor: disabled ? 'default' : 'pointer',
    fontWeight: 700,
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <motion.button
        whileTap={disabled ? undefined : { scale: 0.93 }}
        transition={{ type: 'spring' as const, stiffness: 500, damping: 22 }}
        style={{
          ...baseStyle,
          background: value === true ? 'var(--brand-leaf)' : 'var(--bg-inset)',
          color: value === true ? '#fff' : 'var(--text-secondary)',
          boxShadow: value === true ? '0 2px 12px rgba(82,183,136,0.4)' : 'none',
        }}
        onClick={() => !disabled && onChange(true)}
      >
        <AnimatePresence>
          {value === true && (
            <motion.span
              variants={iconPop}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: 'inline-flex' }}
            >
              <Check size={16} strokeWidth={3.2} />
            </motion.span>
          )}
        </AnimatePresence>
        {labelYes}
      </motion.button>
      <motion.button
        whileTap={disabled ? undefined : { scale: 0.93 }}
        transition={{ type: 'spring' as const, stiffness: 500, damping: 22 }}
        style={{
          ...baseStyle,
          background: value === false ? '#FF5252' : 'var(--bg-inset)',
          color: value === false ? '#fff' : 'var(--text-secondary)',
          boxShadow: value === false ? '0 2px 12px rgba(255,82,82,0.35)' : 'none',
        }}
        onClick={() => !disabled && onChange(false)}
      >
        <AnimatePresence>
          {value === false && (
            <motion.span
              variants={iconPop}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: 'inline-flex' }}
            >
              <X size={16} strokeWidth={3.2} />
            </motion.span>
          )}
        </AnimatePresence>
        {labelNo}
      </motion.button>
    </div>
  );
}

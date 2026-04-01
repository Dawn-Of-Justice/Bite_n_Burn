'use client'
import { motion } from 'framer-motion';

interface Props {
  value: boolean | null;
  onChange: (val: boolean) => void;
  labelYes?: string;
  labelNo?: string;
  disabled?: boolean;
}

export function ToggleButton({
  value,
  onChange,
  labelYes = 'Athe!',
  labelNo = 'Illa',
  disabled = false,
}: Props) {
  const baseStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px 0',
    borderRadius: 12,
    border: 'none',
    cursor: disabled ? 'default' : 'pointer',
    fontWeight: 700,
    fontSize: 15,
    transition: 'all 0.2s',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        style={{
          ...baseStyle,
          background: value === true ? 'var(--brand-leaf)' : 'var(--border-color)',
          color: value === true ? '#fff' : 'var(--text-secondary)',
          boxShadow: value === true ? '0 2px 10px rgba(82,183,136,0.35)' : 'none',
        }}
        onClick={() => !disabled && onChange(true)}
      >
        {labelYes}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        style={{
          ...baseStyle,
          background: value === false ? '#FF5252' : 'var(--border-color)',
          color: value === false ? '#fff' : 'var(--text-secondary)',
          boxShadow: value === false ? '0 2px 10px rgba(255,82,82,0.3)' : 'none',
        }}
        onClick={() => !disabled && onChange(false)}
      >
        {labelNo}
      </motion.button>
    </div>
  );
}

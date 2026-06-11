'use client'
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export function PageHeader({ title, subtitle, right }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: 27, fontWeight: 700, color: 'var(--brand-forest)', letterSpacing: '-0.025em', lineHeight: 1.15 }}>{title}</h1>
        {subtitle && <p style={{ margin: '3px 0 0', fontSize: 13, fontStyle: 'italic', color: 'var(--text-secondary)' }}>{subtitle}</p>}
      </div>
      {right && <div>{right}</div>}
    </motion.div>
  );
}

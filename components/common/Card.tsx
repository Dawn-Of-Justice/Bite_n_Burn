'use client'
import type { ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
  /** Optional brand color (CSS color string) — renders a soft glow in the top corner */
  accent?: string;
}

export function Card({ children, style, className, onClick, accent }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: accent
          ? `radial-gradient(220px circle at 100% 0%, color-mix(in srgb, ${accent} 10%, transparent), transparent 70%), var(--bg-card)`
          : 'var(--bg-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        padding: '18px 20px',
        border: '1px solid var(--border-color)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

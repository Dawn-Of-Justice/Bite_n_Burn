'use client'
import type { ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, style, className, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        padding: '18px 20px',
        border: '1px solid var(--border-color)',
        backdropFilter: 'blur(12px)',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

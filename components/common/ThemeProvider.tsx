'use client'
import { useEffect, type ReactNode } from 'react';

interface Props {
  theme: 'light' | 'dark' | 'system';
  children: ReactNode;
}

export function ThemeProvider({ theme, children }: Props) {
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return <>{children}</>;
}

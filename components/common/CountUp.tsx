'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { animate } from 'framer-motion';

interface Props {
  value: number;
  duration?: number; // seconds
  style?: CSSProperties;
}

/** Animates a number counting up on mount (and whenever `value` changes). */
export function CountUp({ value, duration = 0.9, style }: Props) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const controls = animate(fromRef.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => {
        fromRef.current = v;
        setDisplay(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, duration]);

  return <span style={style}>{display}</span>;
}

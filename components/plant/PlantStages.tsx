'use client'
import { motion, useAnimationFrame } from 'framer-motion';
import { useRef, useState } from 'react';
import type { PlantStage } from '@/lib/types/plant';

interface PlantProps { progress: number; size?: number; }

function Sway({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [rotation, setRotation] = useState(0);
  useAnimationFrame((t) => {
    setRotation(Math.sin((t / 1000 + delay) * 0.8) * 3);
  });
  return <motion.g style={{ rotate: rotation, transformOrigin: 'center bottom' }}>{children}</motion.g>;
}

export function Stage0({ progress }: PlantProps) {
  const scale = 0.6 + progress * 0.4;
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <Sway>
        <g transform={`translate(60,100) scale(${scale})`}>
          {/* stem */}
          <rect x="-2" y="-28" width="4" height="28" rx="2" fill="#52B788" />
          {/* sprout leaves */}
          <ellipse cx="-10" cy="-24" rx="10" ry="6" fill="#74C69D" transform="rotate(-30,-10,-24)" />
          <ellipse cx="10" cy="-24" rx="10" ry="6" fill="#74C69D" transform="rotate(30,10,-24)" />
          {/* tiny bud */}
          <ellipse cx="0" cy="-32" rx="5" ry="7" fill="#B7E4C7" />
        </g>
      </Sway>
      {/* soil */}
      <ellipse cx="60" cy="104" rx="22" ry="6" fill="#8B5E3C" opacity="0.5" />
    </svg>
  );
}

export function Stage1({ progress }: PlantProps) {
  return (
    <svg viewBox="0 0 140 140" width="140" height="140">
      <Sway>
        <g transform="translate(70,120)">
          <rect x="-3" y="-45" width="6" height="45" rx="3" fill="#52B788" />
          <ellipse cx="-16" cy="-35" rx="14" ry="8" fill="#52B788" transform="rotate(-40,-16,-35)" />
          <ellipse cx="16" cy="-35" rx="14" ry="8" fill="#52B788" transform="rotate(40,16,-35)" />
          <ellipse cx="-12" cy="-18" rx="12" ry="7" fill="#74C69D" transform="rotate(-25,-12,-18)" />
          <ellipse cx="12" cy="-18" rx="12" ry="7" fill="#74C69D" transform="rotate(25,12,-18)" />
          <ellipse cx="0" cy="-50" rx="6" ry={8 + progress * 4} fill="#B7E4C7" />
        </g>
      </Sway>
      <ellipse cx="70" cy="124" rx="28" ry="7" fill="#8B5E3C" opacity="0.5" />
    </svg>
  );
}

export function Stage2({ progress }: PlantProps) {
  return (
    <svg viewBox="0 0 160 160" width="160" height="160">
      <Sway>
        <g transform="translate(80,145)">
          <rect x="-4" y="-70" width="8" height="70" rx="4" fill="#40916C" />
          <ellipse cx="-22" cy="-55" rx="18" ry="10" fill="#52B788" transform="rotate(-45,-22,-55)" />
          <ellipse cx="22" cy="-55" rx="18" ry="10" fill="#52B788" transform="rotate(45,22,-55)" />
          <ellipse cx="-18" cy="-35" rx="16" ry="9" fill="#74C69D" transform="rotate(-30,-18,-35)" />
          <ellipse cx="18" cy="-35" rx="16" ry="9" fill="#74C69D" transform="rotate(30,18,-35)" />
          <ellipse cx="-10" cy="-15" rx="12" ry="7" fill="#95D5B2" transform="rotate(-15,-10,-15)" />
          <ellipse cx="10" cy="-15" rx="12" ry="7" fill="#95D5B2" transform="rotate(15,10,-15)" />
          {progress > 0.5 && <ellipse cx="0" cy="-76" rx="8" ry="10" fill="#B7E4C7" />}
        </g>
      </Sway>
      <ellipse cx="80" cy="148" rx="32" ry="8" fill="#8B5E3C" opacity="0.5" />
    </svg>
  );
}

export function Stage3({ progress }: PlantProps) {
  return (
    <svg viewBox="0 0 180 180" width="180" height="180">
      <Sway delay={0.5}>
        <g transform="translate(90,165)">
          <rect x="-5" y="-90" width="10" height="90" rx="5" fill="#2D6A4F" />
          {/* main crown */}
          <ellipse cx="0" cy="-80" rx={30 + progress * 10} ry="28" fill="#52B788" />
          <ellipse cx="-28" cy="-60" rx="22" ry="14" fill="#40916C" transform="rotate(-20,-28,-60)" />
          <ellipse cx="28" cy="-60" rx="22" ry="14" fill="#40916C" transform="rotate(20,28,-60)" />
          <ellipse cx="-20" cy="-35" rx="18" ry="11" fill="#74C69D" transform="rotate(-15,-20,-35)" />
          <ellipse cx="20" cy="-35" rx="18" ry="11" fill="#74C69D" transform="rotate(15,20,-35)" />
        </g>
      </Sway>
      <ellipse cx="90" cy="168" rx="36" ry="9" fill="#8B5E3C" opacity="0.5" />
    </svg>
  );
}

export function Stage4({ progress }: PlantProps) {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200">
      <Sway delay={1}>
        <g transform="translate(100,185)">
          {/* trunk */}
          <rect x="-7" y="-110" width="14" height="110" rx="7" fill="#6B4226" />
          {/* main canopy */}
          <ellipse cx="0" cy="-110" rx={42 + progress * 12} ry="38" fill="#2D6A4F" />
          <ellipse cx="-38" cy="-85" rx="28" ry="18" fill="#40916C" transform="rotate(-15,-38,-85)" />
          <ellipse cx="38" cy="-85" rx="28" ry="18" fill="#40916C" transform="rotate(15,38,-85)" />
          <ellipse cx="-25" cy="-55" rx="22" ry="14" fill="#52B788" transform="rotate(-10,-25,-55)" />
          <ellipse cx="25" cy="-55" rx="22" ry="14" fill="#52B788" transform="rotate(10,25,-55)" />
          {/* highlight */}
          <ellipse cx="-8" cy="-120" rx="16" ry="12" fill="#74C69D" opacity="0.7" />
        </g>
      </Sway>
      <ellipse cx="100" cy="188" rx="42" ry="10" fill="#8B5E3C" opacity="0.5" />
    </svg>
  );
}

export function Stage5({ progress }: PlantProps) {
  return (
    <svg viewBox="0 0 220 220" width="220" height="220">
      <Sway delay={2}>
        <g transform="translate(110,205)">
          {/* thick trunk */}
          <rect x="-9" y="-130" width="18" height="130" rx="9" fill="#5C3317" />
          {/* branches */}
          <line x1="0" y1="-90" x2="-40" y2="-115" stroke="#6B4226" strokeWidth="7" strokeLinecap="round" />
          <line x1="0" y1="-90" x2="40" y2="-115" stroke="#6B4226" strokeWidth="7" strokeLinecap="round" />
          {/* canopy layers */}
          <ellipse cx="0" cy="-135" rx={50 + progress * 10} ry="42" fill="#1B4332" />
          <ellipse cx="-42" cy="-108" rx="30" ry="20" fill="#2D6A4F" transform="rotate(-10,-42,-108)" />
          <ellipse cx="42" cy="-108" rx="30" ry="20" fill="#2D6A4F" transform="rotate(10,42,-108)" />
          <ellipse cx="0" cy="-148" rx="35" ry="26" fill="#40916C" />
          <ellipse cx="-10" cy="-158" rx="18" ry="14" fill="#52B788" opacity="0.8" />
        </g>
      </Sway>
      <ellipse cx="110" cy="208" rx="48" ry="11" fill="#8B5E3C" opacity="0.5" />
    </svg>
  );
}

export function Stage6({ progress: _ }: PlantProps) {
  return (
    <svg viewBox="0 0 240 240" width="240" height="240">
      <Sway delay={0.3}>
        <g transform="translate(120,225)">
          {/* massive trunk */}
          <rect x="-12" y="-155" width="24" height="155" rx="12" fill="#4A2810" />
          {/* branches */}
          <line x1="0" y1="-100" x2="-55" y2="-135" stroke="#5C3317" strokeWidth="9" strokeLinecap="round" />
          <line x1="0" y1="-100" x2="55" y2="-135" stroke="#5C3317" strokeWidth="9" strokeLinecap="round" />
          <line x1="0" y1="-130" x2="-30" y2="-165" stroke="#5C3317" strokeWidth="6" strokeLinecap="round" />
          <line x1="0" y1="-130" x2="30" y2="-165" stroke="#5C3317" strokeWidth="6" strokeLinecap="round" />
          {/* Ancient canopy */}
          <ellipse cx="0" cy="-165" rx="65" ry="50" fill="#1B4332" />
          <ellipse cx="-55" cy="-128" rx="38" ry="24" fill="#2D6A4F" transform="rotate(-10,-55,-128)" />
          <ellipse cx="55" cy="-128" rx="38" ry="24" fill="#2D6A4F" transform="rotate(10,55,-128)" />
          <ellipse cx="0" cy="-185" rx="45" ry="34" fill="#40916C" />
          <ellipse cx="-15" cy="-200" rx="24" ry="18" fill="#52B788" opacity="0.9" />
          {/* Flowers / blooms */}
          {[[-38, -158], [38, -158], [-18, -175], [18, -175], [0, -165], [-52, -138], [52, -138]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x},${y})`}>
              <circle cx="0" cy="0" r="5" fill="#FFD166" opacity="0.9" />
              <circle cx="0" cy="-7" r="3" fill="#FF9E00" opacity="0.8" />
            </g>
          ))}
          {/* top highlight */}
          <ellipse cx="-12" cy="-195" rx="18" ry="12" fill="#74C69D" opacity="0.6" />
        </g>
      </Sway>
      <ellipse cx="120" cy="228" rx="58" ry="13" fill="#8B5E3C" opacity="0.5" />
    </svg>
  );
}

export const STAGE_COMPONENTS: Record<PlantStage, React.FC<PlantProps>> = {
  0: Stage0, 1: Stage1, 2: Stage2, 3: Stage3,
  4: Stage4, 5: Stage5, 6: Stage6,
};

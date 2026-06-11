'use client'
import Link from 'next/link'
import { useBadges } from '@/hooks/useBadges'

import { BADGE_DEFINITIONS } from '@/lib/types/badges';
import { Card } from '@/components/common/Card';
import * as Icons from 'lucide-react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export function BadgeShelf() {
  const { badges, markSeen } = useBadges()
  const earnedMap = new Map(badges.map(b => [b.badgeId, b]))

  // Mark unseen badges as seen after display
  useEffect(() => {
    for (const b of badges) {
      if (!b.seenByUser) markSeen(b.badgeId)
    }
  }, [badges]);

  return (
    <Card accent="var(--brand-amber)">
      <h4 style={{
        margin: '0 0 12px',
        fontSize: 11,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: 'var(--text-secondary)',
      }}>
        Achievements 🏆
      </h4>
      {badges.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '12px 0 4px', textAlign: 'center' }}>
          <div style={{ fontSize: 40 }}>🏆</div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>No badges yet</p>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Start checking in to earn achievements. Kollam aavum!
          </p>
          <Link
            href="/"
            style={{
              marginTop: 4,
              background: 'var(--brand-amber)',
              color: '#fff',
              textDecoration: 'none',
              padding: '8px 20px',
              borderRadius: 50,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Start →
          </Link>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {BADGE_DEFINITIONS.map((def, idx) => {
          const earned = earnedMap.has(def.badgeId);
          const isNew = earned && !earnedMap.get(def.badgeId)?.seenByUser;
          const IconComp = (Icons as unknown as Record<string, React.FC<{ size?: number; color?: string }>>)[def.icon];
          const hex = def.color;

          return (
            <motion.div
              key={def.badgeId}
              initial={earned ? { scale: 0.5, opacity: 0 } : false}
              animate={earned ? { scale: 1, opacity: 1 } : {}}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 18, delay: idx * 0.05 }}
              whileTap={{ scale: 0.88 }}
              title={`${def.name}: ${def.description}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '10px 4px',
                borderRadius: 12,
                background: earned ? `color-mix(in srgb, ${hex} 8%, transparent)` : 'var(--bg-inset)',
                opacity: earned ? 1 : 0.45,
                filter: earned ? 'none' : 'grayscale(1)',
                cursor: 'default',
              }}
            >
              <div style={{
                position: 'relative',
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: earned ? hex : 'var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: earned ? `0 0 0 3px ${hex}33, 0 4px 12px ${hex}55` : 'none',
                ...(isNew ? { animation: 'bnb-pulse-ring 1.6s ease-out 2' } : {}),
              }}>
                {IconComp ? <IconComp size={20} color="#fff" /> : <span>🏅</span>}
                {!earned && (
                  <div style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Lock size={9} color="var(--text-secondary)" />
                  </div>
                )}
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: earned ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>
                {def.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

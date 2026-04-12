'use client'
import { AnimatePresence, motion } from 'framer-motion';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { usePlantStage } from '@/hooks/usePlantStage';
import { useSettings } from '@/hooks/useSettings';
import { STAGE_COMPONENTS } from '@/components/plant/PlantStages';
import { BadgeShelf } from '@/components/plant/BadgeShelf';
import { STAGE_THRESHOLDS } from '@/lib/types/plant';
import { PlantSkeleton } from '@/components/plant/PlantSkeleton';

export function PlantScreen() {
  const { settings } = useSettings();
  const plantInfo = usePlantStage(settings ?? undefined);

  if (!settings || !plantInfo) return <PlantSkeleton />;

  const PlantComponent = STAGE_COMPONENTS[plantInfo.stage];
  const nextThreshold = plantInfo.nextThreshold;
  const ptsToNext = nextThreshold ? nextThreshold - plantInfo.totalScore : 0;

  return (
    <div>
      <PageHeader title="Ninte Maram 🌳" subtitle="Ente progress kando?" />

      <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Plant display */}
        <Card style={{ textAlign: 'center', padding: '28px 20px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={plantInfo.stage}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}
            >
              <PlantComponent progress={plantInfo.progress} />
            </motion.div>
          </AnimatePresence>

          <h3 style={{ margin: '0 0 2px', fontSize: 22, fontWeight: 800, color: 'var(--brand-forest)' }}>
            {plantInfo.label}
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
            {plantInfo.labelEn} · Stage {plantInfo.stage}/6
          </p>

          {/* Progress bar */}
          <div style={{ background: 'var(--border-color)', borderRadius: 8, height: 8, overflow: 'hidden', marginBottom: 8 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${plantInfo.progress * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', background: 'var(--brand-leaf)', borderRadius: 8 }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)' }}>
            <span>{STAGE_THRESHOLDS[plantInfo.stage]} pts</span>
            <span style={{ fontWeight: 700, color: 'var(--brand-forest)' }}>{plantInfo.totalScore} pts total</span>
            {plantInfo.stage < 6 && <span>{nextThreshold} pts</span>}
          </div>

          {plantInfo.stage < 6 && ptsToNext > 0 && (
            <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              {ptsToNext} more points for next stage!
            </p>
          )}
          {plantInfo.stage === 6 && (
            <p style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--brand-amber)', fontWeight: 700 }}>
              Maximum stage reached! Adipoli! 🎉
            </p>
          )}
        </Card>

        {/* Score guide */}
        <Card>
          <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>How you earn points</h4>
          {[
            { label: 'Perfect day (green)', pts: 5, color: '#52B788' },
            { label: 'Balanced day (blue)', pts: 3, color: '#48CAE4' },
            { label: 'Partial effort (amber)', pts: 1, color: '#E09F3E' },
            { label: 'Rest day (gray)', pts: 1, color: '#C9C9C9' },
            { label: 'Heavy junk day (red)', pts: 0, color: '#C1121F' },
          ].map(({ label, pts, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>+{pts} pts</span>
            </div>
          ))}
        </Card>

        <BadgeShelf />
      </div>
    </div>
  );
}

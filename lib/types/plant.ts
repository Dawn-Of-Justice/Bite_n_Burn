export type PlantStage = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface PlantStageInfo {
  stage: PlantStage;
  label: string;       // Manglish name
  labelEn: string;     // English description
  nextThreshold: number | null;
  progress: number;    // 0.0–1.0 within current stage
  totalScore: number;
}

export const STAGE_LABELS: Record<PlantStage, string> = {
  0: 'Cherupayar',   // Sprout
  1: 'Thaikal',      // Seedling
  2: 'Cheruchedi',   // Young Plant
  3: 'Chedi',        // Shrub
  4: 'Cherumaram',   // Young Tree
  5: 'Maram',        // Mature Tree
  6: 'Perumaram',    // Ancient / Blooming Tree
};

export const STAGE_LABELS_EN: Record<PlantStage, string> = {
  0: 'Sprout',
  1: 'Seedling',
  2: 'Young Plant',
  3: 'Shrub',
  4: 'Young Tree',
  5: 'Mature Tree',
  6: 'Ancient Tree',
};

export const STAGE_THRESHOLDS: number[] = [0, 15, 40, 80, 150, 270, 450];

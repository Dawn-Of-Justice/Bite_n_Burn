import type { DailyRecord, CalendarColor } from '@/lib/types/records'
import type { UserSettings } from '@/lib/types/settings'
import type { PlantStage, PlantStageInfo } from '@/lib/types/plant'
import { STAGE_THRESHOLDS, STAGE_LABELS, STAGE_LABELS_EN } from '@/lib/types/plant'
import { computeCalendarColor } from '@/lib/algorithms/calendarColor'

const SCORE_MAP: Record<CalendarColor, number> = {
  green: 5, blue: 3, amber: 1, red: 0, gray: 1,
}

export function computePlantStage(
  records: DailyRecord[],
  settings: UserSettings,
): PlantStageInfo {
  const totalScore = records.reduce((acc, r) => acc + SCORE_MAP[computeCalendarColor(r, settings)], 0)

  let stage: PlantStage = 0
  for (let i = STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalScore >= STAGE_THRESHOLDS[i]) { stage = i as PlantStage; break }
  }

  const currentFloor = STAGE_THRESHOLDS[stage]
  const nextCeiling = STAGE_THRESHOLDS[stage + 1] ?? currentFloor + 1
  const progress = Math.min((totalScore - currentFloor) / (nextCeiling - currentFloor), 1)

  return { stage, label: STAGE_LABELS[stage], labelEn: STAGE_LABELS_EN[stage], nextThreshold: stage < 6 ? nextCeiling : null, progress, totalScore }
}

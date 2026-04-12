import type { DailyRecord, CalendarColor } from '@/lib/types/records';
import type { UserSettings } from '@/lib/types/settings';
import { hasMetWaterGoal } from '@/lib/utils/water';
import type { EarnedBadge } from '@/lib/types/badges';
import { BADGE_DEFINITIONS } from '@/lib/types/badges';
import { computeCalendarColor } from '@/lib/algorithms/calendarColor';
import { computeStreak } from '@/lib/algorithms/streakCounter';
import { computePlantStage } from '@/lib/algorithms/plantStage';


interface Stats {
  totalDays: number;
  greenDays: number;
  blueDays: number;
  gymDays: number;
  waterGoalDays: number;
  currentStreak: number;
  longestStreak: number;
  plantStage: number;
  streakFreezeTokens: number;
}

function buildStats(records: DailyRecord[], settings: UserSettings): Stats {
  let greenDays = 0, blueDays = 0, gymDays = 0, waterGoalDays = 0;
  const colorCounts: Record<CalendarColor, number> = { green: 0, blue: 0, amber: 0, red: 0, gray: 0 };

  for (const r of records) {
    const c = computeCalendarColor(r, settings);
    colorCounts[c]++;
    if (c === 'green') greenDays++;
    if (c === 'blue') blueDays++;
    if (r.didGym) gymDays++;
    if (hasMetWaterGoal(r.waterCount, settings)) waterGoalDays++;
  }

  const { currentStreak, longestStreak } = computeStreak(records, settings);
  const { stage } = computePlantStage(records, settings);

  return {
    totalDays: records.length,
    greenDays,
    blueDays,
    gymDays,
    waterGoalDays,
    currentStreak,
    longestStreak,
    plantStage: stage,
    streakFreezeTokens: settings.streakFreezeTokens,
  };
}

function checkCondition(badgeId: string, stats: Stats): boolean {
  switch (badgeId) {
    case 'first_gym':      return stats.gymDays >= 1;
    case 'first_water':    return stats.waterGoalDays >= 1;
    case 'first_green':    return stats.greenDays >= 1;
    case 'streak_3':       return stats.longestStreak >= 3;
    case 'streak_7':       return stats.longestStreak >= 7;
    case 'streak_30':      return stats.longestStreak >= 30;
    case 'water_week':     return stats.waterGoalDays >= 7;
    case 'plant_stage_2':  return stats.plantStage >= 2;
    case 'plant_stage_4':  return stats.plantStage >= 4;
    case 'plant_stage_6':  return stats.plantStage >= 6;
    case 'balanced_5':     return stats.blueDays >= 5;
    case 'freeze_earned':  return stats.streakFreezeTokens >= 1;
    default:               return false;
  }
}

/** Returns the badgeIds that are newly eligible (not yet earned). */
export function computeNewBadges(
  records: DailyRecord[],
  settings: UserSettings,
  earnedBadges: EarnedBadge[],
): string[] {
  const stats = buildStats(records, settings);
  const earnedIds = new Set(earnedBadges.map(b => b.badgeId));
  return BADGE_DEFINITIONS
    .filter(def => !earnedIds.has(def.badgeId) && checkCondition(def.badgeId, stats))
    .map(def => def.badgeId);
}

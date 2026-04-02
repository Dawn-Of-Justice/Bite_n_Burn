import type { UserSettings } from '@/lib/types/settings';

/**
 * Each tap stores 1 unit in waterCount.
 * For the 'liters' unit, each tap = 0.25L, so waterGoalValue (in L) must be
 * multiplied by 4 to get the equivalent tap count.
 */
export function hasMetWaterGoal(waterCount: number, settings: Pick<UserSettings, 'waterGoalUnit' | 'waterGoalValue'>): boolean {
  if (settings.waterGoalUnit === 'liters') {
    return waterCount >= settings.waterGoalValue * 4;
  }
  return waterCount >= settings.waterGoalValue;
}

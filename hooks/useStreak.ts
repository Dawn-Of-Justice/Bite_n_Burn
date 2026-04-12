'use client'
import { useAllRecords } from './useAllRecords'
import { computeStreak } from '@/lib/algorithms/streakCounter'
import type { UserSettings } from '@/lib/types/settings'

export function useStreak(settings: UserSettings | undefined) {
  const { records } = useAllRecords()
  if (!settings) return { currentStreak: 0, longestStreak: 0 }
  return computeStreak(records, settings)
}

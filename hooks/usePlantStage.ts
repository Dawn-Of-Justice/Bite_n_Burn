'use client'
import { useAllRecords } from './useAllRecords'
import { computePlantStage } from '@/lib/algorithms/plantStage'
import type { UserSettings } from '@/lib/types/settings'

export function usePlantStage(settings: UserSettings | undefined) {
  const { records } = useAllRecords()
  if (!settings) return null
  return computePlantStage(records, settings)
}

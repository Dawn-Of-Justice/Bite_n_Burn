'use client'
import { todayKey } from '@/lib/utils/date'
import { useDayRecord } from '@/hooks/useDayRecord'

export function useTodayRecord() {
  return useDayRecord(todayKey())
}

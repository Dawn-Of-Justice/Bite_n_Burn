'use client'
import useSWR from 'swr'
import { todayKey } from '@/lib/utils/date'
import type { DailyRecord } from '@/lib/types/records'

export function useTodayRecord() {
  const dateKey = todayKey()
  const { data: record, mutate } = useSWR<DailyRecord | null>(`/api/records/${dateKey}`)

  const update = async (partial: Partial<DailyRecord>) => {
    const merged = { ...(record ?? {}), ...partial }
    mutate(merged as DailyRecord, false)
    await fetch(`/api/records/${dateKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    })
    mutate()
  }

  return { record: record ?? null, update, dateKey }
}

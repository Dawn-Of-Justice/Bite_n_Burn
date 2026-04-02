'use client'
import useSWR from 'swr'
import type { DailyRecord } from '@/lib/types/records'

export function useDayRecord(dateKey: string) {
  const { data: record, mutate, isLoading } = useSWR<DailyRecord | null>(`/api/records/${dateKey}`)

  const update = async (partial: Partial<DailyRecord>) => {
    const merged = { ...(record ?? {}), ...partial }
    mutate(merged as DailyRecord, false)
    const res = await fetch(`/api/records/${dateKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    })
    const updated = await res.json()
    mutate(updated, false)
  }

  return { record: record ?? null, update, dateKey, isLoading }
}

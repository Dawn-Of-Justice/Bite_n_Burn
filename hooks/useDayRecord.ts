'use client'
import useSWR, { mutate as globalMutate } from 'swr'
import type { DailyRecord } from '@/lib/types/records'

// Replace (or insert) a record in a cached list, keeping dateKey order.
const upsert = (list: DailyRecord[] | undefined, updated: DailyRecord) =>
  list
    ? [...list.filter(r => r.dateKey !== updated.dateKey), updated]
        .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    : list

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
    if (!res.ok) {
      // Roll back the optimistic update
      mutate()
      return
    }
    const updated: DailyRecord = await res.json()
    mutate(updated, false)

    // Write the saved record straight into the calendar-month and all-records
    // caches. Global revalidation is disabled (revalidateIfStale: false in
    // SWRProvider), so Calendar and Stats would otherwise keep serving stale
    // data — a bare globalMutate(key) only refetches for *mounted* hooks.
    const month = dateKey.slice(0, 7) // "YYYY-MM"
    globalMutate<DailyRecord[]>(
      `/api/records?month=${month}`,
      list => upsert(list, updated),
      { revalidate: false },
    )
    globalMutate<DailyRecord[]>(
      '/api/records',
      list => upsert(list, updated),
      { revalidate: false },
    )
  }

  return { record: record ?? null, update, dateKey, isLoading }
}

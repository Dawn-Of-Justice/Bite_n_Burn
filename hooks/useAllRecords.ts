'use client'
import useSWR from 'swr'
import type { DailyRecord } from '@/lib/types/records'

export function useAllRecords() {
  const { data } = useSWR<DailyRecord[]>('/api/records')
  return data ?? []
}

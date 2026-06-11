'use client'
import useSWR from 'swr'
import type { DailyRecord } from '@/lib/types/records'

export function useAllRecords() {
  const { data, isLoading } = useSWR<DailyRecord[]>('/api/records')
  return { records: data ?? [], isLoading }
}

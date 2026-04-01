'use client'
import useSWR from 'swr'
import type { DailyRecord } from '@/lib/types/records'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useAllRecords() {
  const { data } = useSWR<DailyRecord[]>('/api/records', fetcher)
  return data ?? []
}

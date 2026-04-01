'use client'
import useSWR from 'swr'
import type { DailyRecord } from '@/lib/types/records'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useCalendarMonth(year: number, month: number) {
  const key = `${year}-${String(month).padStart(2, '0')}`
  const { data } = useSWR<DailyRecord[]>(`/api/records?month=${key}`, fetcher)
  return data ?? []
}

'use client'
import useSWR from 'swr'
import type { DailyRecord } from '@/lib/types/records'

export function useCalendarMonth(year: number, month: number) {
  const key = `${year}-${String(month).padStart(2, '0')}`
  const { data } = useSWR<DailyRecord[]>(`/api/records?month=${key}`)
  return data ?? []
}

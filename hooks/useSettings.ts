'use client'
import useSWR from 'swr'
import type { UserSettings } from '@/lib/types/settings'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useSettings() {
  const { data: settings, mutate, isLoading } = useSWR<UserSettings>('/api/settings', fetcher)

  const update = async (partial: Partial<Omit<UserSettings, 'id' | 'userId' | 'createdAt'>>) => {
    // Optimistic update
    mutate({ ...settings!, ...partial }, false)
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partial),
    })
    mutate()
  }

  return { settings, update, isLoading }
}

'use client'
import useSWR from 'swr'
import type { UserSettings } from '@/lib/types/settings'

export function useSettings() {
  const { data: settings, mutate, isLoading } = useSWR<UserSettings>('/api/settings', {
    revalidateIfStale: false,
    revalidateOnMount: true,
  })

  const update = async (partial: Partial<Omit<UserSettings, 'id' | 'userId' | 'createdAt'>>) => {
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

'use client'
import useSWR from 'swr'
import type { EarnedBadge } from '@/lib/types/badges'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useBadges() {
  const { data, mutate } = useSWR<EarnedBadge[]>('/api/badges', fetcher)

  const earnBadge = async (badgeId: string) => {
    await fetch(`/api/badges/${badgeId}`, { method: 'POST' })
    mutate()
  }

  const markSeen = async (badgeId: string) => {
    await fetch(`/api/badges/${badgeId}`, { method: 'PATCH' })
    mutate()
  }

  return { badges: data ?? [], earnBadge, markSeen }
}

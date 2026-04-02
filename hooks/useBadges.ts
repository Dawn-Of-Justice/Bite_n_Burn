'use client'
import useSWR from 'swr'
import type { EarnedBadge } from '@/lib/types/badges'

export function useBadges() {
  const { data, mutate } = useSWR<EarnedBadge[]>('/api/badges', {
    revalidateIfStale: false,
    revalidateOnMount: true,
  })

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

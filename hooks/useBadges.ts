'use client'
import { useEffect, useRef } from 'react'
import useSWR from 'swr'
import type { EarnedBadge } from '@/lib/types/badges'
import { computeNewBadges } from '@/lib/algorithms/badges'
import { useAllRecords } from './useAllRecords'
import { useSettings } from './useSettings'

export function useBadges() {
  const { data, mutate } = useSWR<EarnedBadge[]>('/api/badges')
  const { records } = useAllRecords()
  const { settings } = useSettings()
  const awardingRef = useRef(false)

  const earnBadge = async (badgeId: string) => {
    await fetch(`/api/badges/${badgeId}`, { method: 'POST' })
    mutate()
  }

  const markSeen = async (badgeId: string) => {
    await fetch(`/api/badges/${badgeId}`, { method: 'PATCH' })
    mutate()
  }

  // Check and award newly eligible badges whenever records or earned list changes
  useEffect(() => {
    if (!data || !settings || records.length === 0 || awardingRef.current) return
    const newBadges = computeNewBadges(records, settings, data)
    if (newBadges.length === 0) return

    awardingRef.current = true
    Promise.all(newBadges.map(id =>
      fetch(`/api/badges/${id}`, { method: 'POST' })
    )).then(() => {
      mutate()
    }).finally(() => {
      awardingRef.current = false
    })
  }, [data, records, settings])

  return { badges: data ?? [], earnBadge, markSeen }
}

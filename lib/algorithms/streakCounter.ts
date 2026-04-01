import { subDays, format } from 'date-fns'
import type { DailyRecord, CalendarColor } from '@/lib/types/records'
import type { UserSettings } from '@/lib/types/settings'
import { computeCalendarColor } from '@/lib/algorithms/calendarColor'

function isStreakDay(color: CalendarColor): boolean {
  return color === 'green' || color === 'blue' || color === 'amber' || color === 'gray'
}

export interface StreakResult { currentStreak: number; longestStreak: number }

export function computeStreak(records: DailyRecord[], settings: UserSettings): StreakResult {
  const recordMap = new Map(records.map(r => [r.dateKey, r]))
  const today = new Date()
  let currentStreak = 0, longestStreak = 0, foundBreak = false

  for (let i = 0; i < 365; i++) {
    const dateKey = format(subDays(today, i), 'yyyy-MM-dd')
    const record = recordMap.get(dateKey)
    if (!record) { if (i === 0) continue; if (!foundBreak) foundBreak = true; break }
    const color = computeCalendarColor(record, settings)
    if (isStreakDay(color)) { if (!foundBreak) currentStreak++ } else { if (!foundBreak) foundBreak = true }
  }

  let running = 0
  for (const key of [...recordMap.keys()].sort()) {
    const color = computeCalendarColor(recordMap.get(key)!, settings)
    if (isStreakDay(color)) { running++; if (running > longestStreak) longestStreak = running } else { running = 0 }
  }

  return { currentStreak, longestStreak }
}

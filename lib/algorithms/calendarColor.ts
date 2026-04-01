import type { DailyRecord, CalendarColor } from '@/lib/types/records'
import type { UserSettings } from '@/lib/types/settings'

export function computeCalendarColor(
  record: DailyRecord | null | undefined,
  settings: UserSettings,
): CalendarColor {
  if (!record) return 'gray'
  if (record.isRestDay) return 'gray'

  const hasAnyData =
    record.didGym !== null ||
    record.ateJunk !== null ||
    record.exceededSugar !== null ||
    record.waterCount > 0

  if (!hasAnyData) return 'gray'

  const didGym = record.didGym === true
  const ateJunk = record.ateJunk === true
  const exceededSugar = record.exceededSugar === true
  const metWaterGoal = record.waterCount >= settings.waterGoalValue

  if (didGym && metWaterGoal && !ateJunk) return 'green'
  if (didGym && ateJunk && !exceededSugar) return 'blue'
  if (!didGym && ateJunk && exceededSugar) return 'red'
  return 'amber'
}

export const COLOR_STYLES: Record<CalendarColor, { bg: string; text: string; label: string }> = {
  green: { bg: '#52B788', text: '#fff', label: 'Nannayirunnu!' },
  blue:  { bg: '#48CAE4', text: '#fff', label: 'Balanced!' },
  amber: { bg: '#E09F3E', text: '#fff', label: 'Okay day' },
  red:   { bg: '#C1121F', text: '#fff', label: 'Oru kali...' },
  gray:  { bg: '#C9C9C9', text: '#555', label: 'Rest day' },
}

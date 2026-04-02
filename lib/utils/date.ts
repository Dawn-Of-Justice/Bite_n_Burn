import { format, subDays } from 'date-fns'
export const toDateKey = (date: Date = new Date()): string => format(date, 'yyyy-MM-dd')
export const todayKey = (): string => toDateKey(new Date())
export const yesterdayKey = (): string => toDateKey(subDays(new Date(), 1))
export const isToday = (dateKey: string): boolean => dateKey === todayKey()

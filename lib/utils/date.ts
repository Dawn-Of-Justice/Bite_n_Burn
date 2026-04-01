import { format } from 'date-fns'
export const toDateKey = (date: Date = new Date()): string => format(date, 'yyyy-MM-dd')
export const todayKey = (): string => toDateKey(new Date())
export const isToday = (dateKey: string): boolean => dateKey === todayKey()

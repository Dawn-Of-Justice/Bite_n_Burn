import type { CalendarColor } from '@/lib/types/records'

const MESSAGES: Record<CalendarColor | 'default', string[]> = {
  green: ["Nannayirunnu! Perfect day! 💪","Kollam! Gym cheythu, vellam kudich, junk illaa! 🌿","Adipoli! Keep going da! 🔥"],
  blue:  ["Balanced! Gym cheythu kazhichu — that's the deal! 😎","Treat earned! Gym cheytha sthalathinu credit kitto! 💪"],
  amber: ["Okay okay, tomorrow try cheyyam! 🌅","Oru day thetti, but it's fine! Reset aavaam! ✨"],
  red:   ["Sherikkum? Oru kadi aanu... 😅","Aayi, no gym, junk food, sugar — oru fresh start koodiyallo! 🌱"],
  gray:  ["Rest day! Body also needs recovery! 🛌","Rest is part of the plan! 😴"],
  default: ["Enthayee innu? Fill in your day! ✏️","Check in cheyyoo! Takes only 10 seconds! ⚡"],
}

export function getMotivationalMessage(color?: CalendarColor | null): string {
  const pool = MESSAGES[color ?? 'default']
  return pool[Math.floor(Math.random() * pool.length)]
}

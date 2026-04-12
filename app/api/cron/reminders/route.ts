import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { Settings } from '@/lib/db/models/Settings'
import { Record } from '@/lib/db/models/Record'
import { sendPushNotification } from '@/lib/services/push'

function getNowInTZ(tz: string) {
  const fmt = (opt: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: tz, ...opt }).format(new Date())

  const dateKey = fmt({ year: 'numeric', month: '2-digit', day: '2-digit' }) // "YYYY-MM-DD"
  const time = fmt({ hour: '2-digit', minute: '2-digit', hour12: false })     // "HH:mm"
  return { dateKey, time }
}

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  // Find all users with evening reminders enabled and an FCM token
  const candidates = await Settings.find({
    eveningReminderEnabled: true,
    fcmToken: { $ne: '' },
  }).lean()

  let sent = 0
  let skipped = 0

  // Filter per-user by timezone: is it past their reminder time? Already reminded today?
  const toRemind: Array<{ userId: string; name: string; fcmToken: string; dateKey: string }> = []

  for (const user of candidates) {
    const { dateKey, time } = getNowInTZ(user.timezone || 'Asia/Kolkata')

    // Already reminded today
    if (user.lastReminderDate === dateKey) {
      skipped++
      continue
    }

    // Not yet past their reminder time
    if (time < (user.eveningReminderTime || '21:00')) {
      skipped++
      continue
    }

    toRemind.push({
      userId: user.userId,
      name: user.name || 'Friend',
      fcmToken: user.fcmToken,
      dateKey,
    })
  }

  if (toRemind.length === 0) {
    return NextResponse.json({ sent: 0, skipped })
  }

  // Batch-check which users already completed their record today
  const userIds = toRemind.map(u => u.userId)
  const dateKeys = [...new Set(toRemind.map(u => u.dateKey))]

  const completedRecords = await Record.find({
    userId: { $in: userIds },
    dateKey: { $in: dateKeys },
    completedAt: { $ne: null },
  }).lean()

  const completedSet = new Set(
    completedRecords.map((r: { userId: string; dateKey: string }) => `${r.userId}:${r.dateKey}`),
  )

  // Send reminders sequentially
  const remindedUserIds: string[] = []

  for (const user of toRemind) {
    if (completedSet.has(`${user.userId}:${user.dateKey}`)) {
      skipped++
      continue
    }

    const message = `Hey ${user.name}! Innu log cheythilla — Bite & Burn update cheyyaan time aayi! 💪`
    const result = await sendPushNotification(user.fcmToken, 'Bite & Burn', message)

    if (result.ok) {
      sent++
    } else {
      console.error(`Failed to send reminder to ${user.userId}: ${result.error}`)
    }

    // Mark as reminded regardless of success to avoid spam on repeated failures
    remindedUserIds.push(user.userId)
  }

  // Batch-update lastReminderDate
  if (remindedUserIds.length > 0) {
    // Group by dateKey for correct per-user update
    const byDate = new Map<string, string[]>()
    for (const user of toRemind) {
      if (!remindedUserIds.includes(user.userId)) continue
      const arr = byDate.get(user.dateKey) ?? []
      arr.push(user.userId)
      byDate.set(user.dateKey, arr)
    }

    for (const [dateKey, ids] of byDate) {
      await Settings.updateMany(
        { userId: { $in: ids } },
        { $set: { lastReminderDate: dateKey } },
      )
    }
  }

  return NextResponse.json({ sent, skipped })
}

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { Settings } from '@/lib/db/models/Settings'
import { sendPushNotification } from '@/lib/services/push'

// POST /api/test-push — sends a test notification to the current user
export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const settings = await Settings.findOne({ userId }).lean()

  if (!settings?.fcmToken) {
    return NextResponse.json({ error: 'No FCM token — enable notifications first' }, { status: 400 })
  }

  const result = await sendPushNotification(
    settings.fcmToken,
    'Bite & Burn',
    `Hey ${settings.name || 'Friend'}! Innu log cheythilla — Bite & Burn update cheyyaan time aayi! 💪`,
  )

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

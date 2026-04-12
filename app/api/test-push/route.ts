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

  if (!settings?.fcmTokens?.length) {
    return NextResponse.json({ error: 'No FCM tokens — enable notifications on at least one device first' }, { status: 400 })
  }

  const message = `Hey ${settings.name || 'Friend'}! Innu log cheythilla — Bite & Burn update cheyyaan time aayi! 💪`
  const results = await Promise.all(
    settings.fcmTokens.map((token: string) => sendPushNotification(token, 'Bite & Burn', message))
  )

  const failed = results.filter(r => !r.ok)
  if (failed.length === results.length) {
    return NextResponse.json({ error: failed[0].error }, { status: 500 })
  }

  return NextResponse.json({ ok: true, sent: results.length - failed.length })
}

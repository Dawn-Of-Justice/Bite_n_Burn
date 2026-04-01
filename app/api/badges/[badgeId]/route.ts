import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { Badge } from '@/lib/db/models/Badge'

// POST /api/badges/[badgeId]  — earn a badge
export async function POST(_req: NextRequest, { params }: { params: Promise<{ badgeId: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { badgeId } = await params
  await connectDB()

  const badge = await Badge.findOneAndUpdate(
    { userId, badgeId },
    { $setOnInsert: { userId, badgeId, earnedAt: new Date().toISOString(), seenByUser: false } },
    { upsert: true, new: true },
  ).lean()

  return NextResponse.json(badge)
}

// PATCH /api/badges/[badgeId]  — mark as seen
export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ badgeId: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { badgeId } = await params
  await connectDB()
  await Badge.findOneAndUpdate({ userId, badgeId }, { $set: { seenByUser: true } })
  return NextResponse.json({ ok: true })
}

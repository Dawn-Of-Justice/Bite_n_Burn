import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { Record } from '@/lib/db/models/Record'

// GET /api/records/[dateKey]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ dateKey: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { dateKey } = await params
  await connectDB()
  const record = await Record.findOne({ userId, dateKey }).lean()
  return NextResponse.json(record ?? null, {
    headers: { 'Cache-Control': 'private, max-age=30, stale-while-revalidate=10' },
  })
}

// PUT /api/records/[dateKey]  — upsert
export async function PUT(req: NextRequest, { params }: { params: Promise<{ dateKey: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { dateKey } = await params
  const body = await req.json()

  // Determine completedAt
  const isComplete =
    body.didGym !== null && body.didGym !== undefined &&
    body.ateJunk !== null && body.ateJunk !== undefined &&
    body.exceededSugar !== null && body.exceededSugar !== undefined &&
    (body.waterCount ?? 0) > 0

  await connectDB()
  const record = await Record.findOneAndUpdate(
    { userId, dateKey },
    {
      $set: {
        ...body,
        userId,
        dateKey,
        ...(isComplete ? { completedAt: new Date().toISOString() } : {}),
      },
    },
    { upsert: true, new: true },
  ).lean()

  return NextResponse.json(record)
}

import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { Settings } from '@/lib/db/models/Settings'

// GET /api/settings
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  let settings = await Settings.findOne({ userId }).lean()

  // Auto-create defaults on first visit
  if (!settings) {
    const user = await currentUser()
    settings = await Settings.create({
      userId,
      name: user?.firstName ?? 'Friend',
    })
    settings = settings.toObject()
  }

  return NextResponse.json(settings)
}

// PUT /api/settings
export async function PUT(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  await connectDB()
  const settings = await Settings.findOneAndUpdate(
    { userId },
    { $set: { ...body, userId } },
    { upsert: true, new: true },
  ).lean()

  return NextResponse.json(settings)
}

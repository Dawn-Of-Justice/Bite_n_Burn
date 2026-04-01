import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { Badge } from '@/lib/db/models/Badge'

// GET /api/badges
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const badges = await Badge.find({ userId }).lean()
  return NextResponse.json(badges)
}

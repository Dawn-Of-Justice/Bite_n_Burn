import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { Record } from '@/lib/db/models/Record'

// GET /api/records?month=YYYY-MM  or  GET /api/records (all)
export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const month = req.nextUrl.searchParams.get('month') // "2026-04"

  let records
  if (month) {
    const [y, m] = month.split('-')
    const start = `${y}-${m.padStart(2, '0')}-01`
    const end   = `${y}-${m.padStart(2, '0')}-31`
    records = await Record.find({ userId, dateKey: { $gte: start, $lte: end } }).lean()
  } else {
    records = await Record.find({ userId }).sort({ dateKey: 1 }).lean()
  }

  return NextResponse.json(records)
}

import mongoose from 'mongoose'
import { attachDatabasePool } from '@vercel/functions'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) throw new Error('Missing MONGODB_URI environment variable')

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

const cached = global._mongooseCache ?? { conn: null, promise: null }
global._mongooseCache = cached

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  }
  cached.conn = await cached.promise
  // Attach the underlying MongoClient so Vercel can manage the connection pool
  // across function suspends/resumes, preventing connection exhaustion
  attachDatabasePool(cached.conn.connection.getClient())
  return cached.conn
}

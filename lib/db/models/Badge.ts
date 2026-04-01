import { Schema, model, models } from 'mongoose'

const BadgeSchema = new Schema({
  userId:      { type: String, required: true, index: true },
  badgeId:     { type: String, required: true },
  earnedAt:    { type: String, default: () => new Date().toISOString() },
  seenByUser:  { type: Boolean, default: false },
}, { timestamps: true })

BadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true })

export const Badge = models.Badge ?? model('Badge', BadgeSchema)

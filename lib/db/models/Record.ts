import mongoose, { Schema, model, models } from 'mongoose'

const RecordSchema = new Schema({
  userId:        { type: String, required: true, index: true },
  dateKey:       { type: String, required: true }, // "YYYY-MM-DD"

  // Poyo
  didGym:        { type: Boolean, default: null },
  isRestDay:     { type: Boolean, default: false },

  // Kazhicho
  ateJunk:       { type: Boolean, default: null },
  exceededSugar: { type: Boolean, default: null },
  junkItemsEaten:{ type: [String], default: [] },

  // Hydration
  waterCount:    { type: Number, default: 0 },

  // Gut feeling
  gutFeeling:    { type: String, enum: ['great', 'okay', 'rough', null], default: null },

  // Meta
  completedAt:   { type: String, default: null },
}, {
  timestamps: true, // adds createdAt, updatedAt
})

RecordSchema.index({ userId: 1, dateKey: 1 }, { unique: true })

export const Record = models.Record ?? model('Record', RecordSchema)

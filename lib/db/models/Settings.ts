import { Schema, model, models } from 'mongoose'

const SettingsSchema = new Schema({
  userId:                  { type: String, required: true, unique: true },
  name:                    { type: String, default: 'Friend' },
  waterGoalUnit:           { type: String, enum: ['glasses', 'liters'], default: 'glasses' },
  waterGoalValue:          { type: Number, default: 8 },
  customJunkItems:         { type: [String], default: ['Chips', 'Samosa', 'Pepsi / Coke', 'Mithai', 'Ice Cream'] },
  sugarLimitDescriptor:    { type: String, default: '1 mithai or 2 biscuits' },
  morningReminderEnabled:  { type: Boolean, default: false },
  morningReminderTime:     { type: String, default: '08:00' },
  eveningReminderEnabled:  { type: Boolean, default: true },
  eveningReminderTime:     { type: String, default: '21:00' },
  fcmTokens:               { type: [String], default: [] },
  timezone:                { type: String, default: 'Asia/Kolkata' },
  lastReminderDate:        { type: String, default: null },
  theme:                   { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  streakFreezeTokens:      { type: Number, default: 0 },
  onboardingCompleted:     { type: Boolean, default: false },
}, { timestamps: true })

export const Settings = models.Settings ?? model('Settings', SettingsSchema)

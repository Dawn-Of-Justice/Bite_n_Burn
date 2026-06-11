export interface UserSettings {
  id: 1;
  userId: string; // Clerk userId — namespaces the DB

  name: string;

  // Hydration
  waterGoalUnit: 'glasses' | 'liters';
  waterGoalValue: number; // glasses: 8 default; liters: 2.0 default

  // Junk food
  customJunkItems: string[];

  // Sugar
  sugarLimitDescriptor: string; // "1 mithai, 2 cookies" — plain language anchor

  // Reminders
  morningReminderEnabled: boolean;
  morningReminderTime: string; // "08:00"
  eveningReminderEnabled: boolean;
  eveningReminderTime: string; // "21:00"
  fcmTokens: string[]; // FCM tokens — one per device/browser that has enabled notifications
  timezone: string; // IANA timezone, e.g. "Asia/Kolkata"
  lastReminderDate: string | null; // "YYYY-MM-DD" — dedup, set by cron

  // Theme
  theme: 'light' | 'dark' | 'system';

  // Streak Freeze Tokens
  streakFreezeTokens: number;

  // Meta
  onboardingCompleted: boolean;
  createdAt: string;
}

export const defaultSettings = (userId: string, name: string): UserSettings => ({
  id: 1,
  userId,
  name,
  waterGoalUnit: 'glasses',
  waterGoalValue: 8,
  customJunkItems: ['Chips', 'Samosa', 'Pepsi / Coke', 'Mithai', 'Ice Cream'],
  sugarLimitDescriptor: '1 mithai or 2 biscuits',
  morningReminderEnabled: false,
  morningReminderTime: '08:00',
  eveningReminderEnabled: true,
  eveningReminderTime: '21:00',
  fcmTokens: [],
  timezone: 'Asia/Kolkata',
  lastReminderDate: null,
  theme: 'system',
  streakFreezeTokens: 0,
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
});

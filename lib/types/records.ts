export type DateKey = string; // "YYYY-MM-DD"
export type CalendarColor = 'green' | 'blue' | 'amber' | 'red' | 'gray';
export type GutFeeling = 'great' | 'okay' | 'rough';

export interface DailyRecord {
  dateKey: DateKey;

  // Poyo (Gym)
  didGym: boolean | null;
  isRestDay: boolean;

  // Kazhicho (Food)
  ateJunk: boolean | null;
  exceededSugar: boolean | null;
  junkItemsEaten: string[];

  // Hydration
  waterCount: number;

  // Gut feeling
  gutFeeling: GutFeeling | null;

  // Meta
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export const defaultDailyRecord = (dateKey: DateKey): DailyRecord => ({
  dateKey,
  didGym: null,
  isRestDay: false,
  ateJunk: null,
  exceededSugar: null,
  junkItemsEaten: [],
  waterCount: 0,
  gutFeeling: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  completedAt: null,
});

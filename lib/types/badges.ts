export interface BadgeDefinition {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  color: string; // tailwind bg color class
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
  seenByUser: boolean;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { badgeId: 'first_gym', name: 'Poyo!', description: 'First gym day logged', icon: 'Dumbbell', color: 'bg-emerald-500' },
  { badgeId: 'first_water', name: 'Vellam!', description: 'First water goal met', icon: 'Droplets', color: 'bg-sky-500' },
  { badgeId: 'first_green', name: 'Kollam!', description: 'First perfect green day', icon: 'Leaf', color: 'bg-green-600' },
  { badgeId: 'streak_3', name: '3 Naal Streak', description: '3 days in a row', icon: 'Flame', color: 'bg-orange-400' },
  { badgeId: 'streak_7', name: 'Oru Aazhcha!', description: '7-day streak', icon: 'Flame', color: 'bg-orange-500' },
  { badgeId: 'streak_30', name: 'Oru Maasam!', description: '30-day streak', icon: 'Trophy', color: 'bg-yellow-500' },
  { badgeId: 'water_week', name: 'Hydration Hero', description: 'Met water goal 7 days in a row', icon: 'Droplets', color: 'bg-blue-500' },
  { badgeId: 'plant_stage_2', name: 'Cheruchedi', description: 'Plant reached Stage 2', icon: 'Sprout', color: 'bg-lime-500' },
  { badgeId: 'plant_stage_4', name: 'Cherumaram!', description: 'Plant reached Young Tree', icon: 'TreePine', color: 'bg-green-500' },
  { badgeId: 'plant_stage_6', name: 'Perumaram!!', description: 'Plant reached Ancient Tree', icon: 'TreeDeciduous', color: 'bg-green-700' },
  { badgeId: 'balanced_5', name: 'Blue Streak', description: '5 balanced (blue) days', icon: 'Scale', color: 'bg-cyan-500' },
  { badgeId: 'freeze_earned', name: 'Streak Freeze', description: 'Earned first streak freeze token', icon: 'Snowflake', color: 'bg-indigo-400' },
];

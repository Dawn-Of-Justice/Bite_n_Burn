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
  { badgeId: 'first_gym',     name: 'Poyo!',          description: 'First gym day logged',           icon: 'Dumbbell',      color: '#10b981' },
  { badgeId: 'first_water',   name: 'Vellam!',         description: 'First water goal met',           icon: 'Droplets',      color: '#0ea5e9' },
  { badgeId: 'first_green',   name: 'Kollam!',         description: 'First perfect green day',        icon: 'Leaf',          color: '#16a34a' },
  { badgeId: 'streak_3',      name: '3 Naal Streak',   description: '3 days in a row',                icon: 'Flame',         color: '#fb923c' },
  { badgeId: 'streak_7',      name: 'Oru Aazhcha!',    description: '7-day streak',                   icon: 'Flame',         color: '#f97316' },
  { badgeId: 'streak_30',     name: 'Oru Maasam!',     description: '30-day streak',                  icon: 'Trophy',        color: '#eab308' },
  { badgeId: 'water_week',    name: 'Hydration Hero',  description: 'Met water goal 7 days in a row', icon: 'Droplets',      color: '#3b82f6' },
  { badgeId: 'plant_stage_2', name: 'Cheruchedi',      description: 'Plant reached Stage 2',          icon: 'Sprout',        color: '#84cc16' },
  { badgeId: 'plant_stage_4', name: 'Cherumaram!',     description: 'Plant reached Young Tree',       icon: 'TreePine',      color: '#22c55e' },
  { badgeId: 'plant_stage_6', name: 'Perumaram!!',     description: 'Plant reached Ancient Tree',     icon: 'TreeDeciduous', color: '#15803d' },
  { badgeId: 'balanced_5',    name: 'Blue Streak',     description: '5 balanced (blue) days',         icon: 'Scale',         color: '#06b6d4' },
  { badgeId: 'freeze_earned', name: 'Streak Freeze',   description: 'Earned first streak freeze token', icon: 'Snowflake',   color: '#818cf8' },
];

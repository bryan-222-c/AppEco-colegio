export type BinCategory = 'blanco' | 'verde' | 'negro' | 'especial';

export interface WasteItem {
  id: string;
  name: string;
  category: BinCategory;
  categoryLabel: string;
  icon: string;
  illustration: string;
  tip: string;
  explanation: string;
  points: number;
}

export type MissionZoneId = 'salon' | 'patio' | 'cafeteria';

export interface MissionZoneProblem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category?: BinCategory;
  actionText: string;
  actionType: 'classify' | 'switch' | 'interact';
  cleanMessage: string;
  xPercent: number; // For interactive scene coordinates
  yPercent: number;
  solved: boolean;
}

export interface MissionZone {
  id: MissionZoneId;
  name: string;
  description: string;
  icon: string;
  badgeReward: string;
  problems: MissionZoneProblem[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  isTrue: boolean;
  explanation: string;
  ecoTip: string;
  category: string;
}

export interface LessonSection {
  subtitle: string;
  text: string;
  emoji: string;
  bullets?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  shortDesc: string;
  icon: string;
  badgeName: string;
  sections: LessonSection[];
  funFact: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  dayLabel: string;
  tag: string;
}

export interface SchoolItemCatalog {
  id: string;
  name: string;
  category: 'naturaleza' | 'reciclaje' | 'energia' | 'recreo';
  cost: number;
  icon: string;
  description: string;
  ecoBonus: string;
}

export interface PlacedSchoolItem {
  instanceId: string;
  catalogId: string;
  x: number; // percentage in yard 0-100
  y: number; // percentage in yard 0-100
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  playerName: string;
  avatarId: string;
  greenPoints: number;
  wasteClassifiedCount: number;
  quizCorrectCount: number;
  completedMissions: string[]; // zone problem IDs
  completedChallenges: string[]; // challenge IDs with date
  unlockedBadgeIds: string[];
  placedSchoolItems: PlacedSchoolItem[];
}

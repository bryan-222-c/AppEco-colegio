import { UserRecord } from './db';

// Timezone Colombia (UTC-5)
export const COLOMBIA_TZ = 'America/Bogota';

export function getColombiaDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: COLOMBIA_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

// Difference in calendar days between two YYYY-MM-DD strings
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(`${dateStr1}T12:00:00Z`);
  const d2 = new Date(`${dateStr2}T12:00:00Z`);
  const diffMs = d2.getTime() - d1.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function getStreakMotivationalMessage(streak: number): string {
  if (streak <= 1) return '¡Comenzaste tu aventura ecológica!';
  if (streak === 2) return '¡Dos días seguidos cuidando el colegio!';
  if (streak === 3) return '¡Tres días cuidando el planeta!';
  if (streak < 7) return `¡Gran constancia! ${streak} días protegiendo la naturaleza.`;
  if (streak === 7) return '¡Una semana siendo un guardián ambiental!';
  if (streak < 15) return `¡Increíble! Llevas ${streak} días transformando tu entorno.`;
  if (streak === 15) return '¡Tu compromiso está creciendo!';
  if (streak < 30) return `¡Impresionante! ${streak} días de disciplina verde.`;
  return '¡Eres una leyenda de ECO-COLEGIO!';
}

export interface StreakEvaluationResult {
  updatedUser: UserRecord;
  streakIncremented: boolean;
  milestonePoints: number;
  milestoneBadge: string | null;
  message: string;
}

export function evaluateUserStreak(user: UserRecord): StreakEvaluationResult {
  const todayColombia = getColombiaDateString();
  const lastDate = user.lastActiveDateColombia || todayColombia;

  const diffDays = getDaysDifference(lastDate, todayColombia);

  let newStreak = user.streak;
  let streakIncremented = false;
  let milestonePoints = 0;
  let milestoneBadge: string | null = null;

  if (diffDays === 0) {
    // Already counted today
    newStreak = Math.max(1, user.streak);
  } else if (diffDays === 1) {
    // Yesterday -> advance streak!
    newStreak = user.streak + 1;
    streakIncremented = true;
  } else {
    // Broken streak (>1 day) -> reset to 1 kindly
    newStreak = 1;
  }

  // Update active dates array
  const activeDatesSet = new Set(user.activeDates || []);
  activeDatesSet.add(todayColombia);

  // Check Milestones (3, 7, 15, 30 days)
  const claimedRewards = new Set(user.claimedRewards || []);
  const unlockedBadges = new Set(user.unlockedBadges || []);

  if (newStreak >= 3 && !claimedRewards.has('streak_milestone_3')) {
    claimedRewards.add('streak_milestone_3');
    unlockedBadges.add('badge_racha_3');
    milestonePoints += 50;
    milestoneBadge = 'Racha Verde de 3 Días';
  }
  if (newStreak >= 7 && !claimedRewards.has('streak_milestone_7')) {
    claimedRewards.add('streak_milestone_7');
    unlockedBadges.add('badge_racha_7');
    milestonePoints += 100;
    milestoneBadge = 'Semana Ecológica Completa';
  }
  if (newStreak >= 15 && !claimedRewards.has('streak_milestone_15')) {
    claimedRewards.add('streak_milestone_15');
    unlockedBadges.add('badge_racha_15');
    milestonePoints += 200;
    milestoneBadge = 'Guardián Quincenal';
  }
  if (newStreak >= 30 && !claimedRewards.has('streak_milestone_30')) {
    claimedRewards.add('streak_milestone_30');
    unlockedBadges.add('badge_racha_30');
    milestonePoints += 500;
    milestoneBadge = 'Leyenda Mensual de ECO-COLEGIO';
  }

  const longestStreak = Math.max(user.longestStreak || 1, newStreak);

  const updatedUser: UserRecord = {
    ...user,
    streak: newStreak,
    longestStreak,
    lastActiveDateColombia: todayColombia,
    activeDates: Array.from(activeDatesSet),
    claimedRewards: Array.from(claimedRewards),
    unlockedBadges: Array.from(unlockedBadges),
    greenPoints: user.greenPoints + milestonePoints,
    updatedAt: new Date().toISOString(),
  };

  return {
    updatedUser,
    streakIncremented,
    milestonePoints,
    milestoneBadge,
    message: getStreakMotivationalMessage(newStreak),
  };
}

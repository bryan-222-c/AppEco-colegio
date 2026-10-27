import confetti from 'canvas-confetti';
import { UserProfile, PlacedSchoolItem } from '../types/eco';
import { ALL_BADGES } from '../data/badges';
import { sounds } from './audio';

const STORAGE_KEY = 'eco_colegio_user_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  playerName: 'Super Guardián',
  avatarId: 'eco_sprout',
  greenPoints: 60, // Starting bonus so kids can immediately try building or rewarding
  wasteClassifiedCount: 0,
  quizCorrectCount: 0,
  completedMissions: [],
  completedChallenges: [],
  unlockedBadgeIds: ['badge_reciclaje'], // Initial badge to encourage them
  placedSchoolItems: [
    { instanceId: 'init_1', catalogId: 'dec_guayacan', x: 20, y: 35 },
    { instanceId: 'init_2', catalogId: 'dec_estacion_reciclaje', x: 75, y: 40 },
  ],
};

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save ECO-COLEGIO profile', err);
  }
}

export function triggerConfetti(originY = 0.6) {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: originY },
      colors: ['#10b981', '#06b6d4', '#facc15', '#3b82f6', '#34d399', '#f97316'],
    });
  } catch {
    // Canvas confetti fallback
  }
}

export function triggerCelebrationBurst() {
  triggerConfetti(0.5);
  setTimeout(() => triggerConfetti(0.4), 250);
  sounds.playFanfare();
}

// Calculate user level & title
export function getLevelInfo(points: number) {
  const levels = [
    { level: 1, name: 'Semillita Verde', min: 0, max: 100, icon: '🌱' },
    { level: 2, name: 'Brote Explorador', min: 100, max: 250, icon: '🌿' },
    { level: 3, name: 'Defensor del Patio', min: 250, max: 450, icon: '🍀' },
    { level: 4, name: 'Guardián del Agua', min: 450, max: 700, icon: '💧' },
    { level: 5, name: 'Héroe del Reciclaje', min: 700, max: 1000, icon: '🏅' },
    { level: 6, name: 'Maestro del Eco-Colegio', min: 1000, max: 1500, icon: '👑' },
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].min) {
      const cur = levels[i];
      const progress = Math.min(100, Math.round(((points - cur.min) / (cur.max - cur.min)) * 100));
      return { ...cur, progress };
    }
  }

  return { level: 1, name: 'Semillita Verde', min: 0, max: 100, icon: '🌱', progress: 0 };
}

// Check and award badges
export function evaluateBadges(
  profile: UserProfile,
  onBadgeAwarded?: (badgeTitle: string) => void
): UserProfile {
  const unlocked = new Set(profile.unlockedBadgeIds);
  let updated = false;

  // Badge 1: Reciclaje
  if (profile.wasteClassifiedCount >= 4 && !unlocked.has('badge_reciclaje')) {
    unlocked.add('badge_reciclaje');
    updated = true;
    onBadgeAwarded?.('Héroe del Reciclaje');
  }

  // Badge 2: Agua (missions solved with agua or tap)
  const waterMissions = profile.completedMissions.filter(m => m.includes('grifo') || m.includes('agua') || m.includes('lavamanos'));
  if (waterMissions.length >= 2 && !unlocked.has('badge_agua')) {
    unlocked.add('badge_agua');
    updated = true;
    onBadgeAwarded?.('Guardián del Agua');
  }

  // Badge 3: Experto en Residuos (quiz correct >= 5)
  if (profile.quizCorrectCount >= 5 && !unlocked.has('badge_residuos')) {
    unlocked.add('badge_residuos');
    updated = true;
    onBadgeAwarded?.('Experto en Residuos');
  }

  // Badge 4: Detective del Colegio Limpio (missions count >= 5)
  if (profile.completedMissions.length >= 6 && !unlocked.has('badge_misiones')) {
    unlocked.add('badge_misiones');
    updated = true;
    onBadgeAwarded?.('Detective del Colegio Limpio');
  }

  // Badge 5: Arquitecto del Planeta (placed school items >= 4)
  if (profile.placedSchoolItems.length >= 4 && !unlocked.has('badge_constructor')) {
    unlocked.add('badge_constructor');
    updated = true;
    onBadgeAwarded?.('Arquitecto del Planeta');
  }

  // Badge 6: Campeón Eco-Colegio (challenges >= 2)
  if (profile.completedChallenges.length >= 2 && !unlocked.has('badge_diario')) {
    unlocked.add('badge_diario');
    updated = true;
    onBadgeAwarded?.('Campeón Eco-Colegio');
  }

  if (updated) {
    const next = { ...profile, unlockedBadgeIds: Array.from(unlocked) };
    saveProfile(next);
    return next;
  }

  return profile;
}

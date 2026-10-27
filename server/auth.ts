import crypto from 'crypto';
import { db, UserRecord, SessionRecord } from './db';
import { getColombiaDateString } from './streaks';

const ITERATIONS = 10000;
const KEY_LEN = 64;
const DIGEST = 'sha512';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Compute level based on green points (Levels 1 to 5 as defined in user prompt)
export function computeLevel(points: number): { level: number; name: string } {
  if (points >= 1000) {
    return { level: 5, name: 'Campeón de ECO-COLEGIO' };
  } else if (points >= 500) {
    return { level: 4, name: 'Héroe del reciclaje' };
  } else if (points >= 250) {
    return { level: 3, name: 'Guardián ambiental' };
  } else if (points >= 100) {
    return { level: 2, name: 'Brote verde' };
  } else {
    return { level: 1, name: 'Semilla ecológica' };
  }
}

export function registerUser(username: string, password: string, avatarId = 'eco_sprout'): { user: UserRecord; token: string } {
  const cleanUsername = username.trim();
  if (cleanUsername.length < 3 || cleanUsername.length > 15) {
    throw new Error('El nombre de usuario debe tener entre 3 y 15 caracteres.');
  }

  // Check alphanumeric and underscores/hyphens
  if (!/^[a-zA-Z0-9_\-]+$/.test(cleanUsername)) {
    throw new Error('El nombre de usuario solo puede tener letras, números o guiones.');
  }

  if (password.length < 4) {
    throw new Error('La contraseña debe tener al menos 4 caracteres.');
  }

  const existing = db.getUserByUsername(cleanUsername);
  if (existing) {
    throw new Error('Ese nombre de usuario ya está registrado por otro estudiante. ¡Elige uno diferente!');
  }

  const salt = generateSalt();
  const passwordHash = hashPassword(password, salt);
  const id = `user_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const nowStr = new Date().toISOString();
  const colombiaDate = getColombiaDateString();

  const user: UserRecord = {
    id,
    username: cleanUsername,
    passwordHash,
    salt,
    avatarId,
    greenPoints: 0,
    weeklyPoints: 0,
    level: 1,
    levelName: 'Semilla ecológica',
    streak: 1,
    longestStreak: 1,
    lastActiveDateColombia: colombiaDate,
    activeDates: [colombiaDate],
    claimedRewards: [],
    unlockedBadges: ['badge_semilla'],
    completedMissions: [],
    completedChallenges: [],
    completedLessons: [],
    placedSchoolItems: [],
    createdAt: nowStr,
    updatedAt: nowStr,
    lastPointTimestamp: Date.now(),
  };

  db.saveUser(user);

  const token = generateToken();
  const session: SessionRecord = {
    token,
    userId: user.id,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  db.saveSession(session);

  return { user, token };
}

export function loginUser(username: string, password: string): { user: UserRecord; token: string } {
  const user = db.getUserByUsername(username);
  if (!user) {
    throw new Error('Usuario no encontrado. Revisa el nombre o crea una cuenta nueva.');
  }

  const inputHash = hashPassword(password, user.salt);
  if (inputHash !== user.passwordHash) {
    throw new Error('Contraseña incorrecta. Intenta nuevamente.');
  }

  const token = generateToken();
  const session: SessionRecord = {
    token,
    userId: user.id,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  db.saveSession(session);

  return { user, token };
}

export function sanitizeUser(user: UserRecord, rank = 1) {
  return {
    id: user.id,
    username: user.username,
    avatarId: user.avatarId,
    greenPoints: user.greenPoints,
    weeklyPoints: user.weeklyPoints,
    level: user.level,
    levelName: user.levelName,
    streak: user.streak,
    longestStreak: user.longestStreak,
    lastActiveDateColombia: user.lastActiveDateColombia,
    activeDates: user.activeDates,
    claimedRewards: user.claimedRewards,
    unlockedBadges: user.unlockedBadges,
    completedMissions: user.completedMissions,
    completedChallenges: user.completedChallenges,
    completedLessons: user.completedLessons,
    placedSchoolItems: user.placedSchoolItems,
    rank,
    createdAt: user.createdAt,
  };
}

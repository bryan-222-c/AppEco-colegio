import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, UserRecord } from './server/db';
import { registerUser, loginUser, sanitizeUser, computeLevel } from './server/auth';
import { evaluateUserStreak, getColombiaDateString } from './server/streaks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Authentication Middleware
interface AuthenticatedRequest extends Request {
  user?: UserRecord;
  token?: string;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado. Por favor inicia sesión.' });
  }

  const token = authHeader.split(' ')[1];
  const session = db.getSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Sesión expirada o inválida. Por favor ingresa de nuevo.' });
  }

  const user = db.getUserById(session.userId);
  if (!user) {
    return res.status(401).json({ error: 'Usuario no encontrado.' });
  }

  req.user = user;
  req.token = token;
  next();
}

// Helpers for ranking calculations
function getRankedUsersList(mode: 'general' | 'weekly') {
  const allUsers = db.getAllUsers();

  const sorted = [...allUsers].sort((a, b) => {
    const pointsA = mode === 'weekly' ? (a.weeklyPoints ?? a.greenPoints) : a.greenPoints;
    const pointsB = mode === 'weekly' ? (b.weeklyPoints ?? b.greenPoints) : b.greenPoints;

    if (pointsB !== pointsA) {
      return pointsB - pointsA;
    }
    // Tie-breaker: who reached the score first
    return (a.lastPointTimestamp || 0) - (b.lastPointTimestamp || 0);
  });

  return sorted.map((user, idx) => ({
    rank: idx + 1,
    id: user.id,
    username: user.username,
    avatarId: user.avatarId,
    greenPoints: user.greenPoints,
    weeklyPoints: user.weeklyPoints ?? user.greenPoints,
    level: user.level,
    levelName: user.levelName,
    streak: user.streak,
  }));
}

function getUserRank(userId: string): number {
  const list = getRankedUsersList('general');
  const foundIdx = list.findIndex(u => u.id === userId);
  return foundIdx >= 0 ? foundIdx + 1 : 1;
}

// ----------------- API ROUTES ----------------- //

// 1. Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { username, password, confirmPassword, avatarId } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Por favor completa todos los campos.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden. ¡Revisa con cuidado!' });
    }

    const { user, token } = registerUser(username, password, avatarId || 'eco_sprout');
    const rank = getUserRank(user.id);

    return res.json({
      user: sanitizeUser(user, rank),
      token,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al registrar la cuenta.';
    return res.status(400).json({ error: msg });
  }
});

// 2. Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Ingresa tu nombre de usuario y contraseña.' });
    }

    const { user, token } = loginUser(username, password);

    // Evaluate streak on login
    const streakResult = evaluateUserStreak(user);
    db.saveUser(streakResult.updatedUser);

    const rank = getUserRank(user.id);

    return res.json({
      user: sanitizeUser(streakResult.updatedUser, rank),
      token,
      streakInfo: {
        message: streakResult.message,
        milestonePoints: streakResult.milestonePoints,
        milestoneBadge: streakResult.milestoneBadge,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al iniciar sesión.';
    return res.status(400).json({ error: msg });
  }
});

// 3. Logout
app.post('/api/auth/logout', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (req.token) {
    db.deleteSession(req.token);
  }
  return res.json({ success: true, message: 'Sesión cerrada con éxito.' });
});

// 4. Current User (Me)
app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const rank = getUserRank(user.id);
  return res.json({
    user: sanitizeUser(user, rank),
  });
});

// 5. Update Avatar
app.post('/api/profile/update-avatar', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { avatarId } = req.body;
  if (!avatarId) {
    return res.status(400).json({ error: 'Avatar no válido.' });
  }

  user.avatarId = avatarId;
  user.updatedAt = new Date().toISOString();
  db.saveUser(user);

  const rank = getUserRank(user.id);
  return res.json({ user: sanitizeUser(user, rank) });
});

// 6. Claim Reward / Add Points
app.post('/api/rewards/claim', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { activityId, activityType, points, metadata } = req.body;

  if (!activityId || !activityType || typeof points !== 'number') {
    return res.status(400).json({ error: 'Datos de actividad incompletos.' });
  }

  // Safe reward bounds per user prompt:
  // Waste: 10, Quiz: 10, Mission: 25, Daily Challenge: 30, Lesson: 15, Badge: 50
  const claimedRewards = new Set(user.claimedRewards || []);

  // Check if non-repeatable activity already claimed to prevent reload hacking
  if (claimedRewards.has(activityId)) {
    const rank = getUserRank(user.id);
    return res.json({
      success: false,
      alreadyClaimed: true,
      message: '¡Esta actividad ya fue completada y recompensada!',
      user: sanitizeUser(user, rank),
      pointsAwarded: 0,
    });
  }

  // Mark as claimed
  claimedRewards.add(activityId);

  // Update specific lists
  const completedMissions = new Set(user.completedMissions || []);
  const completedChallenges = new Set(user.completedChallenges || []);
  const completedLessons = new Set(user.completedLessons || []);
  const unlockedBadges = new Set(user.unlockedBadges || []);

  if (activityType === 'mission') {
    completedMissions.add(activityId);
  } else if (activityType === 'daily_challenge') {
    completedChallenges.add(activityId);
  } else if (activityType === 'lesson') {
    completedLessons.add(activityId);
  } else if (activityType === 'badge' && metadata?.badgeId) {
    unlockedBadges.add(metadata.badgeId);
  }

  // Recalculate points
  const newGreenPoints = user.greenPoints + Math.max(0, points);
  const newWeeklyPoints = (user.weeklyPoints || 0) + Math.max(0, points);
  const levelData = computeLevel(newGreenPoints);

  // Evaluate streak during valid active participation
  const streakResult = evaluateUserStreak(user);
  let finalUser = streakResult.updatedUser;

  finalUser = {
    ...finalUser,
    greenPoints: newGreenPoints + streakResult.milestonePoints,
    weeklyPoints: newWeeklyPoints + streakResult.milestonePoints,
    level: levelData.level,
    levelName: levelData.name,
    claimedRewards: Array.from(claimedRewards),
    completedMissions: Array.from(completedMissions),
    completedChallenges: Array.from(completedChallenges),
    completedLessons: Array.from(completedLessons),
    unlockedBadges: Array.from(new Set([...Array.from(unlockedBadges), ...finalUser.unlockedBadges])),
    lastPointTimestamp: Date.now(),
    updatedAt: new Date().toISOString(),
  };

  db.saveUser(finalUser);
  const rank = getUserRank(finalUser.id);

  return res.json({
    success: true,
    user: sanitizeUser(finalUser, rank),
    pointsAwarded: points + streakResult.milestonePoints,
    streakInfo: {
      streak: finalUser.streak,
      longestStreak: finalUser.longestStreak,
      message: streakResult.message,
      milestoneBadge: streakResult.milestoneBadge,
    },
  });
});

// 7. Save Virtual School Items
app.post('/api/school/save-items', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { items, pointsCost } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Lista de elementos inválida.' });
  }

  const cost = typeof pointsCost === 'number' ? Math.max(0, pointsCost) : 0;
  if (cost > user.greenPoints) {
    return res.status(400).json({ error: 'No tienes suficientes Puntos Verdes.' });
  }

  user.placedSchoolItems = items;
  user.greenPoints -= cost;
  const levelData = computeLevel(user.greenPoints);
  user.level = levelData.level;
  user.levelName = levelData.name;
  user.updatedAt = new Date().toISOString();

  db.saveUser(user);
  const rank = getUserRank(user.id);

  return res.json({
    success: true,
    user: sanitizeUser(user, rank),
  });
});

// 8. Ranking General
app.get('/api/ranking/general', (_req: Request, res: Response) => {
  const list = getRankedUsersList('general');
  return res.json({ ranking: list });
});

// 9. Ranking Semanal
app.get('/api/ranking/weekly', (_req: Request, res: Response) => {
  const list = getRankedUsersList('weekly');
  return res.json({ ranking: list });
});

// ----------------- VITE INTEGRATION ----------------- //
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ECO-COLEGIO Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export interface StudentProfile {
  id: string;
  username: string;
  avatarId: string;
  greenPoints: number;
  weeklyPoints: number;
  level: number;
  levelName: string;
  streak: number;
  longestStreak: number;
  lastActiveDateColombia: string;
  activeDates: string[];
  claimedRewards: string[];
  unlockedBadges: string[];
  completedMissions: string[];
  completedChallenges: string[];
  completedLessons: string[];
  placedSchoolItems: Array<{
    instanceId: string;
    catalogId: string;
    x: number;
    y: number;
  }>;
  rank: number;
  createdAt: string;
}

export interface RankedUser {
  rank: number;
  id: string;
  username: string;
  avatarId: string;
  greenPoints: number;
  weeklyPoints: number;
  level: number;
  levelName: string;
  streak: number;
}

const TOKEN_KEY = 'eco_auth_token_v1';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Ocurrió un error en la solicitud.');
  }
  return data;
}

export const api = {
  async register(username: string, password: string, confirmPassword: string, avatarId = 'eco_sprout') {
    const data = await request<{ user: StudentProfile; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, confirmPassword, avatarId }),
    });
    setStoredToken(data.token);
    return data;
  },

  async login(username: string, password: string) {
    const data = await request<{
      user: StudentProfile;
      token: string;
      streakInfo?: { message: string; milestonePoints: number; milestoneBadge: string | null };
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setStoredToken(data.token);
    return data;
  },

  async logout() {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      setStoredToken(null);
    }
  },

  async getMe() {
    return request<{ user: StudentProfile }>('/api/auth/me');
  },

  async updateAvatar(avatarId: string) {
    return request<{ user: StudentProfile }>('/api/profile/update-avatar', {
      method: 'POST',
      body: JSON.stringify({ avatarId }),
    });
  },

  async claimReward(
    activityId: string,
    activityType: 'waste' | 'mission' | 'quiz' | 'daily_challenge' | 'lesson' | 'badge',
    points: number,
    metadata?: Record<string, any>
  ) {
    return request<{
      success: boolean;
      alreadyClaimed?: boolean;
      message?: string;
      user: StudentProfile;
      pointsAwarded: number;
      streakInfo?: {
        streak: number;
        longestStreak: number;
        message: string;
        milestoneBadge: string | null;
      };
    }>('/api/rewards/claim', {
      method: 'POST',
      body: JSON.stringify({ activityId, activityType, points, metadata }),
    });
  },

  async saveSchoolItems(items: StudentProfile['placedSchoolItems'], pointsCost = 0) {
    return request<{ success: boolean; user: StudentProfile }>('/api/school/save-items', {
      method: 'POST',
      body: JSON.stringify({ items, pointsCost }),
    });
  },

  async getGeneralRanking() {
    return request<{ ranking: RankedUser[] }>('/api/ranking/general');
  },

  async getWeeklyRanking() {
    return request<{ ranking: RankedUser[] }>('/api/ranking/weekly');
  },
};

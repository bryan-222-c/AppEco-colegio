import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  avatarId: string;
  greenPoints: number;
  weeklyPoints: number;
  level: number;
  levelName: string;
  streak: number;
  longestStreak: number;
  lastActiveDateColombia: string;
  activeDates: string[]; // List of YYYY-MM-DD
  claimedRewards: string[]; // IDs of rewards already claimed
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
  createdAt: string;
  updatedAt: string;
  lastPointTimestamp: number;
}

export interface SessionRecord {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

interface DatabaseSchema {
  users: Record<string, UserRecord>;
  sessions: Record<string, SessionRecord>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'ecodb.json');

const INITIAL_DB: DatabaseSchema = {
  users: {},
  sessions: {},
};

class Database {
  private data: DatabaseSchema = INITIAL_DB;
  private isLoaded = false;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = {
          users: {},
          sessions: {},
        };
        this.persistSync();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Error initializing database:', err);
      this.data = INITIAL_DB;
    }
  }

  private persistSync() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error writing database to disk:', err);
    }
  }

  // Users
  public getUserById(id: string): UserRecord | null {
    return this.data.users[id] || null;
  }

  public getUserByUsername(username: string): UserRecord | null {
    const lower = username.trim().toLowerCase();
    const found = Object.values(this.data.users).find(
      u => u.username.toLowerCase() === lower
    );
    return found || null;
  }

  public saveUser(user: UserRecord): void {
    this.data.users[user.id] = user;
    this.persistSync();
  }

  public getAllUsers(): UserRecord[] {
    return Object.values(this.data.users);
  }

  // Sessions
  public saveSession(session: SessionRecord): void {
    this.data.sessions[session.token] = session;
    this.persistSync();
  }

  public getSession(token: string): SessionRecord | null {
    const session = this.data.sessions[token];
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      delete this.data.sessions[token];
      this.persistSync();
      return null;
    }
    return session;
  }

  public deleteSession(token: string): void {
    if (this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.persistSync();
    }
  }
}

export const db = new Database();

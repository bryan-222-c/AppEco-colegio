export interface LevelDef {
  level: number;
  name: string;
  min: number;
  max: number;
  icon: string;
  color: string;
}

export const ECO_LEVELS: LevelDef[] = [
  { level: 1, name: 'Semilla ecológica', min: 0, max: 100, icon: '🌱', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' },
  { level: 2, name: 'Brote verde', min: 100, max: 250, icon: '🌿', color: 'text-teal-700 bg-teal-100 border-teal-300' },
  { level: 3, name: 'Guardián ambiental', min: 250, max: 500, icon: '🍀', color: 'text-sky-700 bg-sky-100 border-sky-300' },
  { level: 4, name: 'Héroe del reciclaje', min: 500, max: 1000, icon: '🏅', color: 'text-amber-800 bg-amber-100 border-amber-300' },
  { level: 5, name: 'Campeón de ECO-COLEGIO', min: 1000, max: 2000, icon: '👑', color: 'text-purple-800 bg-purple-100 border-purple-300' },
];

export function getLevelData(points: number) {
  for (let i = ECO_LEVELS.length - 1; i >= 0; i--) {
    if (points >= ECO_LEVELS[i].min) {
      const cur = ECO_LEVELS[i];
      const range = cur.max - cur.min;
      const progress = Math.min(100, Math.max(0, Math.round(((points - cur.min) / range) * 100)));
      return {
        ...cur,
        progress,
        pointsToNext: Math.max(0, cur.max - points),
      };
    }
  }

  return {
    ...ECO_LEVELS[0],
    progress: 0,
    pointsToNext: 100,
  };
}

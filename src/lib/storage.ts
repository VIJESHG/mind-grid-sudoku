import { ActiveGameState, Difficulty, FullStatsRecord, GameStats, GridSize, Settings } from '../types';

const STATS_KEY = 'mindgrid_stats_v2';
const ACTIVE_GAME_KEY = 'mindgrid_active_game_v2';
const SETTINGS_KEY = 'mindgrid_settings_v2';

const createEmptyStats = (): GameStats => ({
  gamesPlayed: 0,
  gamesCompleted: 0,
  bestTimeSeconds: null,
  totalTimeSeconds: 0,
  currentStreak: 0,
  bestStreak: 0,
});

const createEmptyDifficultyStats = () => ({
  easy: createEmptyStats(),
  medium: createEmptyStats(),
  hard: createEmptyStats(),
  expert: createEmptyStats(),
});

export const DEFAULT_STATS: FullStatsRecord = {
  '6x6': createEmptyDifficultyStats(),
  '9x9': createEmptyDifficultyStats(),
};

export const DEFAULT_SETTINGS: Settings = {
  highlightDuplicates: true,
  highlightSameNumber: true,
  highlightRelatedCells: true,
  autoRemoveNotes: true,
  maxMistakesEnabled: true,
  theme: 'slate',
};

export function loadStats(): FullStatsRecord {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      '6x6': { ...createEmptyDifficultyStats(), ...(parsed['6x6'] || {}) },
      '9x9': { ...createEmptyDifficultyStats(), ...(parsed['9x9'] || {}) },
    };
  } catch (err) {
    console.error('Failed to load stats from localStorage:', err);
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: FullStatsRecord): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats to localStorage:', err);
  }
}

export function recordGameResult(
  gridSize: GridSize,
  difficulty: Difficulty,
  completed: boolean,
  timeSeconds: number
): FullStatsRecord {
  const currentStats = loadStats();
  const diffStats = { ...currentStats[gridSize][difficulty] };

  diffStats.gamesPlayed += 1;

  if (completed) {
    diffStats.gamesCompleted += 1;
    diffStats.totalTimeSeconds += timeSeconds;
    diffStats.currentStreak += 1;
    if (diffStats.currentStreak > diffStats.bestStreak) {
      diffStats.bestStreak = diffStats.currentStreak;
    }
    if (
      diffStats.bestTimeSeconds === null ||
      timeSeconds < diffStats.bestTimeSeconds
    ) {
      diffStats.bestTimeSeconds = timeSeconds;
    }
  } else {
    diffStats.currentStreak = 0;
  }

  const updatedStats: FullStatsRecord = {
    ...currentStats,
    [gridSize]: {
      ...currentStats[gridSize],
      [difficulty]: diffStats,
    },
  };

  saveStats(updatedStats);
  return updatedStats;
}

export function resetStats(): FullStatsRecord {
  saveStats(DEFAULT_STATS);
  return DEFAULT_STATS;
}

export function loadActiveGame(): ActiveGameState | null {
  try {
    const raw = localStorage.getItem(ACTIVE_GAME_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActiveGameState;
  } catch (err) {
    console.error('Failed to load active game:', err);
    return null;
  }
}

export function saveActiveGame(game: ActiveGameState): void {
  try {
    localStorage.setItem(ACTIVE_GAME_KEY, JSON.stringify(game));
  } catch (err) {
    console.error('Failed to save active game:', err);
  }
}

export function clearActiveGame(): void {
  try {
    localStorage.removeItem(ACTIVE_GAME_KEY);
  } catch (err) {
    console.error('Failed to clear active game:', err);
  }
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load settings:', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

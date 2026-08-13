export type GridSize = '6x6' | '9x9';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface GridConfig {
  size: 6 | 9;
  boxRows: number; // For 6x6: 2 rows; for 9x9: 3 rows
  boxCols: number; // For 6x6: 3 cols; for 9x9: 3 cols
  maxNum: number;
}

export interface Cell {
  row: number;
  col: number;
  value: number; // 0 for empty, 1..maxNum for filled
  solution: number; // Correct solution value
  given: boolean; // Initial clue provided by puzzle
  notes: number[]; // Array of pencil mark numbers [1..maxNum]
  isError?: boolean; // Incorrect input compared to solution or rules
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface MoveRecord {
  row: number;
  col: number;
  prevValue: number;
  newValue: number;
  prevNotes: number[];
  newNotes: number[];
}

export interface GameStats {
  gamesPlayed: number;
  gamesCompleted: number;
  bestTimeSeconds: number | null; // null if no completion yet
  totalTimeSeconds: number; // Used to calculate average time
  currentStreak: number;
  bestStreak: number;
}

export type DifficultyStats = Record<Difficulty, GameStats>;

export type FullStatsRecord = Record<GridSize, DifficultyStats>;

export interface ActiveGameState {
  gridSize: GridSize;
  difficulty: Difficulty;
  board: {
    row: number;
    col: number;
    value: number;
    solution: number;
    given: boolean;
    notes: number[];
  }[][];
  solutionBoard: number[][];
  timerSeconds: number;
  mistakes: number;
  hintsUsed?: number;
  isCompleted: boolean;
  history: MoveRecord[];
  createdAt: number;
}

export interface Settings {
  highlightDuplicates: boolean;
  highlightSameNumber: boolean;
  highlightRelatedCells: boolean;
  autoRemoveNotes: boolean;
  maxMistakesEnabled: boolean; // limit to 3 mistakes if true
  theme: 'slate' | 'emerald' | 'amber' | 'indigo' | 'dark';
}

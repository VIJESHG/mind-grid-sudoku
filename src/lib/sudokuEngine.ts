import { Difficulty, GridConfig, GridSize } from '../types';

export function getGridConfig(gridSize: GridSize): GridConfig {
  if (gridSize === '6x6') {
    return {
      size: 6,
      boxRows: 2,
      boxCols: 3,
      maxNum: 6,
    };
  }
  return {
    size: 9,
    boxRows: 3,
    boxCols: 3,
    maxNum: 9,
  };
}

export function createEmptyBoard(size: number): number[][] {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

/**
  * Check if placing `num` at `(row, col)` on `board` is valid.
  */
export function isValidPlacement(
  board: number[][],
  row: number,
  col: number,
  num: number,
  boxRows: number,
  boxCols: number
): boolean {
  const size = board.length;

  // Check row
  for (let c = 0; c < size; c++) {
    if (c !== col && board[row][c] === num) {
      return false;
    }
  }

  // Check column
  for (let r = 0; r < size; r++) {
    if (r !== row && board[r][col] === num) {
      return false;
    }
  }

  // Check subgrid / box
  const startRow = Math.floor(row / boxRows) * boxRows;
  const startCol = Math.floor(col / boxCols) * boxCols;

  for (let r = startRow; r < startRow + boxRows; r++) {
    for (let c = startCol; c < startCol + boxCols; c++) {
      if ((r !== row || c !== col) && board[r][c] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Shuffle array helper
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Counts up to `limit` valid solutions for a given board using backtracking.
 */
export function countSolutions(
  board: number[][],
  boxRows: number,
  boxCols: number,
  limit: number = 2
): number {
  const size = board.length;
  let count = 0;

  // Find first empty cell
  let targetRow = -1;
  let targetCol = -1;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) {
        targetRow = r;
        targetCol = c;
        break;
      }
    }
    if (targetRow !== -1) break;
  }

  // Base case: board is completely filled
  if (targetRow === -1) {
    return 1;
  }

  for (let num = 1; num <= size; num++) {
    if (isValidPlacement(board, targetRow, targetCol, num, boxRows, boxCols)) {
      board[targetRow][targetCol] = num;
      count += countSolutions(board, boxRows, boxCols, limit - count);
      board[targetRow][targetCol] = 0;

      if (count >= limit) {
        return count;
      }
    }
  }

  return count;
}

/**
 * Solves the board in place, returns boolean indicating success.
 */
export function solveBoard(
  board: number[][],
  boxRows: number,
  boxCols: number
): boolean {
  const size = board.length;

  let targetRow = -1;
  let targetCol = -1;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) {
        targetRow = r;
        targetCol = c;
        break;
      }
    }
    if (targetRow !== -1) break;
  }

  if (targetRow === -1) return true;

  const numbers = shuffle(Array.from({ length: size }, (_, i) => i + 1));

  for (const num of numbers) {
    if (isValidPlacement(board, targetRow, targetCol, num, boxRows, boxCols)) {
      board[targetRow][targetCol] = num;
      if (solveBoard(board, boxRows, boxCols)) {
        return true;
      }
      board[targetRow][targetCol] = 0;
    }
  }

  return false;
}

/**
 * Generate a complete valid solved Sudoku board.
 */
export function generateFullBoard(size: 6 | 9, boxRows: number, boxCols: number): number[][] {
  const board = createEmptyBoard(size);
  solveBoard(board, boxRows, boxCols);
  return board;
}

/**
 * Calculate target clues given for size and difficulty.
 */
export function getTargetClues(size: 6 | 9, difficulty: Difficulty): number {
  if (size === 6) {
    switch (difficulty) {
      case 'easy':
        return 23; // ~13 empty
      case 'medium':
        return 19; // ~17 empty
      case 'hard':
        return 16; // ~20 empty
      case 'expert':
        return 14; // ~22 empty
    }
  } else {
    switch (difficulty) {
      case 'easy':
        return 44; // ~37 empty
      case 'medium':
        return 36; // ~45 empty
      case 'hard':
        return 30; // ~51 empty
      case 'expert':
        return 24; // ~57 empty
    }
  }
}

/**
 * Generate a valid puzzle with a guaranteed unique solution.
 */
export function generatePuzzle(
  gridSize: GridSize,
  difficulty: Difficulty
): { initialBoard: number[][]; solutionBoard: number[][] } {
  const config = getGridConfig(gridSize);
  const size = config.size;
  const boxRows = config.boxRows;
  const boxCols = config.boxCols;

  const solutionBoard = generateFullBoard(size, boxRows, boxCols);
  const puzzleBoard = solutionBoard.map((row) => [...row]);

  const targetClues = getTargetClues(size, difficulty);

  // Generate list of all cell positions
  const positions: Array<[number, number]> = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      positions.push([r, c]);
    }
  }

  const shuffledPositions = shuffle(positions);
  let currentClues = size * size;

  for (const [r, c] of shuffledPositions) {
    if (currentClues <= targetClues) {
      break;
    }

    const removedVal = puzzleBoard[r][c];
    puzzleBoard[r][c] = 0;

    // Check if puzzle still has unique solution
    const boardCopy = puzzleBoard.map((row) => [...row]);
    const numSolutions = countSolutions(boardCopy, boxRows, boxCols, 2);

    if (numSolutions === 1) {
      currentClues--;
    } else {
      // Restore value
      puzzleBoard[r][c] = removedVal;
    }
  }

  return {
    initialBoard: puzzleBoard,
    solutionBoard,
  };
}

/**
 * Calculates possible candidates (1..maxNum) for every empty cell in board.
 */
export function getCandidateNotesForBoard(
  board: number[][],
  boxRows: number,
  boxCols: number
): number[][][] {
  const size = board.length;
  const candidateMap: number[][][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => [])
  );

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) {
        const candidates: number[] = [];
        for (let num = 1; num <= size; num++) {
          if (isValidPlacement(board, r, c, num, boxRows, boxCols)) {
            candidates.push(num);
          }
        }
        candidateMap[r][c] = candidates;
      }
    }
  }

  return candidateMap;
}

/**
 * Find a logical hint for the user:
 * 1. Find if there are any current wrong user inputs.
 * 2. Find a cell with a single logical candidate (naked single).
 * 3. Fallback: reveal the solution for the selected or first empty cell.
 */
export interface HintResult {
  row: number;
  col: number;
  value: number;
  type: 'fix_error' | 'naked_single' | 'reveal';
  message: string;
}

export function getSmartHint(
  currentValues: number[][],
  solutionBoard: number[][],
  boxRows: number,
  boxCols: number,
  selectedCell: { row: number; col: number } | null
): HintResult | null {
  const size = currentValues.length;

  // 1. Check for incorrect filled cells
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const val = currentValues[r][c];
      if (val !== 0 && val !== solutionBoard[r][c]) {
        return {
          row: r,
          col: c,
          value: solutionBoard[r][c],
          type: 'fix_error',
          message: `Corrected incorrect entry at row ${r + 1}, column ${c + 1}.`,
        };
      }
    }
  }

  // 2. Look for naked singles (cells with only 1 valid candidate placement)
  const candidateMap = getCandidateNotesForBoard(currentValues, boxRows, boxCols);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (currentValues[r][c] === 0 && candidateMap[r][c].length === 1) {
        const correctVal = candidateMap[r][c][0];
        return {
          row: r,
          col: c,
          value: correctVal,
          type: 'naked_single',
          message: `Only option for row ${r + 1}, column ${c + 1} is ${correctVal}.`,
        };
      }
    }
  }

  // 3. Fallback: prioritize selected cell if empty, otherwise pick first empty cell
  if (selectedCell && currentValues[selectedCell.row][selectedCell.col] === 0) {
    const r = selectedCell.row;
    const c = selectedCell.col;
    return {
      row: r,
      col: c,
      value: solutionBoard[r][c],
      type: 'reveal',
      message: `Revealed value for row ${r + 1}, column ${c + 1}.`,
    };
  }

  // Pick first empty cell
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (currentValues[r][c] === 0) {
        return {
          row: r,
          col: c,
          value: solutionBoard[r][c],
          type: 'reveal',
          message: `Revealed value for row ${r + 1}, column ${c + 1}.`,
        };
      }
    }
  }

  return null;
}

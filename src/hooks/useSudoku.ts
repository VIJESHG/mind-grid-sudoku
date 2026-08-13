import confetti from 'canvas-confetti';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getCandidateNotesForBoard,
  getGridConfig,
  getSmartHint,
  generatePuzzle,
  isValidPlacement,
} from '../lib/sudokuEngine';
import {
  clearActiveGame,
  loadActiveGame,
  loadSettings,
  loadStats,
  recordGameResult,
  saveActiveGame,
  saveSettings,
} from '../lib/storage';
import {
  Cell,
  CellPosition,
  Difficulty,
  FullStatsRecord,
  GridSize,
  MoveRecord,
  Settings,
} from '../types';

export function useSudoku() {
  // Read URL query parameters if present
  const getInitialParams = (): { size: GridSize; difficulty: Difficulty } => {
    const params = new URLSearchParams(window.location.search);
    const rawSize = params.get('size');
    const rawDiff = params.get('difficulty');

    const size: GridSize = rawSize === '6' || rawSize === '6x6' ? '6x6' : '9x9';
    const validDiffs: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
    const difficulty: Difficulty = validDiffs.includes(rawDiff as Difficulty)
      ? (rawDiff as Difficulty)
      : 'medium';

    return { size, difficulty };
  };

  const initialParams = getInitialParams();

  const [gridSize, setGridSize] = useState<GridSize>(initialParams.size);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialParams.difficulty);
  const [inGame, setInGame] = useState<boolean>(false);

  const [board, setBoard] = useState<Cell[][]>([]);
  const [solutionBoard, setSolutionBoard] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);

  const [isNoteMode, setIsNoteMode] = useState<boolean>(false);
  const [history, setHistory] = useState<MoveRecord[]>([]);

  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  const MAX_HINTS = 3;
  const hintsRemaining = Math.max(0, MAX_HINTS - hintsUsed);

  const [correctStreak, setCorrectStreak] = useState<number>(0);
  const [lastAction, setLastAction] = useState<{
    type: 'correct' | 'mistake' | 'hint' | 'undo';
    timestamp: number;
  } | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [stats, setStats] = useState<FullStatsRecord>(loadStats);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update URL parameters without full page reload
  const updateURLParams = (size: GridSize, diff: Difficulty) => {
    const sizeNum = size === '6x6' ? '6' : '9';
    const newUrl = `${window.location.pathname}?size=${sizeNum}&difficulty=${diff}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  };

  // Timer logic
  useEffect(() => {
    if (inGame && !isPaused && !isCompleted) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inGame, isPaused, isCompleted]);

  // Auto-save active game state
  useEffect(() => {
    if (inGame && !isCompleted && board.length > 0) {
      saveActiveGame({
        gridSize,
        difficulty,
        board: board.map((row) =>
          row.map((cell) => ({
            row: cell.row,
            col: cell.col,
            value: cell.value,
            solution: cell.solution,
            given: cell.given,
            notes: [...cell.notes],
          }))
        ),
        solutionBoard,
        timerSeconds,
        mistakes,
        hintsUsed,
        isCompleted,
        history,
        createdAt: Date.now(),
      });
    }
  }, [board, inGame, isCompleted, timerSeconds, mistakes, hintsUsed, gridSize, difficulty, history, solutionBoard]);

  // Start new game
  const startNewGame = useCallback(
    (size: GridSize = gridSize, diff: Difficulty = difficulty) => {
      setGridSize(size);
      setDifficulty(diff);
      updateURLParams(size, diff);

      const config = getGridConfig(size);
      const generated = generatePuzzle(size, diff);

      const newBoard: Cell[][] = generated.initialBoard.map((row, r) =>
        row.map((val, c) => ({
          row: r,
          col: c,
          value: val,
          solution: generated.solutionBoard[r][c],
          given: val !== 0,
          notes: [],
          isError: false,
        }))
      );

      setBoard(newBoard);
      setSolutionBoard(generated.solutionBoard);
      setSelectedCell(null);
      setHistory([]);
      setTimerSeconds(0);
      setMistakes(0);
      setHintsUsed(0);
      setIsCompleted(false);
      setIsPaused(false);
      setIsGameOver(false);
      setCorrectStreak(0);
      setLastAction(null);
      setHintMessage(null);
      setInGame(true);
      clearActiveGame();
    },
    [gridSize, difficulty]
  );

  // Resume active saved game if available
  const resumeSavedGame = useCallback(() => {
    const saved = loadActiveGame();
    if (!saved) return false;

    setGridSize(saved.gridSize);
    setDifficulty(saved.difficulty);
    updateURLParams(saved.gridSize, saved.difficulty);

    const restoredBoard: Cell[][] = saved.board.map((row) =>
      row.map((cell) => ({
        ...cell,
        isError: cell.value !== 0 && cell.value !== cell.solution,
      }))
    );

    setBoard(restoredBoard);
    setSolutionBoard(saved.solutionBoard);
    setTimerSeconds(saved.timerSeconds);
    setMistakes(saved.mistakes);
    setHintsUsed(saved.hintsUsed ?? 0);
    setIsCompleted(saved.isCompleted);
    setHistory(saved.history || []);
    setSelectedCell(null);
    setIsPaused(false);
    setInGame(true);
    return true;
  }, []);

  // Return to Setup screen
  const exitToSetup = useCallback(() => {
    setInGame(false);
    setIsPaused(false);
  }, []);

  // Update Settings
  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Check board completion
  const checkWinCondition = useCallback(
    (currentBoard: Cell[][]) => {
      const config = getGridConfig(gridSize);
      const size = config.size;

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const cell = currentBoard[r][c];
          if (cell.value === 0 || cell.value !== cell.solution) {
            return false;
          }
        }
      }

      // Victory!
      setIsCompleted(true);
      clearActiveGame();
      const updatedStats = recordGameResult(gridSize, difficulty, true, timerSeconds);
      setStats(updatedStats);

      // Trigger Confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      return true;
    },
    [gridSize, difficulty, timerSeconds]
  );

  // Input number into selected cell
  const inputNumber = useCallback(
    (num: number) => {
      if (!selectedCell || !inGame || isPaused || isCompleted) return;

      const { row, col } = selectedCell;
      const targetCell = board[row][col];

      if (targetCell.given) return; // Cannot edit initial clues

      const config = getGridConfig(gridSize);

      if (isNoteMode) {
        // Toggle note
        const currentNotes = targetCell.notes;
        const newNotes = currentNotes.includes(num)
          ? currentNotes.filter((n) => n !== num)
          : [...currentNotes, num].sort((a, b) => a - b);

        const newBoard = board.map((r, rIdx) =>
          r.map((c, cIdx) => {
            if (rIdx === row && cIdx === col) {
              return { ...c, notes: newNotes };
            }
            return c;
          })
        );

        setHistory((prev) => [
          ...prev,
          {
            row,
            col,
            prevValue: targetCell.value,
            newValue: targetCell.value,
            prevNotes: [...targetCell.notes],
            newNotes,
          },
        ]);

        setBoard(newBoard);
      } else {
        // Value mode
        if (targetCell.value === num) {
          // If already has this value, remove it (toggle off)
          num = 0;
        }

        const isWrong = num !== 0 && num !== targetCell.solution;

        if (isWrong) {
          setCorrectStreak(0);
          setLastAction({ type: 'mistake', timestamp: Date.now() });
          setMistakes((prev) => {
            const nextMistakes = prev + 1;
            if (settings.maxMistakesEnabled && nextMistakes >= 3) {
              setIsGameOver(true);
              setIsPaused(true);
            }
            return nextMistakes;
          });
        } else if (num !== 0) {
          setCorrectStreak((prev) => prev + 1);
          setLastAction({ type: 'correct', timestamp: Date.now() });
        }

        const newBoard = board.map((r, rIdx) =>
          r.map((cell, cIdx) => {
            if (rIdx === row && cIdx === col) {
              return {
                ...cell,
                value: num,
                notes: [],
                isError: isWrong,
              };
            }
            return cell;
          })
        );

        // Auto-remove candidate notes from same row, col, box if enabled
        if (num !== 0 && settings.autoRemoveNotes && !isWrong) {
          const startRow = Math.floor(row / config.boxRows) * config.boxRows;
          const startCol = Math.floor(col / config.boxCols) * config.boxCols;

          for (let r = 0; r < config.size; r++) {
            for (let c = 0; c < config.size; c++) {
              if (r === row || c === col || (r >= startRow && r < startRow + config.boxRows && c >= startCol && c < startCol + config.boxCols)) {
                if (newBoard[r][c].notes.includes(num)) {
                  newBoard[r][c].notes = newBoard[r][c].notes.filter((n) => n !== num);
                }
              }
            }
          }
        }

        setHistory((prev) => [
          ...prev,
          {
            row,
            col,
            prevValue: targetCell.value,
            newValue: num,
            prevNotes: [...targetCell.notes],
            newNotes: [],
          },
        ]);

        setBoard(newBoard);
        setHintMessage(null);

        // Check if game won
        if (num !== 0 && !isWrong) {
          checkWinCondition(newBoard);
        }
      }
    },
    [
      selectedCell,
      inGame,
      isPaused,
      isCompleted,
      board,
      gridSize,
      isNoteMode,
      settings.autoRemoveNotes,
      settings.maxMistakesEnabled,
      checkWinCondition,
    ]
  );

  // Erase cell value and notes
  const eraseCell = useCallback(() => {
    if (!selectedCell || !inGame || isPaused || isCompleted) return;

    const { row, col } = selectedCell;
    const targetCell = board[row][col];

    if (targetCell.given) return;

    if (targetCell.value === 0 && targetCell.notes.length === 0) return;

    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => {
        if (rIdx === row && cIdx === col) {
          return { ...c, value: 0, notes: [], isError: false };
        }
        return c;
      })
    );

    setHistory((prev) => [
      ...prev,
      {
        row,
        col,
        prevValue: targetCell.value,
        newValue: 0,
        prevNotes: [...targetCell.notes],
        newNotes: [],
      },
    ]);

    setBoard(newBoard);
  }, [selectedCell, inGame, isPaused, isCompleted, board]);

  // Undo last action
  const undo = useCallback(() => {
    if (history.length === 0 || !inGame || isPaused || isCompleted) return;

    const lastMove = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => {
        if (rIdx === lastMove.row && cIdx === lastMove.col) {
          return {
            ...c,
            value: lastMove.prevValue,
            notes: [...lastMove.prevNotes],
            isError:
              lastMove.prevValue !== 0 &&
              lastMove.prevValue !== c.solution,
          };
        }
        return c;
      })
    );

    setBoard(newBoard);
    setHistory(newHistory);
  }, [history, inGame, isPaused, isCompleted, board]);

  // Check if any empty cell currently has candidate notes
const hasCandidateNotes = board.some((r) =>
  r.some((c) => c.value === 0 && c.notes.length > 0)
);

// Auto Fill / Clear Candidate Notes (Pencil Marks) for all empty cells
const autoFillNotes = useCallback(() => {
  if (!inGame || isPaused || isCompleted) return;

  if (hasCandidateNotes) {
    // Clear all candidate notes from empty cells
    const newBoard = board.map((r) =>
      r.map((c) => {
        if (c.value === 0 && !c.given) {
          return { ...c, notes: [] };
        }
        return c;
      })
    );
    setBoard(newBoard);
  } else {
    // Auto-fill candidates
    const config = getGridConfig(gridSize);
    const rawValues = board.map((r) => r.map((c) => c.value));
    const candidateMap = getCandidateNotesForBoard(rawValues, config.boxRows, config.boxCols);

    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => {
        if (c.value === 0 && !c.given) {
          return { ...c, notes: candidateMap[rIdx][cIdx] };
        }
        return c;
      })
    );

    setBoard(newBoard);
  }
}, [inGame, isPaused, isCompleted, gridSize, board, hasCandidateNotes]);


  // Get Smart Hint
  const requestHint = useCallback(() => {
    if (!inGame || isPaused || isCompleted) return;

    if (hintsUsed >= MAX_HINTS) {
      setHintMessage('💡 No hints remaining! Max 3 hints allowed per game.');
      return;
    }

    const config = getGridConfig(gridSize);
    const rawValues = board.map((r) => r.map((c) => c.value));

    const hint = getSmartHint(
      rawValues,
      solutionBoard,
      config.boxRows,
      config.boxCols,
      selectedCell
    );

    if (!hint) return;

    setHintsUsed((prev) => prev + 1);
    setLastAction({ type: 'hint', timestamp: Date.now() });
    const remaining = MAX_HINTS - (hintsUsed + 1);
    setHintMessage(
      `${hint.message} (${remaining > 0 ? `${remaining} hint${remaining > 1 ? 's' : ''} left` : 'No hints left'})`
    );
    setSelectedCell({ row: hint.row, col: hint.col });

    // Apply the hint directly to the board
    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => {
        if (rIdx === hint.row && cIdx === hint.col) {
          return {
            ...c,
            value: hint.value,
            notes: [],
            isError: false,
          };
        }
        return c;
      })
    );

    setBoard(newBoard);
    checkWinCondition(newBoard);
  }, [inGame, isPaused, isCompleted, gridSize, board, solutionBoard, selectedCell, checkWinCondition, hintsUsed]);

  // Calculate remaining count for each number button
  const getRemainingNumbers = useCallback(() => {
    const config = getGridConfig(gridSize);
    const counts: Record<number, number> = {};

    for (let n = 1; n <= config.maxNum; n++) {
      counts[n] = config.size; // Total needed per number is grid size (6 or 9)
    }

    for (let r = 0; r < config.size; r++) {
      for (let c = 0; c < config.size; c++) {
        const val = board[r]?.[c]?.value;
        if (val && val >= 1 && val <= config.maxNum) {
          counts[val] = Math.max(0, counts[val] - 1);
        }
      }
    }

    return counts;
  }, [gridSize, board]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!inGame || isPaused || isCompleted) return;

      const maxNum = gridSize === '6x6' ? 6 : 9;

      // Handle numbers 1..maxNum
      const numKey = parseInt(e.key, 10);
      if (!isNaN(numKey) && numKey >= 1 && numKey <= maxNum) {
        inputNumber(numKey);
        return;
      }

      // Arrow navigation
      if (selectedCell) {
        let { row, col } = selectedCell;
        const size = maxNum;

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          row = (row - 1 + size) % size;
          setSelectedCell({ row, col });
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          row = (row + 1) % size;
          setSelectedCell({ row, col });
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          col = (col - 1 + size) % size;
          setSelectedCell({ row, col });
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          col = (col + 1) % size;
          setSelectedCell({ row, col });
        }
      }

      // Actions
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        eraseCell();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsNoteMode((prev) => !prev);
      } else if (e.key === 'z' || e.key === 'Z') {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          undo();
        }
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        requestHint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inGame, isPaused, isCompleted, gridSize, selectedCell, inputNumber, eraseCell, undo, requestHint]);

  // Calculate solved counts and metrics
  const config = getGridConfig(gridSize);
  const totalCells = config.size * config.size;
  let givenCluesCount = 0;
  let userFilledCorrectCount = 0;

  if (board.length > 0 && solutionBoard.length > 0) {
    for (let r = 0; r < config.size; r++) {
      for (let c = 0; c < config.size; c++) {
        const cell = board[r]?.[c];
        if (cell) {
          if (cell.isInitial) {
            givenCluesCount++;
          } else if (cell.value !== null && cell.value === solutionBoard[r]?.[c]) {
            userFilledCorrectCount++;
          }
        }
      }
    }
  }

  const totalToSolve = Math.max(1, totalCells - givenCluesCount);
  const solvedCount = userFilledCorrectCount;

  return {
    gridSize,
    difficulty,
    inGame,
    board,
    solutionBoard,
    selectedCell,
    isNoteMode,
    history,
    timerSeconds,
    isPaused,
    mistakes,
    hintsUsed,
    hintsRemaining,
    MAX_HINTS,
    isCompleted,
    hintMessage,
    settings,
    stats,
    correctStreak,
    lastAction,
    isGameOver,
    solvedCount,
    totalCells,
    totalToSolve,
    setSelectedCell,
    setIsNoteMode,
    setIsPaused,
    startNewGame,
    resumeSavedGame,
    exitToSetup,
    inputNumber,
    eraseCell,
    undo,
    hasCandidateNotes,
    autoFillNotes,
    requestHint,
    updateSettings,
    getRemainingNumbers,
    hasSavedGame: !!loadActiveGame()
  };
}

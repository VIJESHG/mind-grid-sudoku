import React, { useState } from 'react';
import { GameSetupCard } from './components/GameSetupCard';
import { Header } from './components/Header';
import { NumberPad } from './components/NumberPad';
import { PuzzlePulse } from './components/PuzzlePulse';
import { SettingsModal } from './components/SettingsModal';
import { ShareModal } from './components/ShareModal';
import { SolvingProgress } from './components/SolvingProgress';
import { StatisticsModal } from './components/StatisticsModal';
import { SudokuBoard } from './components/SudokuBoard';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { useSudoku } from './hooks/useSudoku';
import { getGridConfig } from './lib/sudokuEngine';
import { resetStats } from './lib/storage';
import { Difficulty, GridSize } from './types';
import { Github } from 'lucide-react';

export default function App() {
  const {
    gridSize,
    difficulty,
    inGame,
    board,
    selectedCell,
    isNoteMode,
    history,
    timerSeconds,
    isPaused,
    mistakes,
    hintsRemaining,
    isCompleted,
    hintMessage,
    settings,
    stats,
    hasSavedGame,
    correctStreak,
    lastAction,
    isGameOver,
    solvedCount,
    totalToSolve,
    totalCells,
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
  } = useSudoku();

  // Setup screen local selection states
  const [setupGrid, setSetupGrid] = useState<GridSize>(gridSize);
  const [setupDiff, setSetupDiff] = useState<Difficulty>(difficulty);

  // Modal open states
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const gridConfig = getGridConfig(gridSize);

  const handleStartGameFromSetup = () => {
    startNewGame(setupGrid, setupDiff);
  };

  const handleResetAllStats = () => {
    const freshStats = resetStats();
    // Force trigger re-render of stats
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors antialiased">
      {/* Top Header */}
      <Header
        inGame={inGame}
        gridSize={gridSize}
        difficulty={difficulty}
        timerSeconds={timerSeconds}
        isPaused={isPaused}
        mistakes={mistakes}
        maxMistakesEnabled={settings.maxMistakesEnabled}
        onTogglePause={() => setIsPaused(!isPaused)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onNewGameClick={exitToSetup}
        onExitToSetup={exitToSetup}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center items-center">
        {!inGame ? (
          // Setup Screen
          <GameSetupCard
            selectedGrid={setupGrid}
            selectedDifficulty={setupDiff}
            hasSavedGame={hasSavedGame}
            onSelectGrid={setSetupGrid}
            onSelectDifficulty={setSetupDiff}
            onStartGame={handleStartGameFromSetup}
            onResumeGame={resumeSavedGame}
          />
        ) : (
          // Active Gameplay
          <div className="w-full flex flex-col items-center gap-3 sm:gap-4 my-auto">
            {/* 1. Progress Indicator */}
            <SolvingProgress
              solvedCount={solvedCount}
              totalCells={totalCells}
              totalToSolve={totalToSolve}
            />

            {/* 2. Puzzle Pulse Motivational Banner */}
            <PuzzlePulse
              mistakes={mistakes}
              correctStreak={correctStreak}
              solvedCount={solvedCount}
              totalToSolve={totalToSolve}
              timerSeconds={timerSeconds}
              lastAction={lastAction}
              isCompleted={isCompleted}
            />

            {/* 3. Hint / Alert Banner if present */}
            {hintMessage && (
              <div className="w-full max-w-md sm:max-w-lg px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs font-semibold text-center animate-fadeIn shadow-sm">
                💡 {hintMessage}
              </div>
            )}

            {/* 4. Sudoku Board Grid */}
            <SudokuBoard
              board={board}
              config={gridConfig}
              selectedCell={selectedCell}
              settings={settings}
              isPaused={isPaused}
              onSelectCell={setSelectedCell}
            />

            {/* 5. Number Pad & Controls */}
            {!isPaused && (
              <div className="w-full max-w-md sm:max-w-lg space-y-3">
                <NumberPad
                  gridSize={gridSize}
                  isNoteMode={isNoteMode}
                  historyLength={history.length}
                  hintsRemaining={hintsRemaining}
                  remainingNumbers={getRemainingNumbers()}
                  onInputNumber={inputNumber}
                  onErase={eraseCell}
                  onToggleNoteMode={() => setIsNoteMode(!isNoteMode)}
                  onUndo={undo}
                  onHint={requestHint}
                  onAutoNotes={autoFillNotes}
                  hasCandidateNotes={hasCandidateNotes}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="w-full py-3 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/50 dark:border-slate-800/50">
        MindGrid • 6×6 and 9×9 Sudoku Engine
      </footer>

      {/* Modals */}
      <StatisticsModal
        isOpen={isStatsOpen}
        stats={stats}
        currentGridSize={gridSize}
        onClose={() => setIsStatsOpen(false)}
        onResetStats={handleResetAllStats}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={updateSettings}
      />

      <ShareModal
        isOpen={isShareOpen}
        gridSize={gridSize}
        difficulty={difficulty}
        onClose={() => setIsShareOpen(false)}
      />

      <VictoryModal
        isOpen={isCompleted}
        gridSize={gridSize}
        difficulty={difficulty}
        timerSeconds={timerSeconds}
        mistakes={mistakes}
        onNewGame={exitToSetup}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      <GameOverModal
        isOpen={isGameOver}
        onTryAgain={exitToSetup}
      />
      <footer className="mt-8 pb-6 text-center">
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <span>Crafted & maintained by</span>

        <span className="font-medium text-slate-600">
          Vijesh G
        </span>

        <span className="text-slate-300">·</span>

        <a
          href="https://github.com/vijeshg/mind-grid-sudoku"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-slate-500 transition-colors hover:text-slate-800"
          aria-label="MindGrid Sudoku GitHub repository"
        >
          <Github size={14} strokeWidth={1.8} />
          <span>mind-grid-sudoku</span>
        </a>
      </div>
    </footer>
    </div>
  );
}

import {
  BarChart2,
  Grid3X3,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  Settings as SettingsIcon,
  Share2,
  Trophy,
} from 'lucide-react';
import React from 'react';
import { Difficulty, GridSize } from '../types';

interface HeaderProps {
  inGame: boolean;
  gridSize: GridSize;
  difficulty: Difficulty;
  timerSeconds: number;
  isPaused: boolean;
  mistakes: number;
  maxMistakesEnabled: boolean;
  onTogglePause: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenShare: () => void;
  onNewGameClick: () => void;
  onExitToSetup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  inGame,
  gridSize,
  difficulty,
  timerSeconds,
  isPaused,
  mistakes,
  maxMistakesEnabled,
  onTogglePause,
  onOpenStats,
  onOpenSettings,
  onOpenShare,
  onNewGameClick,
  onExitToSetup,
}) => {
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formattedDiff =
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Logo & Game Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExitToSetup}
            className="flex items-center gap-2 group text-left focus:outline-none"
            title="Return to Setup"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm group-hover:scale-105 transition-transform">
              <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                MindGrid
              </h1>
              {inGame && (
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  <span className="hidden sm:inline">{gridSize === '6x6' ? '6 × 6 • ' : '9 × 9 • '}</span>
                  <span>{formattedDiff}</span>
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Game Stats / Timer in header when playing */}
        {inGame && (
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mistakes */}
            <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <span className="hidden sm:inline text-slate-400 dark:text-slate-500">Mistakes:</span>
              <span
                className={`font-semibold ${
                  mistakes > 0 ? 'text-rose-600 dark:text-rose-400' : ''
                }`}
              >
                {mistakes} / 3
              </span>
            </div>

            {/* Timer */}
            <button
              onClick={onTogglePause}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold transition-colors focus:outline-none"
              title={isPaused ? 'Resume Timer' : 'Pause Timer'}
            >
              {isPaused ? (
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400 fill-current" />
              ) : (
                <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
              )}
              <span className="font-mono tracking-wider">{formatTime(timerSeconds)}</span>
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1.5">
          {inGame && (
            <button
              onClick={onNewGameClick}
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
              title="New Game"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          <button
            onClick={onOpenShare}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
            title="Share Puzzle"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onOpenStats}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
            title="Statistics"
          >
            <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

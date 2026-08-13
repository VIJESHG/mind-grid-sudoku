import { Clock, Play, RotateCcw, Share2, Sparkles, Trophy } from 'lucide-react';
import React from 'react';
import { Difficulty, GridSize } from '../types';

interface VictoryModalProps {
  isOpen: boolean;
  gridSize: GridSize;
  difficulty: Difficulty;
  timerSeconds: number;
  mistakes: number;
  onNewGame: () => void;
  onOpenShare: () => void;
  onOpenStats: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  gridSize,
  difficulty,
  timerSeconds,
  mistakes,
  onNewGame,
  onOpenShare,
  onOpenStats,
}) => {
  if (!isOpen) return null;

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  const formattedDiff =
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 text-center">
        {/* Trophy Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/20 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        {/* Victory Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Puzzle Solved!
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Congratulations!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You completed the {gridSize === '6x6' ? '6 × 6' : '9 × 9'} Sudoku on{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formattedDiff}
            </span>
          </p>
        </div>

        {/* Stats Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5" /> Time
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {formatTime(timerSeconds)}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2">
            <div className="text-xs text-slate-400 mb-1">Mistakes</div>
            <div
              className={`text-xl font-bold ${
                mistakes > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {mistakes}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onNewGame}
            className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base tracking-wide shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 focus:outline-none"
          >
            <Play className="w-5 h-5 fill-current" />
            Play New Puzzle
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpenShare}
              className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors focus:outline-none"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              type="button"
              onClick={onOpenStats}
              className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors focus:outline-none"
            >
              <Trophy className="w-4 h-4" />
              Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

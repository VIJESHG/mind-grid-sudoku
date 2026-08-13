import React from 'react';

interface SolvingProgressProps {
  solvedCount: number;
  totalCells: number;
  totalToSolve: number;
}

export const SolvingProgress: React.FC<SolvingProgressProps> = ({
  solvedCount,
  totalToSolve,
}) => {
  const percentage = Math.min(
    100,
    Math.round((solvedCount / Math.max(1, totalToSolve)) * 100)
  );

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Puzzle Progress
        </span>
        <span className="font-bold text-indigo-600 dark:text-indigo-400">
          {solvedCount} / {totalToSolve} solved ({percentage}%)
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

import { Award, Flame, RotateCcw, Trophy, X } from 'lucide-react';
import React, { useState } from 'react';
import { Difficulty, FullStatsRecord, GameStats, GridSize } from '../types';

interface StatisticsModalProps {
  isOpen: boolean;
  stats: FullStatsRecord;
  currentGridSize: GridSize;
  onClose: () => void;
  onResetStats: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  stats,
  currentGridSize,
  onClose,
  onResetStats,
}) => {
  const [activeTab, setActiveTab] = useState<GridSize>(currentGridSize);
  const [activeDiff, setActiveDiff] = useState<Difficulty>('medium');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const formatTime = (secs: number | null) => {
    if (secs === null || secs === undefined) return '--:--';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const gridStats = stats[activeTab];
  const selectedStats: GameStats = gridStats[activeDiff];

  const winRate =
    selectedStats.gamesPlayed > 0
      ? Math.round(
          (selectedStats.gamesCompleted / selectedStats.gamesPlayed) * 100
        )
      : 0;

  const avgTimeSecs =
    selectedStats.gamesCompleted > 0
      ? Math.round(
          selectedStats.totalTimeSeconds / selectedStats.gamesCompleted
        )
      : null;

  const difficulties: { key: Difficulty; label: string }[] = [
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
    { key: 'expert', label: 'Expert' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Statistics
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid Size Tabs */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('6x6')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none ${
              activeTab === '6x6'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            6 × 6 Sudoku
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('9x9')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none ${
              activeTab === '9x9'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            9 × 9 Sudoku
          </button>
        </div>

        {/* Difficulty Selector Pills */}
        <div className="grid grid-cols-4 gap-2">
          {difficulties.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveDiff(key)}
              className={`py-2 px-3 rounded-xl font-bold text-xs transition-all focus:outline-none ${
                activeDiff === key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
              Played
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {selectedStats.gamesPlayed}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
              Completed
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {selectedStats.gamesCompleted}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
              Win Rate
            </div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {winRate}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
              Best Time
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {formatTime(selectedStats.bestTimeSeconds)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
              Average Time
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {formatTime(avgTimeSecs)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
              Streak
            </div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">
              {selectedStats.currentStreak}{' '}
              <span className="text-xs font-medium text-slate-400">
                (Best: {selectedStats.bestStreak})
              </span>
            </div>
          </div>
        </div>

        {/* Reset Confirmation */}
        {showConfirmReset ? (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center space-y-3">
            <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
              Are you sure you want to reset all recorded statistics?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  onResetStats();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Yes, Reset All
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setShowConfirmReset(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors focus:outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Statistics
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

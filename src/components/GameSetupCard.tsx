import { Check, Grid, Play, Sparkles } from 'lucide-react';
import React from 'react';
import { Difficulty, GridSize } from '../types';

interface GameSetupCardProps {
  selectedGrid: GridSize;
  selectedDifficulty: Difficulty;
  hasSavedGame: boolean;
  onSelectGrid: (size: GridSize) => void;
  onSelectDifficulty: (diff: Difficulty) => void;
  onStartGame: () => void;
  onResumeGame: () => void;
}

export const GameSetupCard: React.FC<GameSetupCardProps> = ({
  selectedGrid,
  selectedDifficulty,
  hasSavedGame,
  onSelectGrid,
  onSelectDifficulty,
  onStartGame,
  onResumeGame,
}) => {
  const difficulties: { key: Difficulty; label: string; desc: string }[] = [
    { key: 'easy', label: 'Easy', desc: 'Plentiful clues, straightforward logic' },
    { key: 'medium', label: 'Medium', desc: 'Balanced puzzle for regular play' },
    { key: 'hard', label: 'Hard', desc: 'Requires deeper logical deduction' },
    { key: 'expert', label: 'Expert', desc: 'Minimal clues, tough challenges' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Game Setup
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Select Puzzle Mode
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Choose your preferred board size and difficulty to begin
          </p>
        </div>

        {/* Resume Option Banner if saved game exists */}
        {hasSavedGame && (
          <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                Game in Progress
              </div>
              <div className="text-xs text-indigo-700 dark:text-indigo-400">
                You have an unfinished game saved.
              </div>
            </div>
            <button
              onClick={onResumeGame}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide transition-colors flex items-center gap-1.5 shadow-sm shrink-0 focus:outline-none"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Resume
            </button>
          </div>
        )}

        {/* Step 1: Grid Size */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Grid Size
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* 6x6 Option */}
            <button
              type="button"
              onClick={() => onSelectGrid('6x6')}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all focus:outline-none ${
                selectedGrid === '6x6'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 dark:border-indigo-500 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  6 × 6
                </div>
                {selectedGrid === '6x6' && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                36 cells • 2×3 sub-grids
                <br />
                Numbers 1–6
              </p>
            </button>

            {/* 9x9 Option */}
            <button
              type="button"
              onClick={() => onSelectGrid('9x9')}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all focus:outline-none ${
                selectedGrid === '9x9'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 dark:border-indigo-500 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  9 × 9
                </div>
                {selectedGrid === '9x9' && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                81 cells • 3×3 sub-grids
                <br />
                Numbers 1–9
              </p>
            </button>
          </div>
        </div>

        {/* Step 2: Difficulty */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Difficulty
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {difficulties.map(({ key, label, desc }) => {
              const isSelected = selectedDifficulty === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectDifficulty(key)}
                  className={`p-3 rounded-xl border-2 text-center transition-all focus:outline-none ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="text-sm font-bold">{label}</div>
                </button>
              );
            })}
          </div>
          <div className="text-xs text-center text-slate-500 dark:text-slate-400 italic mt-1">
            {difficulties.find((d) => d.key === selectedDifficulty)?.desc}
          </div>
        </div>

        {/* Start Game Button */}
        <button
          type="button"
          onClick={onStartGame}
          className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base tracking-wide shadow-lg shadow-indigo-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Game
        </button>
      </div>
    </div>
  );
};

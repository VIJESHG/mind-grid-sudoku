import { Flame, Sparkles, Target, Zap } from 'lucide-react';
import React from 'react';

interface PuzzlePulseProps {
  mistakes: number;
  correctStreak: number;
  solvedCount: number;
  totalToSolve: number;
  timerSeconds: number;
  lastAction: { type: 'correct' | 'mistake' | 'hint' | 'undo'; timestamp: number } | null;
  isCompleted: boolean;
}

export const PuzzlePulse: React.FC<PuzzlePulseProps> = ({
  mistakes,
  correctStreak,
  solvedCount,
  totalToSolve,
  lastAction,
  isCompleted,
}) => {
  const percentage = Math.round((solvedCount / Math.max(1, totalToSolve)) * 100);

  const getMessage = (): { icon: React.ReactNode; text: string; color: string } => {
    if (isCompleted) {
      return {
        icon: <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />,
        text: '🎉 Masterpiece! You solved the entire puzzle!',
        color: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200',
      };
    }

    if (lastAction?.type === 'mistake') {
      if (mistakes === 1) {
        return {
          icon: <Target className="w-4 h-4 text-amber-500" />,
          text: "💪 First mistake — no worries, you've got this!",
          color: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200',
        };
      }
      if (mistakes === 2) {
        return {
          icon: <Target className="w-4 h-4 text-rose-500" />,
          text: '🧘 Take a deep breath — 2 mistakes so far. Stay focused!',
          color: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200',
        };
      }
    }

    if (correctStreak >= 5) {
      return {
        icon: <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />,
        text: `🔥 Unstoppable! ${correctStreak} correct moves in a row!`,
        color: 'bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-900 text-orange-800 dark:text-orange-200',
      };
    }

    if (correctStreak >= 3) {
      return {
        icon: <Zap className="w-4 h-4 text-indigo-500 fill-indigo-500" />,
        text: `⚡ Great momentum — ${correctStreak} in a row!`,
        color: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900 text-indigo-800 dark:text-indigo-200',
      };
    }

    if (percentage >= 75) {
      return {
        icon: <Target className="w-4 h-4 text-purple-500" />,
        text: '🏁 Final sprint! Almost at 100% completion!',
        color: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900 text-purple-800 dark:text-purple-200',
      };
    }

    if (percentage >= 50) {
      return {
        icon: <Sparkles className="w-4 h-4 text-indigo-500" />,
        text: "🎯 Halfway mark passed — you're in the zone!",
        color: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900 text-indigo-800 dark:text-indigo-200',
      };
    }

    return {
      icon: <Sparkles className="w-4 h-4 text-indigo-500" />,
      text: '✨ Puzzle Pulse • Keep the momentum going!',
      color: 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300',
    };
  };

  const current = getMessage();

  return (
    <div
      className={`w-full max-w-md sm:max-w-lg mx-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-semibold shadow-sm transition-all duration-300 ${current.color}`}
    >
      {current.icon}
      <span>{current.text}</span>
    </div>
  );
};

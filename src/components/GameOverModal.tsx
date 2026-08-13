import { RotateCcw } from 'lucide-react';
import React from 'react';

interface GameOverModalProps {
  isOpen: boolean;
  onTryAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onTryAgain,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center shadow-xl space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 text-3xl">
          💪
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            3 Mistakes Made
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Don't worry! Every mistake is a step toward mastering Sudoku.
          </p>
        </div>
        <button
          type="button"
          onClick={onTryAgain}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors shadow-md shadow-indigo-600/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Another Puzzle</span>
        </button>
      </div>
    </div>
  );
};

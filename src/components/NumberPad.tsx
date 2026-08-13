import {
  Eraser,
  Lightbulb,
  Pencil,
  Sparkles,
  Undo2,
} from 'lucide-react';
import React from 'react';
import { GridSize } from '../types';

interface NumberPadProps {
  gridSize: GridSize;
  isNoteMode: boolean;
  historyLength: number;
  hintsRemaining: number;
  remainingNumbers: Record<number, number>;
  onInputNumber: (num: number) => void;
  onErase: () => void;
  onToggleNoteMode: () => void;
  onUndo: () => void;
  onHint: () => void;
  onAutoNotes: () => void;
}

export const NumberPad: React.FC<NumberPadProps> = ({
  gridSize,
  isNoteMode,
  historyLength,
  hintsRemaining,
  remainingNumbers,
  onInputNumber,
  onErase,
  onToggleNoteMode,
  onUndo,
  onHint,
  onAutoNotes,
}) => {
  const maxNum = gridSize === '6x6' ? 6 : 9;
  const numbers = Array.from({ length: maxNum }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto space-y-3">
      {/* Control Actions Row */}
      <div className="grid grid-cols-4 gap-2">
        {/* Undo */}
        <button
          type="button"
          onClick={onUndo}
          disabled={historyLength === 0}
          className="flex flex-col items-center justify-center p-2 rounded-2xl min-h-[48px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 focus:outline-none shadow-sm touch-manipulation select-none"
          title="Undo last action"
        >
          <Undo2 className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold">Undo</span>
        </button>

        {/* Erase */}
        <button
          type="button"
          onClick={onErase}
          className="flex flex-col items-center justify-center p-2 rounded-2xl min-h-[48px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 focus:outline-none shadow-sm touch-manipulation select-none"
          title="Erase cell content"
        >
          <Eraser className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold">Erase</span>
        </button>

        {/* Notes Toggle */}
        <button
          type="button"
          onClick={onToggleNoteMode}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl min-h-[48px] border transition-all active:scale-95 focus:outline-none shadow-sm relative touch-manipulation select-none ${
            isNoteMode
              ? 'bg-indigo-600 border-indigo-600 text-white font-bold ring-2 ring-indigo-600/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
          title="Toggle Pencil Notes mode"
        >
          <Pencil className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold">
            Notes {isNoteMode ? 'ON' : 'OFF'}
          </span>
          {isNoteMode && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        {/* Hint */}
        <button
          type="button"
          onClick={onHint}
          disabled={hintsRemaining <= 0}
          className="flex flex-col items-center justify-center p-2 rounded-2xl min-h-[48px] bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 focus:outline-none shadow-sm relative touch-manipulation select-none"
          title={hintsRemaining > 0 ? `Get a smart hint (${hintsRemaining} left)` : 'No hints remaining'}
        >
          <Lightbulb className="w-5 h-5 mb-0.5 fill-current" />
          <span className="text-[11px] font-bold">
            Hint ({hintsRemaining})
          </span>
        </button>
      </div>

      {/* Number Buttons Grid */}
      <div
        className="grid grid-cols-3 gap-2"
      >
        {numbers.map((num) => {
          const remaining = remainingNumbers[num] ?? 0;
          const isDone = remaining === 0;

          return (
            <button
              key={num}
              type="button"
              onClick={() => onInputNumber(num)}
              disabled={isDone}
              className={`relative py-3.5 sm:py-4 rounded-2xl min-h-[52px] border-2 text-xl sm:text-2xl font-black transition-all active:scale-95 focus:outline-none flex items-center justify-center shadow-sm touch-manipulation select-none ${
                isDone
                  ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800/80 text-slate-300 dark:text-slate-700 opacity-40 cursor-not-allowed'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40'
              }`}
            >
              <span>{num}</span>
            </button>
          );
        })}
      </div>

      {/* Auto Notes Helper Button */}
      <div className="pt-1 flex justify-center">
        <button
          type="button"
          onClick={onAutoNotes}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors focus:outline-none"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Auto-Fill Candidate Notes</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Cell, CellPosition, GridConfig, Settings } from '../types';

interface SudokuBoardProps {
  board: Cell[][];
  config: GridConfig;
  selectedCell: CellPosition | null;
  settings: Settings;
  isPaused: boolean;
  onSelectCell: (pos: CellPosition) => void;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  config,
  selectedCell,
  settings,
  isPaused,
  onSelectCell,
}) => {
  const { size, boxRows, boxCols, maxNum } = config;

  // Selected value for same-number highlighting
  const selectedVal =
    selectedCell && board[selectedCell.row]?.[selectedCell.col]?.value;

  // Selected cell box bounds
  const selectedBoxRow =
    selectedCell ? Math.floor(selectedCell.row / boxRows) : -1;
  const selectedBoxCol =
    selectedCell ? Math.floor(selectedCell.col / boxCols) : -1;

  if (isPaused) {
    return (
      <div className="w-full max-w-lg aspect-square mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="text-xl font-bold text-slate-700 dark:text-slate-200">
          Game Paused
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Click the play button in the header to resume playing
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md sm:max-w-lg aspect-square mx-auto select-none">
      <div
        className={`w-full h-full grid rounded-2xl overflow-hidden border-2 sm:border-3 border-slate-800 dark:border-slate-200 bg-slate-800 dark:bg-slate-200 shadow-xl ${
          size === 6 ? 'grid-cols-6 grid-rows-6' : 'grid-cols-9 grid-rows-9'
        } gap-[1px]`}
      >
        {board.map((rowArr, rIdx) =>
          rowArr.map((cell, cIdx) => {
            const isSelected =
              selectedCell?.row === rIdx && selectedCell?.col === cIdx;

            const isRelated =
              selectedCell !== null &&
              settings.highlightRelatedCells &&
              (selectedCell.row === rIdx ||
                selectedCell.col === cIdx ||
                (Math.floor(rIdx / boxRows) === selectedBoxRow &&
                  Math.floor(cIdx / boxCols) === selectedBoxCol));

            const isSameNum =
              selectedVal !== undefined &&
              selectedVal !== 0 &&
              cell.value === selectedVal &&
              settings.highlightSameNumber;

            // Sub-grid thick borders
            const isBoxBottomBorder =
              (rIdx + 1) % boxRows === 0 && rIdx !== size - 1;
            const isBoxRightBorder =
              (cIdx + 1) % boxCols === 0 && cIdx !== size - 1;

            // Cell background styling
            let cellBg = 'bg-white dark:bg-slate-900';

            if (isSelected) {
              cellBg = 'bg-indigo-100 dark:bg-indigo-950/80';
            } else if (cell.isError && settings.highlightDuplicates) {
              cellBg = 'bg-rose-100 dark:bg-rose-950/70';
            } else if (isSameNum) {
              cellBg = 'bg-indigo-200/70 dark:bg-indigo-900/60';
            } else if (isRelated) {
              cellBg = 'bg-slate-100/90 dark:bg-slate-800/80';
            }

            return (
              <button
                key={`${rIdx}-${cIdx}`}
                type="button"
                onClick={() => onSelectCell({ row: rIdx, col: cIdx })}
                className={`relative w-full h-full flex items-center justify-center transition-colors focus:outline-none touch-manipulation select-none ${cellBg} ${
                  isBoxBottomBorder ? 'border-b-2 sm:border-b-3 border-slate-800 dark:border-slate-200' : ''
                } ${
                  isBoxRightBorder ? 'border-r-2 sm:border-r-3 border-slate-800 dark:border-slate-200' : ''
                } ${
                  isSelected
                    ? 'ring-2 sm:ring-3 ring-indigo-600 dark:ring-indigo-400 z-10'
                    : ''
                }`}
              >
                {cell.value > 0 ? (
                  // Display Number
                  <span
                    className={`font-extrabold transition-transform ${
                      size === 6
                        ? 'text-2xl sm:text-3xl'
                        : 'text-lg sm:text-2xl'
                    } ${
                      cell.isError && settings.highlightDuplicates
                        ? 'text-rose-600 dark:text-rose-400 animate-pulse'
                        : cell.given
                        ? 'text-slate-900 dark:text-slate-100 font-black'
                        : 'text-indigo-600 dark:text-indigo-400 font-bold'
                    }`}
                  >
                    {cell.value}
                  </span>
                ) : (
                  // Display Pencil Notes
                  <div
                    className={`w-full h-full p-0.5 grid ${
                      size === 6
                        ? 'grid-cols-3 grid-rows-2'
                        : 'grid-cols-3 grid-rows-3'
                    } items-center justify-items-center pointer-events-none`}
                  >
                    {Array.from({ length: maxNum }, (_, i) => i + 1).map(
                      (num) => (
                        <span
                          key={num}
                          className={`font-semibold text-slate-500 dark:text-slate-400 ${
                            size === 6
                              ? 'text-[10px] sm:text-xs'
                              : 'text-[8px] sm:text-[10px]'
                          } ${
                            cell.notes.includes(num)
                              ? 'opacity-100'
                              : 'opacity-0'
                          }`}
                        >
                          {num}
                        </span>
                      )
                    )}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

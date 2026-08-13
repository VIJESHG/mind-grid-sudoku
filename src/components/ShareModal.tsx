import { Check, Copy, Share2, X } from 'lucide-react';
import React, { useState } from 'react';
import { Difficulty, GridSize } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  gridSize: GridSize;
  difficulty: Difficulty;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  gridSize,
  difficulty,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sizeNum = gridSize === '6x6' ? '6' : '9';
  const shareUrl = `${window.location.origin}${window.location.pathname}?size=${sizeNum}&difficulty=${difficulty}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Share Game
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          Share this link with friends so they can play the exact same grid size and difficulty mode:
        </p>

        {/* Link Input & Copy Button */}
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-medium focus:outline-none select-all"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm focus:outline-none"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-sm transition-colors focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

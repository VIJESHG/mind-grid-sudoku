import { Moon, Settings as SettingsIcon, Sun, X } from 'lucide-react';
import React from 'react';
import { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  settings: Settings;
  onClose: () => void;
  onUpdateSettings: (newSettings: Settings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const toggleSetting = (key: keyof Settings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          {/* Auto-Remove Notes */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Auto-Remove Notes
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Remove candidate notes when number is placed in row/col/box
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('autoRemoveNotes')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.autoRemoveNotes
                  ? 'bg-indigo-600'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.autoRemoveNotes ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Highlight Duplicates */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Highlight Duplicates
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Highlight conflicting numbers in red
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('highlightDuplicates')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.highlightDuplicates
                  ? 'bg-indigo-600'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.highlightDuplicates ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Highlight Same Number */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Highlight Matching Numbers
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Highlight all cells matching selected cell value
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('highlightSameNumber')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.highlightSameNumber
                  ? 'bg-indigo-600'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.highlightSameNumber ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Highlight Related Cells */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Highlight Same Row/Col/Box
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Softly shade related cells for easier tracking
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('highlightRelatedCells')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.highlightRelatedCells
                  ? 'bg-indigo-600'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.highlightRelatedCells ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Max 3 Mistakes Limit */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                3 Mistakes Limit Mode
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                End game if 3 mistakes are made
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('maxMistakesEnabled')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.maxMistakesEnabled
                  ? 'bg-indigo-600'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.maxMistakesEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-sm transition-colors focus:outline-none"
        >
          Done
        </button>
      </div>
    </div>
  );
};

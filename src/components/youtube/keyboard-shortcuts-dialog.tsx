'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

interface ShortcutItem {
  keys: string[];
  description: string;
}

const shortcutSections: { title: string; shortcuts: ShortcutItem[] }[] = [
  {
    title: 'Playback',
    shortcuts: [
      { keys: ['Space', 'K'], description: 'Toggle play/pause' },
      { keys: ['J'], description: 'Rewind 10 seconds' },
      { keys: ['L'], description: 'Forward 10 seconds' },
      { keys: ['←'], description: 'Previous video' },
      { keys: ['→'], description: 'Next video' },
      { keys: ['↑'], description: 'Volume up' },
      { keys: ['↓'], description: 'Volume down' },
      { keys: ['M'], description: 'Toggle mute' },
      { keys: ['F'], description: 'Toggle fullscreen' },
      { keys: ['C'], description: 'Toggle captions' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['Shift', 'N'], description: 'Next video' },
      { keys: ['Shift', 'P'], description: 'Previous video' },
      { keys: ['/'], description: 'Focus search bar' },
      { keys: ['Esc'], description: 'Exit fullscreen/player' },
    ],
  },
  {
    title: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['↑', '↓'], description: 'Navigate Shorts' },
    ],
  },
];

export default function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger when typing in inputs
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable
    ) {
      return;
    }

    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden bg-white dark:bg-[#282828] border-gray-200 dark:border-gray-600">
        {/* Dark header like YouTube */}
        <DialogHeader className="bg-gray-900 dark:bg-[#1f1f1f] px-6 py-4">
          <DialogTitle className="text-white flex items-center gap-2 text-base">
            <Keyboard className="w-5 h-5" />
            Keyboard shortcuts
          </DialogTitle>
        </DialogHeader>

        {/* Shortcut list - two column on wider screens */}
        <div className="px-6 py-4 max-h-[480px] overflow-y-auto">
          {shortcutSections.map((section) => (
            <div key={section.title} className="mb-5 last:mb-0">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-0.5">
                {section.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between py-1.5 px-1 rounded hover:bg-gray-50 dark:hover:bg-[#333] transition-colors"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, idx) => (
                        <span key={key} className="flex items-center">
                          {idx > 0 && (
                            <span className="text-gray-400 dark:text-gray-500 text-xs mx-1">+</span>
                          )}
                          <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-gray-100 dark:bg-[#272727] rounded px-2 py-0.5 font-mono text-sm text-gray-800 dark:text-gray-200">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Access anywhere hint */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5" />
              Press <kbd className="bg-gray-100 dark:bg-[#272727] rounded px-1.5 py-0.5 font-mono text-xs">Shift</kbd>+<kbd className="bg-gray-100 dark:bg-[#272727] rounded px-1.5 py-0.5 font-mono text-xs">/</kbd> (or <kbd className="bg-gray-100 dark:bg-[#272727] rounded px-1.5 py-0.5 font-mono text-xs">?</kbd>) to open this dialog
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

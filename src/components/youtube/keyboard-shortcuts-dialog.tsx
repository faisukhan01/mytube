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
      { keys: ['Space', 'K'], description: 'Play/Pause (in player)' },
      { keys: ['J'], description: 'Rewind 10 seconds (in player)' },
      { keys: ['L'], description: 'Forward 10 seconds (in player)' },
      { keys: ['F'], description: 'Fullscreen (in player)' },
      { keys: ['M'], description: 'Mute (in player)' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['↑', '↓'], description: 'Navigate Shorts' },
      { keys: ['Esc'], description: 'Close/Go back' },
      { keys: ['/'], description: 'Focus search' },
      { keys: ['?'], description: 'Show this help' },
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
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-white dark:bg-[#282828] border-gray-200 dark:border-gray-600">
        {/* Dark header like YouTube */}
        <DialogHeader className="bg-gray-900 dark:bg-[#1f1f1f] px-6 py-4">
          <DialogTitle className="text-white flex items-center gap-2 text-base">
            <Keyboard className="w-5 h-5" />
            Keyboard shortcuts
          </DialogTitle>
        </DialogHeader>

        {/* Shortcut list */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {shortcutSections.map((section) => (
            <div key={section.title} className="mb-5 last:mb-0">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between py-1.5 px-1"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, idx) => (
                        <span key={key}>
                          {idx > 0 && (
                            <span className="text-gray-400 dark:text-gray-500 text-xs mx-1">/</span>
                          )}
                          <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded text-xs font-medium text-gray-800 dark:text-gray-200 shadow-sm">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

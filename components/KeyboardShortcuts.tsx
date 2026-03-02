'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['Ctrl', 'N'], description: 'New expense', action: 'focus-add' },
  { keys: ['Ctrl', 'K'], description: 'Search transactions', action: 'search' },
  { keys: ['Ctrl', 'H'], description: 'Go home', action: 'navigate-home' },
  { keys: ['Ctrl', 'B'], description: 'Budget', action: 'navigate-budget' },
  { keys: ['Ctrl', 'J'], description: 'Analytics', action: 'navigate-analytics' },
  { keys: ['?'], description: 'Show shortcuts', action: 'show-help' },
  { keys: ['Esc'], description: 'Close modal / panel', action: 'close' },
] as const;

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't fire shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // Escape always works
      if (e.key === 'Escape') {
        setShowHelp(false);
        return;
      }

      // ? key for help (only when not in input)
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      if (isInput) return;

      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === 'n') {
        e.preventDefault();
        // Scroll to expense form or navigate home
        const form = document.querySelector<HTMLInputElement>(
          'input[name="description"]'
        );
        if (form) {
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => form.focus(), 300);
        } else {
          router.push('/');
        }
      }

      if (ctrl && e.key === 'k') {
        e.preventDefault();
        // Focus the search input in FilterBar
        const search = document.querySelector<HTMLInputElement>(
          'input[placeholder*="Search"]'
        );
        if (search) {
          search.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => search.focus(), 300);
        } else {
          router.push('/transactions');
        }
      }

      if (ctrl && e.key === 'h') {
        e.preventDefault();
        router.push('/');
      }

      if (ctrl && e.key === 'b') {
        e.preventDefault();
        router.push('/budget');
      }

      if (ctrl && e.key === 'j') {
        e.preventDefault();
        router.push('/analytics');
      }
    },
    [router]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Floating hint badge — desktop only */}
      <button
        onClick={() => setShowHelp(true)}
        className="hidden lg:flex fixed bottom-6 right-6 z-40 items-center gap-1.5 px-3 py-1.5 rounded-full bg-card-dark/80 dark:bg-white/10 text-white text-xs font-medium backdrop-blur-sm shadow-lg hover:bg-dark-900 dark:hover:bg-white/20 transition-colors"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard size={14} />
        <span>?</span>
      </button>

      {/* Shortcuts modal */}
      {showHelp && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center"
          onClick={() => setShowHelp(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white dark:bg-card-dark rounded-montra-lg shadow-xl w-[90vw] max-w-sm p-5 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Keyboard size={18} className="text-violet-100" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Keyboard Shortcuts
                </h2>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="btn-icon"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {SHORTCUTS.map(({ keys, description }) => (
                <div
                  key={description}
                  className="flex items-center justify-between py-1.5"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                  </span>
                  <div className="flex items-center gap-1">
                    {keys.map((key) => (
                      <kbd
                        key={key}
                        className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-md bg-surface-light dark:bg-dark-700 border border-border-light dark:border-border-dark text-xs font-mono font-medium text-gray-700 dark:text-gray-300"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Press <kbd className="px-1 py-0.5 rounded bg-surface-light dark:bg-dark-700 text-[10px] font-mono">?</kbd> anywhere to toggle this dialog
            </p>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

const emptySubscribe = () => () => {};

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <button className="p-2 rounded-montra-sm bg-surface-light dark:bg-dark-700 w-9 h-9" aria-label="Toggle theme" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-montra-sm bg-surface-light hover:bg-light-40 dark:bg-dark-700 dark:hover:bg-dark-600 transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-warning-100" />
      ) : (
        <Moon size={18} className="text-violet-100" />
      )}
    </button>
  );
}

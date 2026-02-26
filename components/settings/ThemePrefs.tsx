'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';

const emptySubscribe = () => () => {};

const themeOptions = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun,
    description: 'Clean and bright',
    color: 'from-warning-100 to-warning-60',
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon,
    description: 'Easy on the eyes',
    color: 'from-violet-100 to-violet-60',
  },
  {
    value: 'system',
    label: 'System',
    icon: Monitor,
    description: 'Match your device',
    color: 'from-light-60 to-dark-400',
  },
];

export default function ThemePrefs() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-violet-100" />
          Appearance
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-montra-sm bg-surface-light dark:bg-dark-700 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5 text-violet-100" />
        Appearance
      </h2>

      <div className="grid grid-cols-3 gap-3">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;

          return (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-montra-sm border-2 transition-all ${
                isActive
                  ? 'border-violet-100 bg-violet-20 dark:bg-violet-100/10 shadow-md'
                  : 'border-light-40 dark:border-dark-600 hover:border-light-60 dark:hover:border-dark-400 hover:bg-surface-light dark:hover:bg-dark-700'
              }`}
            >
              <div
                className={`p-2 rounded-montra-sm bg-gradient-to-br ${option.color}`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-sm font-medium ${
                  isActive
                    ? 'text-violet-100 dark:text-violet-60'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {option.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
              {isActive && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-violet-100 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

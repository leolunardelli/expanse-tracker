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
    color: 'from-amber-400 to-orange-400',
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon,
    description: 'Easy on the eyes',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    value: 'system',
    label: 'System',
    icon: Monitor,
    description: 'Match your device',
    color: 'from-gray-400 to-gray-600',
  },
];

export default function ThemePrefs() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-500" />
          Appearance
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5 text-purple-500" />
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
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                isActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div
                className={`p-2 rounded-lg bg-gradient-to-br ${option.color}`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-sm font-medium ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {option.label}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {option.description}
              </span>
              {isActive && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

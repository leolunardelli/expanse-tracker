'use client';

import { X } from 'lucide-react';
import { FilterState } from './FilterBar';

type ActiveFiltersProps = {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState) => void;
  onClearAll: () => void;
};

function getFilterLabel(key: keyof FilterState, value: string): string {
  switch (key) {
    case 'search':
      return `Search: "${value}"`;
    case 'category':
      return `Category: ${value}`;
    case 'dateFrom':
      return `From: ${new Date(value).toLocaleDateString()}`;
    case 'dateTo':
      return `To: ${new Date(value).toLocaleDateString()}`;
    case 'amountMin':
      return `Min: $${value}`;
    case 'amountMax':
      return `Max: $${value}`;
    case 'sortBy':
      return `Sort: ${value}`;
    default:
      return `${key}: ${value}`;
  }
}

const CHIP_COLORS: Record<string, string> = {
  search: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  category: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  dateFrom: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  dateTo: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  amountMin: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  amountMax: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  sortBy: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const EXCLUDED_KEYS: (keyof FilterState)[] = ['sortOrder'];

export default function ActiveFilters({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersProps) {
  const activeEntries = Object.entries(filters).filter(
    ([key, value]) =>
      value !== '' &&
      !EXCLUDED_KEYS.includes(key as keyof FilterState) &&
      !(key === 'sortBy' && value === 'date')
  ) as [keyof FilterState, string][];

  if (activeEntries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">
        Active filters:
      </span>
      {activeEntries.map(([key, value]) => (
        <span
          key={key}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
            CHIP_COLORS[key] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {getFilterLabel(key, value)}
          <button
            onClick={() => onRemoveFilter(key)}
            className="ml-0.5 hover:opacity-70 transition-opacity"
            aria-label={`Remove ${key} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      {activeEntries.length >= 2 && (
        <button
          onClick={onClearAll}
          className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 ml-1 transition"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

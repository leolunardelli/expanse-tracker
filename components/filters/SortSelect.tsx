'use client';

import { ArrowUpDown } from 'lucide-react';

type SortSelectProps = {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: 'asc' | 'desc') => void;
};

const sortOptions = [
  { value: 'date', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'description', label: 'Name' },
  { value: 'category', label: 'Category' },
];

export default function SortSelect({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SortSelectProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
        <ArrowUpDown className="w-3.5 h-3.5" />
        Sort By
      </label>
      <div className="flex items-center gap-2">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className={`px-3 py-2 text-sm border rounded-lg transition font-medium ${
            sortOrder === 'desc'
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
          }`}
          title={sortOrder === 'desc' ? 'Descending' : 'Ascending'}
        >
          {sortOrder === 'desc' ? '↓' : '↑'}
        </button>
      </div>
    </div>
  );
}

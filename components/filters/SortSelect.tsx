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
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <ArrowUpDown className="w-3.5 h-3.5" />
        Sort By
      </label>
      <div className="flex items-center gap-2">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="input flex-1 text-sm"
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
              ? 'bg-violet-20 dark:bg-violet-100/10 border-violet-100/30 dark:border-violet-100/20 text-violet-100 dark:text-violet-60'
              : 'bg-white dark:bg-dark-700 border-light-40 dark:border-dark-600 text-muted-foreground'
          }`}
          title={sortOrder === 'desc' ? 'Descending' : 'Ascending'}
        >
          {sortOrder === 'desc' ? '↓' : '↑'}
        </button>
      </div>
    </div>
  );
}

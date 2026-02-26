'use client';

import { Tag } from 'lucide-react';

type TagFilterProps = {
  value: string;
  onChange: (value: string) => void;
  availableTags: string[];
};

export default function TagFilter({
  value,
  onChange,
  availableTags,
}: TagFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        <span className="flex items-center gap-1.5">
          <Tag size={14} />
          Tag
        </span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-gray-100 text-sm"
      >
        <option value="">All tags</option>
        {availableTags.map((tag) => (
          <option key={tag} value={tag}>
            #{tag}
          </option>
        ))}
      </select>
    </div>
  );
}

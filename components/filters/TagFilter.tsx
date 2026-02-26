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
        className="input w-full text-sm"
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

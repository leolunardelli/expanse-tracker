'use client';

import { Tag } from 'lucide-react';

type CategoryFilterProps = {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
};

export default function CategoryFilter({
  value,
  onChange,
  categories,
}: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Tag className="w-3.5 h-3.5" />
        Category
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input w-full text-sm"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

'use client';

import { DollarSign } from 'lucide-react';

type AmountRangeFilterProps = {
  amountMin: string;
  amountMax: string;
  onAmountMinChange: (value: string) => void;
  onAmountMaxChange: (value: string) => void;
};

export default function AmountRangeFilter({
  amountMin,
  amountMax,
  onAmountMinChange,
  onAmountMaxChange,
}: AmountRangeFilterProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
        <DollarSign className="w-3.5 h-3.5" />
        Amount Range
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min"
          value={amountMin}
          onChange={(e) => onAmountMinChange(e.target.value)}
          min="0"
          step="0.01"
          className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
        <span className="text-xs text-gray-400">to</span>
        <input
          type="number"
          placeholder="Max"
          value={amountMax}
          onChange={(e) => onAmountMaxChange(e.target.value)}
          min={amountMin || '0'}
          step="0.01"
          className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>
    </div>
  );
}

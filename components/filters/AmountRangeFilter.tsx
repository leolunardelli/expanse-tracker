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
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
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
          className="input flex-1 text-sm"
        />
        <span className="text-xs text-muted-foreground">to</span>
        <input
          type="number"
          placeholder="Max"
          value={amountMax}
          onChange={(e) => onAmountMaxChange(e.target.value)}
          min={amountMin || '0'}
          step="0.01"
          className="input flex-1 text-sm"
        />
      </div>
    </div>
  );
}

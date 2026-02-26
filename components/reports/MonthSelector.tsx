'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

type AvailableMonth = {
  value: string;
  label: string;
  count: number;
  total: number;
};

type MonthSelectorProps = {
  months: AvailableMonth[];
  selected: string;
  onSelect: (month: string) => void;
};

export default function MonthSelector({
  months,
  selected,
  onSelect,
}: MonthSelectorProps) {
  const currentIndex = months.findIndex((m) => m.value === selected);
  const selectedMonth = months[currentIndex];

  function handlePrev() {
    if (currentIndex < months.length - 1) {
      onSelect(months[currentIndex + 1].value);
    }
  }

  function handleNext() {
    if (currentIndex > 0) {
      onSelect(months[currentIndex - 1].value);
    }
  }

  const hasPrev = currentIndex < months.length - 1;
  const hasNext = currentIndex > 0;

  return (
    <div className="card p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Prev button */}
        <button
          onClick={handlePrev}
          disabled={!hasPrev}
          className="p-2 rounded-montra-sm text-muted-foreground hover:bg-surface-light dark:hover:bg-dark-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Month display + dropdown */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-100" />
            <select
              value={selected}
              onChange={(e) => onSelect(e.target.value)}
              className="text-xl font-bold bg-transparent border-none cursor-pointer text-center text-gray-900 dark:text-white focus:outline-none focus:ring-0"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          {selectedMonth && (
            <p className="text-sm text-muted-foreground">
              {selectedMonth.count} transactions &bull; {formatCurrency(selectedMonth.total)} total
            </p>
          )}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!hasNext}
          className="p-2 rounded-montra-sm text-muted-foreground hover:bg-surface-light dark:hover:bg-dark-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

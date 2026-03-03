'use client';

import { getCategoryConfig } from '@/lib/design-tokens';
import { formatCurrency } from '@/lib/currency';

interface SpendingBreakdownProps {
  byCategory: Record<string, number>;
  total: number;
  periodLabel?: string;
}

export default function SpendingBreakdown({ byCategory, total, periodLabel }: SpendingBreakdownProps) {
  const sorted = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  if (sorted.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Spending Breakdown</h3>
        <p className="text-sm text-muted-foreground text-center py-4">No spending data yet</p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Spending Breakdown</h3>
        <span className="text-xs text-muted-foreground">{periodLabel || 'This month'}</span>
      </div>

      <div className="space-y-3">
        {sorted.map(([category, amount]) => {
          const config = getCategoryConfig(category);
          const percentage = total > 0 ? (amount / total) * 100 : 0;

          return (
            <div key={category} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(amount)}
                  </span>
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-surface-light dark:bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: config.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(byCategory).length > 6 && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          +{Object.keys(byCategory).length - 6} more categories
        </p>
      )}
    </div>
  );
}

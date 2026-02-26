'use client';

import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

type ComparisonData = {
  prevMonth: string;
  prevMonthLabel: string;
  prevTotal: number;
  changeAmount: number;
  changePercent: number;
  direction: 'up' | 'down' | 'same';
};

type MonthlyComparisonProps = {
  currentMonthLabel: string;
  currentTotal: number;
  comparison: ComparisonData;
};

export default function MonthlyComparison({
  currentMonthLabel,
  currentTotal,
  comparison,
}: MonthlyComparisonProps) {
  const { prevMonthLabel, prevTotal, changeAmount, changePercent, direction } =
    comparison;

  const directionConfig = {
    up: {
      icon: TrendingUp,
      color: 'text-expense-100',
      bg: 'bg-expense-20 dark:bg-expense-100/10',
      border: 'border-expense-100/20 dark:border-expense-100/20',
      label: 'Increased',
    },
    down: {
      icon: TrendingDown,
      color: 'text-income-100',
      bg: 'bg-income-20 dark:bg-income-100/10',
      border: 'border-income-100/20 dark:border-income-100/20',
      label: 'Decreased',
    },
    same: {
      icon: Minus,
      color: 'text-muted-foreground',
      bg: 'bg-surface-light dark:bg-dark-700',
      border: 'border-light-40 dark:border-dark-600',
      label: 'No change',
    },
  };

  const config = directionConfig[direction];
  const DirectionIcon = config.icon;

  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Month-over-Month
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Previous month */}
        <div className="flex-1 text-center p-4 rounded-montra-sm bg-surface-light dark:bg-dark-700 w-full">
          <p className="text-sm text-muted-foreground mb-1">
            {prevMonthLabel}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(prevTotal)}
          </p>
        </div>

        {/* Arrow + change */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <ArrowRight className="w-5 h-5 text-gray-400 hidden sm:block" />
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.color} border ${config.border}`}
          >
            <DirectionIcon className="w-4 h-4" />
            <span>
              {direction === 'same'
                ? 'No change'
                : `${Math.abs(changePercent)}%`}
            </span>
          </div>
          {direction !== 'same' && (
            <p className="text-xs text-muted-foreground">
              {config.label} {formatCurrency(Math.abs(changeAmount))}
            </p>
          )}
        </div>

        {/* Current month */}
        <div className="flex-1 text-center p-4 rounded-montra-sm bg-violet-20 dark:bg-violet-100/10 border border-violet-40 dark:border-violet-100/10 w-full">
          <p className="text-sm text-violet-100 mb-1">
            {currentMonthLabel}
          </p>
          <p className="text-2xl font-bold text-violet-100">
            {formatCurrency(currentTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}

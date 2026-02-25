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
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      label: 'Increased',
    },
    down: {
      icon: TrendingDown,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      label: 'Decreased',
    },
    same: {
      icon: Minus,
      color: 'text-gray-500',
      bg: 'bg-gray-50 dark:bg-gray-800',
      border: 'border-gray-200 dark:border-gray-700',
      label: 'No change',
    },
  };

  const config = directionConfig[direction];
  const DirectionIcon = config.icon;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Month-over-Month
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Previous month */}
        <div className="flex-1 text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 w-full">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
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
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {config.label} {formatCurrency(Math.abs(changeAmount))}
            </p>
          )}
        </div>

        {/* Current month */}
        <div className="flex-1 text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 w-full">
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
            {currentMonthLabel}
          </p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {formatCurrency(currentTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { formatCurrency } from '@/lib/currency';
import { DollarSign, CalendarClock, TrendingUp, Layers } from 'lucide-react';

type RecurringStatsProps = {
  stats: {
    count: number;
    monthlyTotal: number;
    yearlyTotal: number;
    byCategory: Record<string, number>;
    byFrequency: Record<string, number>;
  };
};

const frequencyLabels: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export default function RecurringStats({ stats }: RecurringStatsProps) {
  const topCategory = Object.entries(stats.byCategory).sort(
    ([, a], [, b]) => b - a
  )[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Monthly Cost */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Monthly Cost
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(stats.monthlyTotal)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formatCurrency(stats.yearlyTotal)}/year
        </p>
      </div>

      {/* Active Subscriptions */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <CalendarClock className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Active Recurring
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.count}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {Object.entries(stats.byFrequency)
            .map(([freq, count]) => `${count} ${frequencyLabels[freq] || freq}`)
            .join(', ') || 'None yet'}
        </p>
      </div>

      {/* Yearly Projection */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Yearly Projection
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(stats.yearlyTotal)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Based on current recurring expenses
        </p>
      </div>

      {/* Top Category */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <Layers className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Top Category
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {topCategory ? topCategory[0] : 'N/A'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {topCategory ? `${formatCurrency(topCategory[1])}/month` : 'No recurring expenses'}
        </p>
      </div>
    </div>
  );
}

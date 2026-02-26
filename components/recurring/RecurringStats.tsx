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
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-violet-20 dark:bg-violet-100/10 rounded-montra-sm">
            <DollarSign className="w-5 h-5 text-violet-100" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Monthly Cost
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(stats.monthlyTotal)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatCurrency(stats.yearlyTotal)}/year
        </p>
      </div>

      {/* Active Subscriptions */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-income-20 dark:bg-income-100/10 rounded-montra-sm">
            <CalendarClock className="w-5 h-5 text-income-100" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Active Recurring
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.count}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {Object.entries(stats.byFrequency)
            .map(([freq, count]) => `${count} ${frequencyLabels[freq] || freq}`)
            .join(', ') || 'None yet'}
        </p>
      </div>

      {/* Yearly Projection */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-violet-20 dark:bg-violet-100/10 rounded-montra-sm">
            <TrendingUp className="w-5 h-5 text-violet-60" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Yearly Projection
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(stats.yearlyTotal)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Based on current recurring expenses
        </p>
      </div>

      {/* Top Category */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-warning-20 dark:bg-warning-100/10 rounded-montra-sm">
            <Layers className="w-5 h-5 text-warning-100" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Top Category
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {topCategory ? topCategory[0] : 'N/A'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {topCategory ? `${formatCurrency(topCategory[1])}/month` : 'No recurring expenses'}
        </p>
      </div>
    </div>
  );
}

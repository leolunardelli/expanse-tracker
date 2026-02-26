'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

type YoYStats = {
  currentYearTotal: number;
  previousYearTotal: number;
  difference: number;
  percentChange: number;
  currentAverage: number;
  previousAverage: number;
  currentYear: number;
  previousYear: number;
};

export default function YoYStatsCards({ stats }: { stats: YoYStats }) {
  const isPositive = stats.difference > 0;
  const changeColor = isPositive ? 'text-expense-100' : 'text-income-100';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      <div className="card p-4 border-l-4 border-violet-100">
        <p className="text-muted-foreground text-xs font-medium">Total Annual Spending</p>
        <div className="mt-2">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-muted-foreground">{stats.currentYear}</span>
            <span className="text-2xl font-bold text-violet-100">${stats.currentYearTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-xs text-muted-foreground">{stats.previousYear}</span>
            <span className="text-lg text-muted-foreground">${stats.previousYearTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={`card p-4 border-l-4 ${isPositive ? 'border-expense-100' : 'border-income-100'}`}>
        <p className="text-muted-foreground text-xs font-medium">Year-over-Year Change</p>
        <div className="mt-2 flex items-center gap-3">
          {isPositive ? (
            <TrendingUp className="text-expense-100" size={24} />
          ) : (
            <TrendingDown className="text-income-100" size={24} />
          )}
          <div>
            <p className={`text-2xl font-bold ${changeColor}`}>
              {isPositive ? '+' : ''}{stats.difference.toFixed(2)}
            </p>
            <p className={`text-sm ${changeColor}`}>
              {stats.percentChange > 0 ? '+' : ''}{stats.percentChange.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="card p-4 border-l-4 border-violet-60">
        <p className="text-muted-foreground text-xs font-medium">Monthly Average</p>
        <div className="mt-2">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-muted-foreground">{stats.currentYear}</span>
            <span className="text-2xl font-bold text-violet-100">${stats.currentAverage.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-xs text-muted-foreground">{stats.previousYear}</span>
            <span className="text-lg text-muted-foreground">${stats.previousAverage.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

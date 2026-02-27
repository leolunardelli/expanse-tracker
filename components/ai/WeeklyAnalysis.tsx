'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { getWeeklyAnalysis } from '@/app/actions/ai';
import { formatCurrency } from '@/lib/currency';

type WeeklyData = {
  thisWeekTotal: number;
  lastWeekTotal: number;
  changePercent: number;
  topCategory: string;
  analysis: string;
}

export default function WeeklyAnalysis() {
  const [data, setData] = useState<WeeklyData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const result = await getWeeklyAnalysis();
      setData(result);
    } catch {
      // AI service unavailable – silently handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-income-100" />
          Weekly Analysis
        </h3>
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-surface-light dark:bg-dark-700 rounded-montra-sm" />
          <div className="h-16 bg-surface-light dark:bg-dark-700 rounded-montra-sm" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-income-100" />
          Weekly Analysis
        </h3>
        <p className="text-muted-foreground">
          Add more expenses to see your weekly spending analysis!
        </p>
      </div>
    );
  }

  const isIncrease = data.changePercent > 0;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-income-100" />
          Weekly Analysis
        </h3>
        <button
          onClick={fetchAnalysis}
          className="p-2 text-muted-foreground hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          title="Refresh analysis"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-income-100/5 dark:bg-income-100/10 rounded-montra-sm border border-income-100/20 dark:border-income-100/10">
          <p className="text-xs text-muted-foreground mb-1">This Week</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(data.thisWeekTotal)}
          </p>
        </div>
        <div className="p-4 bg-surface-light dark:bg-dark-700 rounded-montra-sm">
          <p className="text-xs text-muted-foreground mb-1">Last Week</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(data.lastWeekTotal)}
          </p>
        </div>
      </div>

      <div className={`flex items-center justify-center gap-2 p-3 rounded-montra-sm mb-4 ${
        isIncrease 
          ? 'bg-expense-100/5 dark:bg-expense-100/10 text-expense-100' 
          : 'bg-income-100/5 dark:bg-income-100/10 text-income-100'
      }`}>
        {isIncrease ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
        <span className="font-semibold">
          {isIncrease ? '+' : ''}{data.changePercent.toFixed(1)}% {isIncrease ? 'increase' : 'decrease'}
        </span>
      </div>

      <div className="flex items-center justify-between p-3 bg-surface-light dark:bg-dark-700 rounded-montra-sm mb-4">
        <span className="text-sm text-muted-foreground">Top Category This Week</span>
        <span className="px-3 py-1 bg-violet-20 dark:bg-violet-100/10 text-violet-100 dark:text-violet-60 rounded-full text-sm font-medium">
          {data.topCategory}
        </span>
      </div>

      <div className="p-4 bg-violet-20 dark:bg-violet-100/10 rounded-montra-sm border border-violet-100/20 dark:border-violet-100/10">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {data.analysis}
        </p>
      </div>
    </div>
  );
}

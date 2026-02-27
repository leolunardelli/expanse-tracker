'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, RefreshCw } from 'lucide-react';
import { getSpendingPrediction } from '@/app/actions/ai';
import { formatCurrency } from '@/lib/currency';

type Prediction = {
  spentSoFar: number;
  avgPerDay: number;
  projectedTotal: number;
  lastMonthTotal: number;
  daysRemaining: number;
  assessment: string;
}

export default function SpendingPrediction() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const data = await getSpendingPrediction();
      setPrediction(data);
    } catch {
      // AI service unavailable – silently handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  if (loading) {
    return (
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-violet-100" />
          Monthly Prediction
        </h3>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-surface-light dark:bg-dark-700 rounded-montra-sm" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-surface-light dark:bg-dark-700 rounded-montra-sm" />
            <div className="h-16 bg-surface-light dark:bg-dark-700 rounded-montra-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-violet-100" />
          Monthly Prediction
        </h3>
        <p className="text-muted-foreground">
          Add expenses to see your monthly spending prediction!
        </p>
      </div>
    );
  }

  const isOverBudget = prediction.projectedTotal > prediction.lastMonthTotal;
  const percentChange = prediction.lastMonthTotal > 0 
    ? ((prediction.projectedTotal - prediction.lastMonthTotal) / prediction.lastMonthTotal) * 100 
    : 0;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-violet-100" />
          Monthly Prediction
        </h3>
        <button
          onClick={fetchPrediction}
          className="p-2 text-muted-foreground hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          title="Refresh prediction"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-6 p-4 bg-violet-20 dark:bg-violet-100/10 rounded-montra-sm border border-violet-100/20 dark:border-violet-100/10">
        <p className="text-sm text-muted-foreground mb-1">Projected Monthly Total</p>
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(prediction.projectedTotal)}
          </span>
          <span className={`flex items-center gap-1 text-sm font-medium ${
            isOverBudget ? 'text-expense-100' : 'text-income-100'
          }`}>
            {isOverBudget ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(percentChange).toFixed(1)}% vs last month
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-surface-light dark:bg-dark-700 rounded-montra-sm">
          <p className="text-xs text-muted-foreground mb-1">Spent So Far</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(prediction.spentSoFar)}
          </p>
        </div>
        <div className="p-3 bg-surface-light dark:bg-dark-700 rounded-montra-sm">
          <p className="text-xs text-muted-foreground mb-1">Daily Average</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(prediction.avgPerDay)}
          </p>
        </div>
        <div className="p-3 bg-surface-light dark:bg-dark-700 rounded-montra-sm">
          <p className="text-xs text-muted-foreground mb-1">Last Month</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(prediction.lastMonthTotal)}
          </p>
        </div>
        <div className="p-3 bg-surface-light dark:bg-dark-700 rounded-montra-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground mb-1">Days Left</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {prediction.daysRemaining}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-violet-20 dark:bg-violet-100/10 rounded-montra-sm border border-violet-100/20 dark:border-violet-100/10">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">AI Assessment:</span> {prediction.assessment}
        </p>
      </div>
    </div>
  );
}

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
      console.error('Failed to load prediction');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Monthly Prediction
        </h3>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Monthly Prediction
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Monthly Prediction
        </h3>
        <button
          onClick={fetchPrediction}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          title="Refresh prediction"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Projected Monthly Total</p>
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(prediction.projectedTotal)}
          </span>
          <span className={`flex items-center gap-1 text-sm font-medium ${
            isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
          }`}>
            {isOverBudget ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(percentChange).toFixed(1)}% vs last month
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Spent So Far</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(prediction.spentSoFar)}
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Daily Average</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(prediction.avgPerDay)}
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Month</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(prediction.lastMonthTotal)}
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Days Left</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {prediction.daysRemaining}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">AI Assessment:</span> {prediction.assessment}
        </p>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { getWeeklyAnalysis } from '@/app/actions/ai';
import { formatCurrency } from '@/lib/currency';

interface WeeklyData {
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
    } catch (error) {
      console.error('Failed to fetch weekly analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-500" />
          Weekly Analysis
        </h3>
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-500" />
          Weekly Analysis
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add more expenses to see your weekly spending analysis!
        </p>
      </div>
    );
  }

  const isIncrease = data.changePercent > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-500" />
          Weekly Analysis
        </h3>
        <button
          onClick={fetchAnalysis}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          title="Refresh analysis"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Week Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">This Week</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(data.thisWeekTotal)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Week</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(data.lastWeekTotal)}
          </p>
        </div>
      </div>

      {/* Change Indicator */}
      <div className={`flex items-center justify-center gap-2 p-3 rounded-lg mb-4 ${
        isIncrease 
          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
          : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
      }`}>
        {isIncrease ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
        <span className="font-semibold">
          {isIncrease ? '+' : ''}{data.changePercent.toFixed(1)}% {isIncrease ? 'increase' : 'decrease'}
        </span>
      </div>

      {/* Top Category */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">Top Category This Week</span>
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
          {data.topCategory}
        </span>
      </div>

      {/* AI Analysis */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {data.analysis}
        </p>
      </div>
    </div>
  );
}

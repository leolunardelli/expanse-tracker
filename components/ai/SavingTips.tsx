'use client';

import { useEffect, useState } from 'react';
import { Lightbulb, DollarSign, RefreshCw } from 'lucide-react';
import { getSavingTips } from '@/app/actions/ai';
import { formatCurrency } from '@/lib/currency';

type SavingTip = {
  tip: string;
  potentialSaving: number;
  category: string;
}

export default function SavingTips() {
  const [tips, setTips] = useState<SavingTip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const data = await getSavingTips();
      setTips(data);
    } catch {
      console.error('Failed to load tips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Saving Tips
        </h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Saving Tips
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add more expenses to get personalized saving tips!
        </p>
      </div>
    );
  }

  const totalPotentialSaving = tips.reduce((sum, tip) => sum + tip.potentialSaving, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Saving Tips
        </h3>
        <button
          onClick={fetchTips}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          title="Refresh tips"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                {tip.tip}
              </p>
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold text-sm whitespace-nowrap">
                <DollarSign className="w-4 h-4" />
                {formatCurrency(tip.potentialSaving)}
              </span>
            </div>
            <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded">
              {tip.category}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total Potential Monthly Savings
          </span>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalPotentialSaving)}
          </span>
        </div>
      </div>
    </div>
  );
}

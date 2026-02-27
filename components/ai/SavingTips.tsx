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
      // AI service unavailable – silently handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  if (loading) {
    return (
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-warning-100" />
          Saving Tips
        </h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface-light dark:bg-dark-700 rounded-montra-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-warning-100" />
          Saving Tips
        </h3>
        <p className="text-muted-foreground">
          Add more expenses to get personalized saving tips!
        </p>
      </div>
    );
  }

  const totalPotentialSaving = tips.reduce((sum, tip) => sum + tip.potentialSaving, 0);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-warning-100" />
          Saving Tips
        </h3>
        <button
          onClick={fetchTips}
          className="p-2 text-muted-foreground hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          title="Refresh tips"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="p-4 bg-warning-100/5 dark:bg-warning-100/10 rounded-montra-sm border border-warning-100/20 dark:border-warning-100/10"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                {tip.tip}
              </p>
              <span className="flex items-center gap-1 text-income-100 font-semibold text-sm whitespace-nowrap">
                <DollarSign className="w-4 h-4" />
                {formatCurrency(tip.potentialSaving)}
              </span>
            </div>
            <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-warning-100/20 dark:bg-warning-100/20 text-warning-100 rounded-montra-sm">
              {tip.category}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-light-40 dark:border-dark-600">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Total Potential Monthly Savings
          </span>
          <span className="text-lg font-bold text-income-100">
            {formatCurrency(totalPotentialSaving)}
          </span>
        </div>
      </div>
    </div>
  );
}

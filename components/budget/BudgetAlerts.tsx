'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Target } from 'lucide-react';
import { getBudgetAlerts } from '@/app/actions/budget';
import { formatCurrency } from '@/lib/currency';
import Link from 'next/link';

type BudgetAlert = {
  id: string;
  category: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  isNearLimit: boolean;
  alertAt: number;
}

const CATEGORY_EMOJI: Record<string, string> = {
  all: '💰',
  food: '🍔',
  transport: '🚗',
  entertainment: '🎬',
  shopping: '🛍️',
  bills: '📄',
  health: '🏥',
  other: '📦',
};

export default function BudgetAlerts() {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await getBudgetAlerts();
      setAlerts(data);
      setLoading(false);
    };
    fetchAlerts();
  }, []);

  if (loading) {
    return null;
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200 dark:border-red-800 p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-red-700 dark:text-red-400">
            Budget Alerts
          </h3>
        </div>
        
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                alert.isOverBudget 
                  ? 'bg-red-100 dark:bg-red-900/30' 
                  : 'bg-yellow-100 dark:bg-yellow-900/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{CATEGORY_EMOJI[alert.category] || '📦'}</span>
                <div>
                  <p className={`font-medium ${
                    alert.isOverBudget 
                      ? 'text-red-700 dark:text-red-400' 
                      : 'text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {alert.category === 'all' ? 'Total Budget' : alert.category}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatCurrency(alert.spent)} / {formatCurrency(alert.budgetAmount)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  alert.isOverBudget 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {alert.percentage.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500">
                  {alert.isOverBudget ? 'Over budget!' : 'Near limit'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Link 
          href="/budget"
          className="mt-3 flex items-center justify-center gap-2 w-full py-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
        >
          <Target size={16} />
          Manage Budgets
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Target } from 'lucide-react';
import { getBudgetAlerts } from '@/app/actions/budget';
import { formatCurrency } from '@/lib/currency';
import { getCategoryConfig } from '@/lib/design-tokens';
import { CategoryIcon } from '@/components/ui';
import { type CategoryKey } from '@/lib/design-tokens';
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

  if (loading || alerts.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-expense-20 to-warning-20 dark:from-expense-100/10 dark:to-warning-100/10 px-4 py-3 border-b border-gray-100 dark:border-dark-700">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-expense-100" />
            <h3 className="font-semibold text-sm text-expense-100">
              Budget Alerts
            </h3>
            <span className="ml-auto text-xs text-muted-foreground">{alerts.length} alert{alerts.length > 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="p-3 space-y-2">
          {alerts.map((alert) => {
            const config = getCategoryConfig(alert.category);
            return (
              <div
                key={alert.id}
                className={`flex items-center gap-3 p-3 rounded-montra-sm ${
                  alert.isOverBudget
                    ? 'bg-expense-20/50 dark:bg-expense-100/5'
                    : 'bg-warning-20/50 dark:bg-warning-100/5'
                }`}
              >
                <CategoryIcon category={alert.category as CategoryKey} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {alert.category === 'all' ? 'Total Budget' : config.label}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-dark-600 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(alert.percentage, 100)}%`,
                          backgroundColor: alert.isOverBudget ? '#FD3C4A' : '#FCAC12',
                        }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${
                      alert.isOverBudget ? 'text-expense-100' : 'text-warning-100'
                    }`}>
                      {alert.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatCurrency(alert.spent)} / {formatCurrency(alert.budgetAmount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href="/budget"
          className="flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-violet-100 hover:bg-violet-20 dark:hover:bg-violet-100/5 transition border-t border-gray-100 dark:border-dark-700"
        >
          <Target size={14} />
          Manage Budgets
        </Link>
      </div>
    </div>
  );
}

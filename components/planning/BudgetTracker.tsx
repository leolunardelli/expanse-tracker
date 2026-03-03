'use client';

import { formatCurrency } from '@/lib/currency';
import { getCategoryConfig, type CategoryKey } from '@/lib/design-tokens';
import { CategoryIcon } from '@/components/ui';
import { AlertTriangle, CheckCircle, TrendingUp, Wallet } from 'lucide-react';
import Link from 'next/link';

type BudgetStatus = {
  id: string;
  category: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  isNearLimit: boolean;
};

export default function BudgetTracker({
  budgets,
}: {
  budgets: BudgetStatus[];
}) {
  if (budgets.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Wallet className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
        <p className="text-sm text-muted-foreground mb-1">
          No budgets set yet
        </p>
        <p className="text-xs text-muted-foreground">
          Set amounts in Step 3 above, then your spending will be tracked here automatically.
        </p>
      </div>
    );
  }

  const totalBudget = budgets.reduce((s, b) => s + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-4">
      {/* Overall summary */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Total budgeted: <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(totalBudget)}</span>
          </span>
          <span
            className={`text-sm font-semibold ${
              totalRemaining >= 0 ? 'text-income-100' : 'text-expense-100'
            }`}
          >
            {formatCurrency(totalRemaining)} left
          </span>
        </div>
        <div className="w-full h-2.5 bg-surface-light dark:bg-dark-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              totalSpent > totalBudget
                ? 'bg-expense-100'
                : totalSpent / totalBudget > 0.8
                ? 'bg-warning-100'
                : 'bg-income-100'
            }`}
            style={{
              width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatCurrency(totalSpent)} spent of {formatCurrency(totalBudget)} ({((totalSpent / totalBudget) * 100).toFixed(0)}%)
        </p>
      </div>

      {/* Per-category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {budgets.map((b) => {
          const pct = b.budgetAmount > 0 ? (b.spent / b.budgetAmount) * 100 : 0;

          return (
            <div
              key={b.id}
              className={`card p-4 border-l-4 ${
                b.isOverBudget
                  ? 'border-expense-100'
                  : b.isNearLimit
                  ? 'border-warning-100'
                  : 'border-income-100'
              }`}
            >
              {/* Category header */}
              <div className="flex items-center gap-2 mb-3">
                <CategoryIcon category={b.category as CategoryKey} size="sm" />
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {getCategoryConfig(b.category).label}
                </span>
                <span className="ml-auto">
                  {b.isOverBudget ? (
                    <AlertTriangle size={14} className="text-expense-100" />
                  ) : b.isNearLimit ? (
                    <TrendingUp size={14} className="text-warning-100" />
                  ) : (
                    <CheckCircle size={14} className="text-income-100" />
                  )}
                </span>
              </div>

              {/* Amounts */}
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(b.spent)}
                  <span className="mx-1">/</span>
                  {formatCurrency(b.budgetAmount)}
                </span>
                <span
                  className={`text-sm font-bold ${
                    b.isOverBudget ? 'text-expense-100' : 'text-income-100'
                  }`}
                >
                  {b.isOverBudget
                    ? `-${formatCurrency(Math.abs(b.remaining))}`
                    : formatCurrency(b.remaining)}
                  <span className="text-xs font-normal text-muted-foreground ml-1">left</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-surface-light dark:bg-dark-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    b.isOverBudget
                      ? 'bg-expense-100'
                      : b.isNearLimit
                      ? 'bg-warning-100'
                      : 'bg-income-100'
                  }`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {pct.toFixed(0)}% used
              </p>
            </div>
          );
        })}
      </div>

      <div className="text-right">
        <Link
          href="/budget"
          className="text-violet-100 text-xs hover:underline"
        >
          Manage budgets →
        </Link>
      </div>
    </div>
  );
}

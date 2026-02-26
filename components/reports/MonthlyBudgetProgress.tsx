'use client';

import { Target, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

type BudgetItem = {
  category: string;
  budgetAmount: number;
  spent: number;
  percentage: number;
};

type MonthlyBudgetProgressProps = {
  budgets: BudgetItem[];
};

function getProgressColor(percentage: number) {
  if (percentage >= 100) return 'bg-expense-100';
  if (percentage >= 80) return 'bg-warning-100';
  if (percentage >= 50) return 'bg-violet-100';
  return 'bg-income-100';
}

function getStatusIcon(percentage: number) {
  if (percentage >= 100) return <AlertTriangle className="w-4 h-4 text-expense-100" />;
  if (percentage >= 80) return <AlertTriangle className="w-4 h-4 text-warning-100" />;
  return <CheckCircle2 className="w-4 h-4 text-income-100" />;
}

export default function MonthlyBudgetProgress({
  budgets,
}: MonthlyBudgetProgressProps) {
  if (budgets.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-violet-100" />
          Budget Progress
        </h3>
        <p className="text-muted-foreground text-center py-8">
          No budgets set. Set budgets in the Budget page to track progress here.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-violet-100" />
        Budget Progress
      </h3>

      <div className="space-y-4">
        {budgets.map((item) => (
          <div key={item.category}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                {getStatusIcon(item.percentage)}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {formatCurrency(item.spent)}
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(item.budgetAmount)}
                </span>
              </div>
            </div>
            <div className="w-full bg-surface-light dark:bg-dark-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${getProgressColor(item.percentage)}`}
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span
                className={`text-xs font-medium ${
                  item.percentage >= 100
                    ? 'text-expense-100'
                    : item.percentage >= 80
                    ? 'text-warning-100'
                    : 'text-muted-foreground'
                }`}
              >
                {Math.round(item.percentage)}% used
              </span>
              {item.percentage < 100 && (
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(item.budgetAmount - item.spent)} remaining
                </span>
              )}
              {item.percentage >= 100 && (
                <span className="text-xs text-expense-100 font-medium">
                  Over by {formatCurrency(item.spent - item.budgetAmount)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

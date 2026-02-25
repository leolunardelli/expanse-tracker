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
  if (percentage >= 100) return 'bg-red-500';
  if (percentage >= 80) return 'bg-amber-500';
  if (percentage >= 50) return 'bg-blue-500';
  return 'bg-green-500';
}

function getStatusIcon(percentage: number) {
  if (percentage >= 100) return <AlertTriangle className="w-4 h-4 text-red-500" />;
  if (percentage >= 80) return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  return <CheckCircle2 className="w-4 h-4 text-green-500" />;
}

export default function MonthlyBudgetProgress({
  budgets,
}: MonthlyBudgetProgressProps) {
  if (budgets.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          Budget Progress
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No budgets set. Set budgets in the Budget page to track progress here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-purple-500" />
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
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(item.budgetAmount)}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${getProgressColor(item.percentage)}`}
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span
                className={`text-xs font-medium ${
                  item.percentage >= 100
                    ? 'text-red-500'
                    : item.percentage >= 80
                    ? 'text-amber-500'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {Math.round(item.percentage)}% used
              </span>
              {item.percentage < 100 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatCurrency(item.budgetAmount - item.spent)} remaining
                </span>
              )}
              {item.percentage >= 100 && (
                <span className="text-xs text-red-500 font-medium">
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

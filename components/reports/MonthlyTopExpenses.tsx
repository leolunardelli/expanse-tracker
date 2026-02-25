'use client';

import { Trophy } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

type ExpenseItem = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
};

type MonthlyTopExpensesProps = {
  expenses: ExpenseItem[];
  totalSpent: number;
};

const RANK_COLORS = [
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
];

export default function MonthlyTopExpenses({
  expenses,
  totalSpent,
}: MonthlyTopExpensesProps) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Expenses
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No expenses this month
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Top Expenses
      </h3>

      <div className="space-y-3">
        {expenses.map((expense, index) => {
          const percentage =
            totalSpent > 0
              ? Math.round((expense.amount / totalSpent) * 1000) / 10
              : 0;

          return (
            <div
              key={expense.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
            >
              {/* Rank badge */}
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  RANK_COLORS[index] ||
                  'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {index + 1}
              </span>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  {expense.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {expense.category} &bull;{' '}
                  {new Date(expense.date + 'T12:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* Amount + percentage */}
              <div className="text-right shrink-0">
                <p className="font-bold text-gray-900 dark:text-white">
                  {formatCurrency(expense.amount)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {percentage}% of total
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

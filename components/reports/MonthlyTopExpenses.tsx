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
  'bg-warning-20 text-warning-100 dark:bg-warning-100/20 dark:text-warning-100',
  'bg-surface-light text-gray-700 dark:bg-dark-700 dark:text-gray-300',
  'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
];

export default function MonthlyTopExpenses({
  expenses,
  totalSpent,
}: MonthlyTopExpensesProps) {
  if (expenses.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning-100" />
          Top Expenses
        </h3>
        <p className="text-muted-foreground text-center py-8">
          No expenses this month
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-warning-100" />
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
              className="flex items-center gap-3 p-3 rounded-montra-sm hover:bg-surface-light dark:hover:bg-dark-700 transition"
            >
              {/* Rank badge */}
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  RANK_COLORS[index] ||
                  'bg-surface-light text-muted-foreground dark:bg-dark-700'
                }`}
              >
                {index + 1}
              </span>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  {expense.description}
                </p>
                <p className="text-xs text-muted-foreground">
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
                <p className="text-xs text-muted-foreground">
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

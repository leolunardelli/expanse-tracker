import type { Expense } from '../../types/index';
import {
  calculateExpenseStats,
  formatCurrency,
  getCategoryLabel,
} from '../../utils/stats';
import ExpenseChart from './ExpenseChart';

interface DashboardProps {
  expenses: Expense[];
}

export default function Dashboard({ expenses }: DashboardProps) {
  const stats = calculateExpenseStats(expenses);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Expenses */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600 mb-1">Total Expenses</p>
          <p className="text-3xl font-bold text-blue-900">
            {formatCurrency(stats.total)}
          </p>
          <p className="text-xs text-blue-600 mt-2">{stats.count} transactions</p>
        </div>

        {/* Average Expense */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-600 mb-1">
            Average Expense
          </p>
          <p className="text-3xl font-bold text-green-900">
            {formatCurrency(stats.average)}
          </p>
          <p className="text-xs text-green-600 mt-2">Per transaction</p>
        </div>

        {/* Highest Category */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm font-medium text-purple-600 mb-1">
            Top Category
          </p>
          <p className="text-2xl font-bold text-purple-900">
            {stats.highestCategory
              ? getCategoryLabel(stats.highestCategory.category)
              : 'N/A'}
          </p>
          <p className="text-xs text-purple-600 mt-2">
            {stats.highestCategory
              ? formatCurrency(stats.highestCategory.amount)
              : 'No data'}
          </p>
        </div>

        {/* Transaction Count */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <p className="text-sm font-medium text-orange-600 mb-1">
            Transactions
          </p>
          <p className="text-3xl font-bold text-orange-900">{stats.count}</p>
          <p className="text-xs text-orange-600 mt-2">Total recorded</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Spending by Category
        </h3>
        <div className="space-y-3">
          {(
            Object.entries(stats.byCategory) as [
              keyof typeof stats.byCategory,
              number,
            ][]
          )
            .filter(([, amount]) => amount > 0)
            .sort(([, amountA], [, amountB]) => amountB - amountA)
            .map(([category, amount]) => {
              const percentage =
                stats.total > 0 ? (amount / stats.total) * 100 : 0;
              const count = stats.categoryCount[category];

              return (
                <div key={String(category)}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {getCategoryLabel(category as never)}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(amount)} ({count})
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          {Object.values(stats.byCategory).every((amount) => amount === 0) && (
            <p className="text-gray-500 text-center py-8">
              No expenses yet. Add one to see the breakdown!
            </p>
          )}
        </div>
      </div>

      {/* Chart */}
      {expenses.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <ExpenseChart expenses={expenses} />
        </div>
      )}
    </div>
  );
}

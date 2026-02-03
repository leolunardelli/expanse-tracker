import type { Expense } from '../../types/index';
import EmptyState from '../common/EmptyState';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
  isLoading?: boolean;
}

const categoryConfig: Record<string, { icon: string; badge: string }> = {
  food: { icon: '🍔', badge: 'badge-food' },
  transport: { icon: '🚗', badge: 'badge-transport' },
  entertainment: { icon: '🎬', badge: 'badge-entertainment' },
  utilities: { icon: '💡', badge: 'badge-utilities' },
  shopping: { icon: '🛍️', badge: 'badge-shopping' },
  health: { icon: '💊', badge: 'badge-health' },
  other: { icon: '📦', badge: 'badge-other' },
};

export default function ExpenseList({ expenses, onDeleteExpense, onEditExpense, isLoading = false }: ExpenseListProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Capitalize category
  const formatCategory = (category: string) => {
    const labels: Record<string, string> = {
      food: 'Food & Dining',
      transport: 'Transportation',
      entertainment: 'Entertainment',
      utilities: 'Utilities',
      shopping: 'Shopping',
      health: 'Health',
      other: 'Other',
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {expenses.length === 0 ? (
        <div className="glass-card-solid p-8">
          <EmptyState
            title="No expenses yet"
            description="Start tracking your spending by adding your first expense above."
            icon={
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-900/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            }
          />
        </div>
      ) : (
        expenses.map((expense, index) => (
          <div
            key={expense.id}
            className="glass-card-solid p-5 group animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              {/* Left side: Icon & Info */}
              <div className="flex items-center gap-4">
                {/* Category Icon */}
                <div className="w-12 h-12 rounded-xl bg-dark-100 dark:bg-dark-700 flex items-center justify-center text-2xl">
                  {categoryConfig[expense.category]?.icon || '📦'}
                </div>
                
                {/* Info */}
                <div>
                  <p className="font-semibold text-dark-900 dark:text-white mb-1">
                    {expense.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${categoryConfig[expense.category]?.badge || 'badge-other'}`}>
                      {formatCategory(expense.category)}
                    </span>
                    <span className="text-sm text-dark-500 dark:text-dark-400">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side: Amount & Actions */}
              <div className="flex items-center gap-4">
                {/* Amount */}
                <div className="text-right">
                  <p className="text-xl font-bold text-dark-900 dark:text-white">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => onEditExpense(expense)}
                    disabled={isLoading}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isLoading
                        ? 'text-dark-300 cursor-not-allowed'
                        : 'text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    }`}
                    aria-label="Edit expense"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    disabled={isLoading}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isLoading
                        ? 'text-dark-300 cursor-not-allowed'
                        : 'text-dark-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                    aria-label="Delete expense"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
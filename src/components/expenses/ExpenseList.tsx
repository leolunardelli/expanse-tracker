import type { Expense } from '../../types/index';
import EmptyState from '../common/EmptyState';
import Spinner from '../common/Spinner';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
  isLoading?: boolean;
}

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
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Category colors
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-green-100 text-green-800',
      transport: 'bg-blue-100 text-blue-800',
      entertainment: 'bg-purple-100 text-purple-800',
      utilities: 'bg-yellow-100 text-yellow-800',
      shopping: 'bg-pink-100 text-pink-800',
      health: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="space-y-3">
      {expenses.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <EmptyState
            title="No expenses yet"
            description="Start tracking your spending by adding your first expense above."
            icon="💰"
          />
        </div>
      ) : (
        expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          {/* Left side: Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                  expense.category
                )}`}
              >
                {formatCategory(expense.category)}
              </span>
              <span className="text-gray-500 text-sm">
                {formatDate(expense.date)}
              </span>
            </div>
            <p className="text-gray-800 font-medium">{expense.description}</p>
          </div>

          {/* Right side: Amount & Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(expense.amount)}
            </span>
            <button
              onClick={() => onEditExpense(expense)}
              disabled={isLoading}
              className={`p-2 rounded-md transition-colors ${
                isLoading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
              }`}
              aria-label="Edit expense"
              title="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDeleteExpense(expense.id)}
              disabled={isLoading}
              className={`p-2 rounded-md transition-colors flex items-center justify-center ${
                isLoading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-red-600 hover:text-red-800 hover:bg-red-50'
              }`}
              aria-label="Delete expense"
              title="Delete"
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        ))
      )}
    </div>
  );
}
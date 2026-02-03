import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Expense } from '../../types/index';
import { expenseSchema, type ExpenseFormData } from '../../utils/validation';
import Spinner from '../common/Spinner';

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
  isLoading?: boolean;
}

const categoryIcons: Record<string, JSX.Element> = {
  food: <span>🍔</span>,
  transport: <span>🚗</span>,
  entertainment: <span>🎬</span>,
  utilities: <span>💡</span>,
  shopping: <span>🛍️</span>,
  health: <span>💊</span>,
  other: <span>📦</span>,
};

export default function ExpenseForm({ onAddExpense, isLoading = false }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: undefined,
      category: 'food',
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const selectedCategory = watch('category');

  const onSubmit = (data: ExpenseFormData) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: data.date,
      createdAt: new Date().toISOString(),
    };

    onAddExpense(newExpense);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-card-solid p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-display font-semibold text-dark-900 dark:text-white">Add New Expense</h2>
          <p className="text-sm text-dark-500 dark:text-dark-400">Track your spending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500 font-medium">
              $
            </span>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
              className={`input-field pl-8 ${
                errors.amount
                  ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                  : ''
              }`}
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1.5 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.amount.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            Category
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              {categoryIcons[selectedCategory]}
            </span>
            <select
              {...register('category')}
              className={`select-field pl-12 ${
                errors.category
                  ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                  : ''
              }`}
            >
              <option value="food">🍔 Food & Dining</option>
              <option value="transport">🚗 Transportation</option>
              <option value="entertainment">🎬 Entertainment</option>
              <option value="utilities">💡 Utilities</option>
              <option value="shopping">🛍️ Shopping</option>
              <option value="health">💊 Health</option>
              <option value="other">📦 Other</option>
            </select>
          </div>
          {errors.category && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1.5">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            Description
          </label>
          <input
            type="text"
            placeholder="e.g., Coffee at Starbucks"
            {...register('description')}
            className={`input-field ${
              errors.description
                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                : ''
            }`}
          />
          {errors.description && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1.5">{errors.description.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            Date
          </label>
          <input
            type="date"
            {...register('date')}
            className={`input-field ${
              errors.date
                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                : ''
            }`}
          />
          {errors.date && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1.5">{errors.date.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full btn-primary flex items-center justify-center gap-2 ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading && <Spinner size="sm" />}
        {isLoading ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}
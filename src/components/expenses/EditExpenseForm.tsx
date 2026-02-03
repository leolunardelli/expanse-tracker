import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Expense } from '../../types/index';
import { expenseSchema, type ExpenseFormData } from '../../utils/validation';
import Spinner from '../common/Spinner';

interface EditExpenseFormProps {
  expense: Expense;
  onSave: (updatedExpense: Expense) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EditExpenseForm({
  expense,
  onSave,
  onCancel,
  isLoading = false,
}: EditExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    },
  });

  const selectedCategory = watch('category');

  const categoryIcons: Record<string, string> = {
    food: '🍔',
    transport: '🚗',
    entertainment: '🎬',
    utilities: '💡',
    shopping: '🛍️',
    health: '💊',
    other: '📦',
  };

  const onSubmit = (data: ExpenseFormData) => {
    const updatedExpense: Expense = {
      ...expense,
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: data.date,
    };

    onSave(updatedExpense);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
          Description
        </label>
        <input
          type="text"
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

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-1 btn-primary flex items-center justify-center gap-2 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading && <Spinner size="sm" />}
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className={`flex-1 btn-secondary ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

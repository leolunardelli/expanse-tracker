'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { saveBudget } from '@/app/actions/budget';

const CATEGORIES = [
  { value: 'all', label: '💰 Total Budget', color: 'bg-purple-500' },
  { value: 'food', label: '🍔 Food & Dining', color: 'bg-orange-500' },
  { value: 'transport', label: '🚗 Transport', color: 'bg-blue-500' },
  { value: 'entertainment', label: '🎬 Entertainment', color: 'bg-pink-500' },
  { value: 'shopping', label: '🛍️ Shopping', color: 'bg-green-500' },
  { value: 'bills', label: '📄 Bills & Utilities', color: 'bg-red-500' },
  { value: 'health', label: '🏥 Health', color: 'bg-teal-500' },
  { value: 'other', label: '📦 Other', color: 'bg-gray-500' },
];

interface BudgetFormProps {
  existingCategories: string[];
  onSuccess?: () => void;
}

export default function BudgetForm({ existingCategories, onSuccess }: BudgetFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableCategories = CATEGORIES.filter(
    (cat) => !existingCategories.includes(cat.value)
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await saveBudget(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setIsOpen(false);
      onSuccess?.();
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        <Plus size={20} />
        Add Budget
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Set Budget Goal
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            name="category"
            required
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {availableCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Monthly Budget (R$)
          </label>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="1"
            required
            placeholder="1000.00"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alert at (%)
          </label>
          <select
            name="alertAt"
            defaultValue="80"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="50">50% - Early warning</option>
            <option value="70">70% - Moderate</option>
            <option value="80">80% - Standard</option>
            <option value="90">90% - Late warning</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Get alerted when spending reaches this percentage
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || availableCategories.length === 0}
          className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
        >
          {loading ? 'Saving...' : 'Save Budget'}
        </button>
      </form>
    </div>
  );
}

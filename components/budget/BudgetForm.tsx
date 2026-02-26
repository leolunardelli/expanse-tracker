'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { saveBudget } from '@/app/actions/budget';
import { BUDGET_CATEGORIES } from '@/lib/categories';

const CATEGORIES = BUDGET_CATEGORIES;

type BudgetFormProps = {
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
        className="btn-primary flex items-center gap-2 px-4 py-2"
      >
        <Plus size={18} />
        Add Budget
      </button>
    );
  }

  return (
    <div className="card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Set Budget Goal
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 text-muted-foreground hover:bg-surface-light dark:hover:bg-dark-700 rounded-full transition"
        >
          <X size={18} />
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
            className="input"
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
            Monthly Budget ($)
          </label>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="1"
            required
            placeholder="1000.00"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alert at (%)
          </label>
          <select
            name="alertAt"
            defaultValue="80"
            className="input"
          >
            <option value="50">50% - Early warning</option>
            <option value="70">70% - Moderate</option>
            <option value="80">80% - Standard</option>
            <option value="90">90% - Late warning</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Get alerted when spending reaches this percentage
          </p>
        </div>

        {error && (
          <p className="text-expense-100 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || availableCategories.length === 0}
          className="btn-primary w-full py-2.5"
        >
          {loading ? 'Saving...' : 'Save Budget'}
        </button>
      </form>
    </div>
  );
}

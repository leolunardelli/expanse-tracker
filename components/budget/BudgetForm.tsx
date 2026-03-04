'use client';

import { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';
import { saveBudget } from '@/app/actions/budget';
import { createCustomCategory } from '@/app/actions/categories';
import { mergeBudgetCategories } from '@/lib/categories';

const COLOR_OPTIONS = [
  { value: '#FD3C4A', label: 'Red' },
  { value: '#0077FF', label: 'Blue' },
  { value: '#00A86B', label: 'Green' },
  { value: '#FCAC12', label: 'Amber' },
  { value: '#0D7390', label: 'Teal' },
  { value: '#9B59B6', label: 'Purple' },
  { value: '#E67E22', label: 'Orange' },
  { value: '#91919F', label: 'Gray' },
];

type CustomCat = { name: string; color: string; icon: string };

type BudgetFormProps = {
  existingCategories: string[];
  customCategories?: CustomCat[];
  onSuccess?: () => void;
}

export default function BudgetForm({ existingCategories, customCategories = [], onSuccess }: BudgetFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#91919F');
  const [newCatLoading, setNewCatLoading] = useState(false);
  const [localCustomCats, setLocalCustomCats] = useState<CustomCat[]>(customCategories);

  const allCategories = mergeBudgetCategories(localCustomCats);
  const availableCategories = allCategories.filter(
    (cat) => !existingCategories.includes(cat.value)
  );

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    setNewCatLoading(true);
    setError('');

    const formData = new FormData();
    formData.set('name', newCatName.trim());
    formData.set('color', newCatColor);
    formData.set('icon', 'Tag');

    const result = await createCustomCategory(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setLocalCustomCats((prev) => [...prev, { name: newCatName.trim(), color: newCatColor, icon: 'Tag' }]);
      setNewCatName('');
      setNewCatColor('#91919F');
      setShowNewCategory(false);
    }
    setNewCatLoading(false);
  };

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

          {!showNewCategory ? (
            <button
              type="button"
              onClick={() => setShowNewCategory(true)}
              className="mt-2 text-sm text-violet-100 hover:underline font-medium flex items-center gap-1"
            >
              <Tag size={14} />
              Create new category
            </button>
          ) : (
            <div className="mt-3 p-3 border border-violet-40 dark:border-violet-100/20 rounded-montra-sm bg-violet-20/50 dark:bg-violet-100/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Category</span>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(false)}
                  className="p-1 text-muted-foreground hover:text-gray-900 dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name (e.g. Investments)"
                className="input text-sm"
                maxLength={60}
              />
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setNewCatColor(c.value)}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        newCatColor === c.value ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={newCatLoading || !newCatName.trim()}
                className="btn-primary text-sm px-3 py-1.5 w-full"
              >
                {newCatLoading ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          )}
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

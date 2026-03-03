'use client';

import { useState, useRef } from 'react';
import { Plus, X, RefreshCw } from 'lucide-react';
import { createExpense } from '@/app/actions/expenses';
import { EXPENSE_CATEGORIES } from '@/lib/categories';
import { useToast } from '@/components/Toast';

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export default function AddRecurringForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState('monthly');
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set('isRecurring', 'true');
    formData.set('recurrenceType', recurrenceType);
    formData.set('tags', '');
    formData.set('notes', '');

    try {
      await createExpense(formData);
      formRef.current?.reset();
      setRecurrenceType('monthly');
      setOpen(false);
      toast('Recurring expense added', 'success');
    } catch {
      toast('Failed to add recurring expense', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
      >
        <Plus size={16} />
        Add Recurring Expense
      </button>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RefreshCw size={18} className="text-violet-100" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            New Recurring Expense
          </h3>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1.5 rounded-lg text-muted hover:bg-surface-light dark:hover:bg-dark-700 transition"
        >
          <X size={18} />
        </button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              required
              className="input"
              placeholder="Netflix, Rent, Gym..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              required
              step="0.01"
              min="0"
              className="input"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select name="category" className="input">
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frequency
            </label>
            <select
              value={recurrenceType}
              onChange={(e) => setRecurrenceType(e.target.value)}
              className="input"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="date"
              defaultValue={getTodayDate()}
              required
              className="input"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 py-2.5 text-sm"
          >
            {loading ? 'Adding...' : 'Add Recurring Expense'}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="btn-secondary px-4 py-2.5 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

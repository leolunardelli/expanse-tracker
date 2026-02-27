'use client';

import { useState, useRef } from 'react';
import { Plus, Receipt } from 'lucide-react';
import { addPlannedExpense } from '@/app/actions/planning';
import { EXPENSE_CATEGORIES } from '@/lib/categories';
import { useToast } from '@/components/Toast';

const CATEGORIES = EXPENSE_CATEGORIES.map((c) => c.value);

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'daily', label: 'Daily' },
];

export default function PlannedExpenseForm() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set('isFixed', isFixed.toString());

    try {
      await addPlannedExpense(formData);
      formRef.current?.reset();
      setIsFixed(true);
      setOpen(false);
    } catch {
      toast('Failed to save planned expense', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-light-40 dark:border-dark-600 rounded-montra text-muted-foreground hover:border-warning-100 hover:text-warning-100 transition"
      >
        <Plus size={18} />
        Add planned expense
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="border border-warning-100/20 dark:border-warning-100/10 rounded-montra p-4 bg-warning-20/50 dark:bg-warning-100/5 space-y-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <Receipt size={16} className="text-warning-100" />
        <h4 className="font-medium text-warning-100 text-sm">New planned expense</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
          <input
            type="text"
            name="description"
            required
            placeholder="e.g. Rent"
            className="input text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            required
            step="0.01"
            min="0"
            placeholder="0.00"
            className="input text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
          <select
            name="category"
            className="input text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Frequency</label>
          <select
            name="frequency"
            className="input text-sm"
          >
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Due day</label>
          <input
            type="number"
            name="dueDay"
            min="1"
            max="31"
            placeholder="e.g. 10"
            className="input text-sm"
          />
        </div>
      </div>

      {/* Fixed vs Variable toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsFixed(true)}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-montra-sm border transition ${
            isFixed
              ? 'bg-warning-20 dark:bg-warning-100/10 border-warning-100/30 text-warning-100'
              : 'border-light-40 dark:border-dark-600 text-muted-foreground hover:bg-surface-light dark:hover:bg-dark-700'
          }`}
        >
          Fixed (e.g. rent)
        </button>
        <button
          type="button"
          onClick={() => setIsFixed(false)}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-montra-sm border transition ${
            !isFixed
              ? 'bg-warning-20 dark:bg-warning-100/10 border-warning-100/30 text-warning-100'
              : 'border-light-40 dark:border-dark-600 text-muted-foreground hover:bg-surface-light dark:hover:bg-dark-700'
          }`}
        >
          Variable (e.g. food)
        </button>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-outline flex-1 px-3 py-2 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 px-3 py-2 text-sm"
        >
          {loading ? 'Saving...' : 'Add'}
        </button>
      </div>
    </form>
  );
}

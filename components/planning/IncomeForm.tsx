'use client';

import { useState, useRef } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { addIncome } from '@/app/actions/planning';

const INCOME_TYPES = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investment', label: 'Investment' },
  { value: 'rental', label: 'Rental income' },
  { value: 'other', label: 'Other' },
];

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'weekly', label: 'Weekly' },
];

export default function IncomeForm() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await addIncome(formData);
      formRef.current?.reset();
      setOpen(false);
    } catch {
      alert('Failed to save income');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-light-40 dark:border-dark-600 rounded-montra text-muted-foreground hover:border-income-100 hover:text-income-100 transition"
      >
        <Plus size={18} />
        Add income source
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="border border-income-100/20 dark:border-income-100/10 rounded-montra p-4 bg-income-20/50 dark:bg-income-100/5 space-y-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <DollarSign size={16} className="text-income-100" />
        <h4 className="font-medium text-income-100 text-sm">New income source</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
          <input
            type="text"
            name="description"
            required
            placeholder="e.g. Salary"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
          <select
            name="type"
            className="input text-sm"
          >
            {INCOME_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
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

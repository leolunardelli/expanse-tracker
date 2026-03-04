'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { createExpense } from '@/app/actions/expenses';
import { getCustomCategories } from '@/app/actions/categories';
import { EXPENSE_CATEGORIES, mergeExpenseCategories } from '@/lib/categories';

export default function QuickAddFAB() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(EXPENSE_CATEGORIES);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    getCustomCategories().then((custom) => {
      if (custom.length > 0) {
        setCategories(mergeExpenseCategories(custom.map((c: { name: string; color: string; icon: string }) => ({ name: c.name, color: c.color, icon: c.icon }))));
      }
    });
  }, []);

  function getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createExpense(formData);
      formRef.current?.reset();
      setOpen(false);
    } catch {
      // silently fail — toast will be added later
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[5.5rem] right-4 lg:bottom-8 lg:right-8 z-50 w-14 h-14 rounded-full bg-violet-100 text-white shadow-fab flex items-center justify-center hover:bg-violet-80 active:scale-95 transition-all"
        aria-label="Add expense"
      >
        <Plus size={28} />
      </button>

      {/* Quick add modal */}
      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <div className="flex items-end sm:items-center justify-center min-h-full">
            <div
              className="bottom-sheet sm:relative sm:rounded-montra sm:max-w-md sm:w-full sm:mx-4 sm:my-8 sm:animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-3 sm:hidden">
                <div className="w-10 h-1 bg-muted-light dark:bg-muted-dark rounded-full" />
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark-900 dark:text-white">
                  Add Expense
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-muted hover:bg-surface-light dark:hover:bg-dark-700 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="Description"
                  className="input"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    name="amount"
                    required
                    step="0.01"
                    min="0"
                    placeholder="Amount"
                    className="input"
                  />
                  <input
                    type="date"
                    name="date"
                    defaultValue={getTodayDate()}
                    required
                    className="input"
                  />
                </div>

                <select name="category" className="input">
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.value === 'Other' ? `${cat.label} (AI)` : cat.label}
                    </option>
                  ))}
                </select>

                <input type="hidden" name="isRecurring" value="false" />
                <input type="hidden" name="tags" value="" />
                <input type="hidden" name="notes" value="" />

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Adding...' : 'Add Expense'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

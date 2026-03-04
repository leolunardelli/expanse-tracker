'use client';

import { useState, useEffect } from 'react';
import { X, RefreshCw, Save, Loader2 } from 'lucide-react';
import { updateExpense } from '@/app/actions/expenses';
import TagInput from '@/components/tags/TagInput';
import NoteInput from '@/components/tags/NoteInput';
import { EXPENSE_CATEGORIES, mergeExpenseCategories } from '@/lib/categories';
import { getCustomCategories } from '@/app/actions/categories';
import { getCategoryConfig } from '@/lib/design-tokens';
import { useToast } from '@/components/Toast';

type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date | string;
  isRecurring?: boolean;
  recurrenceType?: string | null;
  tags?: string[];
  notes?: string | null;
}

type EditExpenseModalProps = {
  expense: Expense | null;
  onClose: () => void;
}

export default function EditExpenseModal({ expense, onClose }: EditExpenseModalProps) {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState('monthly');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [categories, setCategories] = useState(EXPENSE_CATEGORIES);
  const { toast } = useToast();

  useEffect(() => {
    getCustomCategories().then((custom) => {
      if (custom.length > 0) {
        setCategories(mergeExpenseCategories(custom.map((c: { name: string; color: string; icon: string }) => ({ name: c.name, color: c.color, icon: c.icon }))));
      }
    });
  }, []);

  useEffect(() => {
    if (expense) {
      setDescription(expense.description);
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      const d = new Date(expense.date);
      setDate(d.toISOString().split('T')[0]);
      setIsRecurring(expense.isRecurring || false);
      setRecurrenceType(expense.recurrenceType || 'monthly');
      setTags(expense.tags || []);
      setNotes(expense.notes || '');
    }
  }, [expense]);

  if (!expense) return null;

  const categoryConfig = getCategoryConfig(category);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateExpense(expense!.id, {
        description,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        isRecurring,
        recurrenceType: isRecurring ? recurrenceType : null,
        tags,
        notes: notes || null,
      });
      toast('Expense updated', 'success');
      onClose();
    } catch {
      toast('Update failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-800 rounded-t-[24px] max-h-[90vh] overflow-y-auto animate-slide-up sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bottom-auto sm:rounded-montra-lg sm:max-w-md sm:w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: categoryConfig.color }}
            />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Transaction</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-light dark:bg-dark-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-dark-600 transition"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                step="0.01"
                min="0"
                className="input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-montra-sm bg-surface-light dark:bg-dark-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 text-violet-100 border-gray-300 rounded focus:ring-violet-100"
              />
              <RefreshCw size={16} className={isRecurring ? 'text-violet-100' : 'text-muted-foreground'} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recurring expense</span>
            </label>

            {isRecurring && (
              <select
                value={recurrenceType}
                onChange={(e) => setRecurrenceType(e.target.value)}
                className="input mt-2"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
                <option value="yearly">Yearly</option>
              </select>
            )}
          </div>

          <TagInput tags={tags} onChange={setTags} />
          <NoteInput value={notes} onChange={setNotes} />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-montra-md border border-gray-200 dark:border-dark-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-surface-light dark:hover:bg-dark-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

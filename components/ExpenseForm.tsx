'use client';

import { useState, useRef } from 'react';
import { createExpense } from '@/app/actions/expenses';
import { RefreshCw } from 'lucide-react';
import TagInput from '@/components/tags/TagInput';
import NoteInput from '@/components/tags/NoteInput';
import { EXPENSE_CATEGORIES } from '@/lib/categories';
import { useToast } from '@/components/Toast';

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export default function ExpenseForm() {
  const [loading, setLoading] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.set('isRecurring', isRecurring.toString());
    formData.set('tags', tags.join(','));
    formData.set('notes', notes);
    
    try {
      await createExpense(formData);
      formRef.current?.reset();
      setIsRecurring(false);
      setTags([]);
      setNotes('');
      toast('Expense added successfully', 'success');
    } catch {
      toast('Failed to save', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-5">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Expense</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <input
            type="text"
            name="description"
            required
            className="input"
            placeholder="Coffee, Uber, etc."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="date"
              name="date"
              defaultValue={getTodayDate()}
              required
              className="input"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select
            name="category"
            className="input"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.value === 'Other' ? `${cat.label} (AI will categorize)` : cat.label}
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
              name="recurrenceType"
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

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2.5"
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}

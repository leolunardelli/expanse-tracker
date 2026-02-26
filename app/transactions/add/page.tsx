'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign, Calendar, Tag, FileText, RefreshCw, Check } from 'lucide-react';
import { createExpense } from '@/app/actions/expenses';
import { EXPENSE_CATEGORIES } from '@/lib/categories';
import { getCategoryConfig } from '@/lib/design-tokens';
import TagInput from '@/components/tags/TagInput';
import NoteInput from '@/components/tags/NoteInput';

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export default function AddTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Other');
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set('isRecurring', isRecurring.toString());
    formData.set('tags', tags.join(','));
    formData.set('notes', notes);
    formData.set('category', selectedCategory);

    try {
      await createExpense(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);
    } catch {
      alert('Failed to save');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-dark-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-income-100 flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <Check size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction Added!</h2>
          <p className="text-sm text-muted-foreground mt-1">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const categoryConfig = getCategoryConfig(selectedCategory);

  return (
    <div className="min-h-screen bg-surface-light dark:bg-dark-800">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-6 rounded-b-[24px]"
        style={{ backgroundColor: categoryConfig.color }}
      >
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-lg font-semibold text-white">Add Transaction</h1>
          </div>

          {/* Amount Input */}
          <div className="mb-2">
            <p className="text-white/60 text-sm font-medium mb-1">How much?</p>
            <div className="flex items-center gap-1">
              <span className="text-4xl font-bold text-white">$</span>
              <input
                form="tx-form"
                type="number"
                name="amount"
                required
                step="0.01"
                min="0"
                placeholder="0"
                className="text-4xl font-bold text-white bg-transparent border-none outline-none w-full placeholder-white/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-lg mx-auto px-4 -mt-2">
        <div className="card p-5 rounded-montra-lg">
          <form id="tx-form" ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            {/* Category Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Category
              </label>
              <div className="grid grid-cols-5 gap-2">
                {EXPENSE_CATEGORIES.map((cat) => {
                  const config = getCategoryConfig(cat.value);
                  const isSelected = selectedCategory === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-montra-sm transition-all ${
                        isSelected
                          ? 'bg-violet-20 dark:bg-violet-100/10 ring-2 ring-violet-100'
                          : 'hover:bg-surface-light dark:hover:bg-dark-700'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: isSelected ? config.color : `${config.color}20` }}
                      >
                        <Tag size={14} style={{ color: isSelected ? 'white' : config.color }} />
                      </div>
                      <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 text-center leading-tight">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <FileText size={14} className="text-muted-foreground" />
                Description
              </label>
              <input
                type="text"
                name="description"
                required
                placeholder="What did you spend on?"
                className="input"
              />
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Calendar size={14} className="text-muted-foreground" />
                Date
              </label>
              <input
                type="date"
                name="date"
                defaultValue={getTodayDate()}
                required
                className="input"
              />
            </div>

            {/* Recurring */}
            <div className="p-3 rounded-montra-sm bg-surface-light dark:bg-dark-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4 text-violet-100 border-gray-300 dark:border-gray-600 rounded focus:ring-violet-100"
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

            {/* Tags & Notes */}
            <TagInput tags={tags} onChange={setTags} />
            <NoteInput value={notes} onChange={setNotes} />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <DollarSign size={18} className="animate-spin" />
                  Adding...
                </span>
              ) : (
                'Add Transaction'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

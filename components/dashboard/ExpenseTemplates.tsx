'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Plus, X, Zap } from 'lucide-react';
import { createExpense } from '@/app/actions/expenses';
import { useToast } from '@/components/Toast';
import { formatCurrency } from '@/lib/currency';

export interface ExpenseTemplate {
  id: string;
  description: string;
  amount: number;
  category: string;
}

const STORAGE_KEY = 'expense-templates';

function loadTemplates(): ExpenseTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTemplates(templates: ExpenseTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export default function ExpenseTemplates() {
  const [templates, setTemplates] = useState<ExpenseTemplate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Other');
  const { toast } = useToast();

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  function handleSaveTemplate(e: React.FormEvent) {
    e.preventDefault();
    if (!newDesc || !newAmount) return;

    const template: ExpenseTemplate = {
      id: `tpl-${Date.now()}`,
      description: newDesc,
      amount: parseFloat(newAmount),
      category: newCategory,
    };

    const updated = [...templates, template];
    setTemplates(updated);
    saveTemplates(updated);
    setNewDesc('');
    setNewAmount('');
    setNewCategory('Other');
    setShowForm(false);
    toast('Template saved', 'success');
  }

  function handleDelete(id: string) {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    saveTemplates(updated);
  }

  async function handleQuickAdd(template: ExpenseTemplate) {
    setLoading(template.id);
    try {
      const formData = new FormData();
      formData.set('description', template.description);
      formData.set('amount', template.amount.toString());
      formData.set('category', template.category);
      formData.set('date', new Date().toISOString().split('T')[0]);
      formData.set('isRecurring', 'false');
      formData.set('tags', '');
      formData.set('notes', '');
      await createExpense(formData);
      toast(`Added "${template.description}"`, 'success');
    } catch {
      toast('Failed to add expense', 'error');
    } finally {
      setLoading(null);
    }
  }

  if (templates.length === 0 && !showForm) {
    return (
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-warning-100" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Quick Add</h3>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-3">
            Save templates for expenses you add frequently
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-secondary text-sm px-4 py-2 inline-flex items-center gap-1.5"
          >
            <Plus size={14} />
            Create Template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-warning-100" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Quick Add</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-icon"
          title="New template"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {/* Template buttons */}
      {templates.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {templates.map((tpl) => (
            <div key={tpl.id} className="group relative">
              <button
                onClick={() => handleQuickAdd(tpl)}
                disabled={loading === tpl.id}
                className="flex items-center gap-2 px-3 py-2 rounded-montra-sm bg-surface-light dark:bg-dark-700 hover:bg-violet-20 dark:hover:bg-violet-100/10 transition-colors text-sm disabled:opacity-50"
              >
                <Bookmark size={12} className="text-violet-100" />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {tpl.description}
                </span>
                <span className="text-muted-foreground text-xs">
                  {formatCurrency(tpl.amount)}
                </span>
              </button>
              <button
                onClick={() => handleDelete(tpl.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-expense-100 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                title="Remove template"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New template form */}
      {showForm && (
        <form onSubmit={handleSaveTemplate} className="space-y-2 pt-2 border-t border-border-light dark:border-border-dark">
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description"
              required
              className="input text-sm col-span-1"
            />
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="Amount"
              step="0.01"
              min="0"
              required
              className="input text-sm"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="input text-sm"
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Bills">Bills</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" className="btn-primary text-sm w-full py-2">
            Save Template
          </button>
        </form>
      )}
    </div>
  );
}

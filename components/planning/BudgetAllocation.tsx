'use client';

import { useState, useTransition } from 'react';
import { PieChart, Save, RotateCcw, RefreshCw, Plus, X, Tag, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { saveBudgetAllocations } from '@/app/actions/planning';
import { createCustomCategory, deleteCustomCategory } from '@/app/actions/categories';
import { useToast } from '@/components/Toast';

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

type RecurringByCategory = {
  category: string;
  total: number;
  items: { description: string; monthlyAmount: number }[];
};

type BudgetItem = {
  category: string;
  amount: number;
};

type CustomCat = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

type Props = {
  income: number;
  recurringTotal: number;
  currentBudgets: BudgetItem[];
  recurringByCategory: RecurringByCategory[];
  categories: string[];
  customCategories?: CustomCat[];
};

export default function BudgetAllocation({
  income,
  recurringTotal,
  currentBudgets,
  recurringByCategory,
  categories: initialCategories,
  customCategories: initialCustom = [],
}: Props) {
  const budgetMap = new Map(currentBudgets.map((b) => [b.category, b.amount]));
  const recurringMap = new Map(recurringByCategory.map((r) => [r.category, r]));
  const availableIncome = income - recurringTotal;

  const [customCats, setCustomCats] = useState<CustomCat[]>(initialCustom);
  const allCategories = [...initialCategories, ...customCats.map((c) => c.name).filter((n) => !initialCategories.includes(n))];
  const customCatNames = new Set(customCats.map((c) => c.name));

  const [allocations, setAllocations] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    [...initialCategories, ...initialCustom.map((c) => c.name)].forEach((cat) => {
      const amt = budgetMap.get(cat) || budgetMap.get(cat.toLowerCase()) || 0;
      initial[cat] = amt > 0 ? amt.toString() : '';
    });
    return initial;
  });

  // New category form state
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#91919F');
  const [newCatLoading, setNewCatLoading] = useState(false);

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const totalAllocated = Object.values(allocations).reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  );
  const unallocated = availableIncome - totalAllocated;
  const allocatedPct = availableIncome > 0 ? (totalAllocated / availableIncome) * 100 : 0;

  function handleChange(cat: string, value: string) {
    setAllocations((prev) => ({ ...prev, [cat]: value }));
  }

  function handleReset() {
    const reset: Record<string, string> = {};
    allCategories.forEach((cat) => {
      reset[cat] = '';
    });
    setAllocations(reset);
  }

  function handleSave() {
    const data = allCategories.map((cat) => ({
      category: cat,
      amount: parseFloat(allocations[cat]) || 0,
    }));

    startTransition(async () => {
      try {
        await saveBudgetAllocations(data);
        toast('Budget allocation saved', 'success');
      } catch {
        toast('Failed to save', 'error');
      }
    });
  }

  async function handleCreateCategory() {
    if (!newCatName.trim()) return;
    setNewCatLoading(true);

    const formData = new FormData();
    formData.set('name', newCatName.trim());
    formData.set('color', newCatColor);
    formData.set('icon', 'Tag');

    const result = await createCustomCategory(formData);
    if (result.error) {
      toast(result.error, 'error');
    } else if (result.category) {
      const cat = result.category;
      setCustomCats((prev) => [...prev, { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon }]);
      setAllocations((prev) => ({ ...prev, [cat.name]: '' }));
      setNewCatName('');
      setNewCatColor('#91919F');
      setShowNewCat(false);
      toast(`Category "${cat.name}" created`, 'success');
    }
    setNewCatLoading(false);
  }

  async function handleDeleteCategory(cat: CustomCat) {
    const result = await deleteCustomCategory(cat.id);
    if (result.error) {
      toast(result.error, 'error');
    } else {
      setCustomCats((prev) => prev.filter((c) => c.id !== cat.id));
      setAllocations((prev) => {
        const next = { ...prev };
        delete next[cat.name];
        return next;
      });
      toast(`Category "${cat.name}" deleted`, 'success');
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <PieChart size={18} className="text-violet-100" />
          Allocate Remaining Budget
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="btn-icon" title="Reset all">
            <RotateCcw size={14} />
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            <Save size={12} />
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Available income summary */}
      <div className="mb-4 p-3 rounded-montra-sm bg-surface-light dark:bg-dark-700">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">
            Available:{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(availableIncome)}
            </span>
            <span className="text-xs ml-1">
              ({formatCurrency(income)} − {formatCurrency(recurringTotal)} fixed)
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            Allocated:{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(totalAllocated)}
            </span>
          </span>
          <span
            className={`font-semibold ${
              unallocated < 0 ? 'text-expense-100' : 'text-income-100'
            }`}
          >
            {formatCurrency(Math.abs(unallocated))}
            <span className="text-xs text-muted-foreground font-normal ml-1">
              {unallocated >= 0 ? 'unallocated' : 'over budget'}
            </span>
          </span>
        </div>
        <div className="w-full h-2.5 bg-white dark:bg-dark-900 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              allocatedPct > 100
                ? 'bg-expense-100'
                : allocatedPct > 80
                ? 'bg-warning-100'
                : 'bg-violet-100'
            }`}
            style={{ width: `${Math.min(allocatedPct, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {allocatedPct.toFixed(0)}% of available income allocated
        </p>
      </div>

      {/* Category inputs */}
      <div className="space-y-1">
        {allCategories.map((cat) => {
          const val = parseFloat(allocations[cat]) || 0;
          const pct = availableIncome > 0 ? (val / availableIncome) * 100 : 0;
          const recurring = recurringMap.get(cat);
          const isCustom = customCatNames.has(cat);
          const customCat = isCustom ? customCats.find((c) => c.name === cat) : null;

          return (
            <div key={cat} className="py-2 px-2 rounded-montra-sm hover:bg-surface-light dark:hover:bg-dark-700 transition">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-28 flex-shrink-0">
                  {isCustom && customCat && (
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: customCat.color }} />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {cat}
                  </span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={allocations[cat]}
                    onChange={(e) => handleChange(cat, e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="input text-sm w-full pr-12"
                  />
                  {val > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {pct.toFixed(0)}%
                    </span>
                  )}
                </div>
                {isCustom && customCat && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(customCat)}
                    className="p-1.5 text-muted-foreground hover:text-expense-100 transition rounded-full hover:bg-expense-20"
                    title={`Delete ${cat}`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              {/* Show recurring expenses already committed in this category */}
              {recurring && (
                <div className="ml-[calc(7rem+0.75rem)] mt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <RefreshCw size={10} className="text-violet-100" />
                    <span>
                      {formatCurrency(recurring.total)} already in fixed bills
                      ({recurring.items.map((i) => i.description).join(', ')})
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create new category */}
      <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
        {!showNewCat ? (
          <button
            type="button"
            onClick={() => setShowNewCat(true)}
            className="text-sm text-violet-100 hover:underline font-medium flex items-center gap-1.5"
          >
            <Plus size={14} />
            Add custom category
          </button>
        ) : (
          <div className="p-3 border border-violet-40 dark:border-violet-100/20 rounded-montra-sm bg-violet-20/50 dark:bg-violet-100/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Tag size={14} className="text-violet-100" />
                New Category
              </span>
              <button
                type="button"
                onClick={() => setShowNewCat(false)}
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
    </div>
  );
}

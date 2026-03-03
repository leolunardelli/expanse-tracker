'use client';

import { useState, useTransition } from 'react';
import { PieChart, Save, RotateCcw } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { saveBudgetAllocations } from '@/app/actions/planning';
import { useToast } from '@/components/Toast';

type BudgetItem = {
  category: string;
  amount: number;
};

type Props = {
  income: number;
  currentBudgets: BudgetItem[];
  categories: string[];
};

export default function BudgetAllocation({
  income,
  currentBudgets,
  categories,
}: Props) {
  const budgetMap = new Map(currentBudgets.map((b) => [b.category, b.amount]));

  const [allocations, setAllocations] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    categories.forEach((cat) => {
      const amt = budgetMap.get(cat) || budgetMap.get(cat.toLowerCase()) || 0;
      initial[cat] = amt > 0 ? amt.toString() : '';
    });
    return initial;
  });

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const totalAllocated = Object.values(allocations).reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  );
  const unallocated = income - totalAllocated;
  const allocatedPct = income > 0 ? (totalAllocated / income) * 100 : 0;

  function handleChange(cat: string, value: string) {
    setAllocations((prev) => ({ ...prev, [cat]: value }));
  }

  function handleReset() {
    const reset: Record<string, string> = {};
    categories.forEach((cat) => {
      reset[cat] = '';
    });
    setAllocations(reset);
  }

  function handleSave() {
    const data = categories
      .map((cat) => ({
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

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <PieChart size={18} className="text-violet-100" />
          Budget Allocation
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="btn-icon"
            title="Reset all"
          >
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

      {/* Summary bar */}
      <div className="mb-4 p-3 rounded-montra-sm bg-surface-light dark:bg-dark-700">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            Income: <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(income)}</span>
          </span>
          <span className={`font-semibold ${unallocated < 0 ? 'text-expense-100' : 'text-income-100'}`}>
            {unallocated >= 0 ? formatCurrency(unallocated) : `-${formatCurrency(Math.abs(unallocated))}`}
            <span className="text-xs text-muted-foreground font-normal ml-1">unallocated</span>
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
          {allocatedPct.toFixed(0)}% of income allocated
        </p>
      </div>

      {/* Category inputs */}
      <div className="space-y-2">
        {categories.map((cat) => {
          const val = parseFloat(allocations[cat]) || 0;
          const pct = income > 0 ? (val / income) * 100 : 0;

          return (
            <div
              key={cat}
              className="flex items-center gap-3 py-1.5"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300 w-28 truncate flex-shrink-0">
                {cat}
              </span>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

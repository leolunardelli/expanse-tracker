'use client';

import { useState } from 'react';
import { Trash2, Pencil, DollarSign, TrendingUp, Briefcase, Home, MoreHorizontal } from 'lucide-react';
import { deleteIncome, updateIncome } from '@/app/actions/planning';
import { toMonthly } from '@/lib/planning';
import { formatCurrency } from '@/lib/currency';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { useToast } from '@/components/Toast';

type Income = {
  id: string;
  description: string;
  amount: number;
  type: string;
  frequency: string;
  isActive: boolean;
};

const TYPE_CONFIG: Record<string, { icon: typeof DollarSign; color: string; label: string }> = {
  salary: { icon: Briefcase, color: 'text-income-100 bg-income-20 dark:bg-income-100/10', label: 'Salary' },
  freelance: { icon: TrendingUp, color: 'text-info-100 bg-info-100/10 dark:bg-info-100/10', label: 'Freelance' },
  investment: { icon: TrendingUp, color: 'text-violet-100 bg-violet-20 dark:bg-violet-100/10', label: 'Investment' },
  rental: { icon: Home, color: 'text-warning-100 bg-warning-20 dark:bg-warning-100/10', label: 'Rental' },
  other: { icon: MoreHorizontal, color: 'text-muted-foreground bg-surface-light dark:bg-dark-700', label: 'Other' },
};

const FREQ_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  biweekly: 'Biweekly',
  weekly: 'Weekly',
};

export default function IncomeList({ incomes }: { incomes: Income[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const totalMonthly = incomes
    .filter((i) => i.isActive)
    .reduce((sum, i) => sum + toMonthly(i.amount, i.frequency), 0);

  async function handleDelete(id: string) {
    setDeletingId(id);
  }

  async function confirmDelete() {
    if (!deletingId) return;
    try {
      await deleteIncome(deletingId);
    } catch {
      toast('Failed to remove', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(income: Income) {
    setEditingId(income.id);
    setEditAmount(income.amount.toString());
    setEditDescription(income.description);
  }

  async function saveEdit(id: string) {
    try {
      await updateIncome(id, {
        description: editDescription,
        amount: parseFloat(editAmount),
      });
      setEditingId(null);
    } catch {
      toast('Failed to update', 'error');
    }
  }

  if (incomes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No income sources registered</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2">
        {incomes.map((income) => {
          const config = TYPE_CONFIG[income.type] || TYPE_CONFIG.other;
          const Icon = config.icon;
          const monthly = toMonthly(income.amount, income.frequency);

          return (
            <div
              key={income.id}
              className={`flex items-center justify-between p-3 border dark:border-dark-600 rounded-montra-sm hover:bg-surface-light dark:hover:bg-dark-700 transition ${
                !income.isActive ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`p-2 rounded-montra-sm ${config.color}`}>
                  <Icon size={16} />
                </span>
                <div className="min-w-0">
                  {editingId === income.id ? (
                    <div className="flex gap-2">
                      <input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="px-2 py-1 border dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 dark:text-gray-100 w-32"
                      />
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="px-2 py-1 border dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 dark:text-gray-100 w-24"
                        step="0.01"
                      />
                      <button
                        onClick={() => saveEdit(income.id)}
                        className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                        {income.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {config.label} • {FREQ_LABELS[income.frequency] || income.frequency}
                        {income.frequency !== 'monthly' && (
                          <span className="ml-1 text-muted-foreground">({formatCurrency(monthly)}/mo)</span>
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {editingId !== income.id && (
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <p className="font-bold text-income-100">
                    {formatCurrency(income.amount)}
                  </p>
                  <button
                    onClick={() => startEdit(income)}
                    className="p-1.5 hover:bg-violet-20 dark:hover:bg-violet-100/10 text-violet-100 rounded transition"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(income.id)}
                    className="p-1.5 hover:bg-expense-20 dark:hover:bg-expense-100/10 text-expense-100 rounded transition"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-3 pt-3 border-t dark:border-dark-600 flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">Total monthly income</span>
        <span className="text-lg font-bold text-income-100">
          {formatCurrency(totalMonthly)}
        </span>
      </div>

      <DeleteConfirmDialog
        isOpen={!!deletingId}
        title="Remove Income"
        message="Are you sure you want to remove this income source?"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}

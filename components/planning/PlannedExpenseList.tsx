'use client';

import { useState } from 'react';
import { Trash2, Pencil, Receipt, Lock, Shuffle, CalendarDays } from 'lucide-react';
import { deletePlannedExpense, updatePlannedExpense } from '@/app/actions/planning';
import { toMonthly } from '@/lib/planning';
import { formatCurrency } from '@/lib/currency';

type PlannedExpense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  frequency: string;
  isFixed: boolean;
  dueDay: number | null;
  isActive: boolean;
};

const FREQ_LABELS: Record<string, string> = {
  monthly: 'Mensal',
  weekly: 'Semanal',
  yearly: 'Anual',
  daily: 'Diário',
};

const CATEGORY_COLORS: Record<string, string> = {
  Housing: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Utilities: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Transport: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Food: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Subscriptions: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Insurance: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  Financial: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Health: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Entertainment: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Shopping: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Bills: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function PlannedExpenseList({ expenses }: { expenses: PlannedExpense[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fixed = expenses.filter((e) => e.isFixed && e.isActive);
  const variable = expenses.filter((e) => !e.isFixed && e.isActive);
  const inactive = expenses.filter((e) => !e.isActive);

  const totalFixed = fixed.reduce((s, e) => s + toMonthly(e.amount, e.frequency), 0);
  const totalVariable = variable.reduce((s, e) => s + toMonthly(e.amount, e.frequency), 0);
  const total = totalFixed + totalVariable;

  async function handleDelete(id: string) {
    if (!confirm('Remover esta despesa planejada?')) return;
    try {
      await deletePlannedExpense(id);
    } catch {
      alert('Erro ao remover');
    }
  }

  function startEdit(expense: PlannedExpense) {
    setEditingId(expense.id);
    setEditAmount(expense.amount.toString());
    setEditDescription(expense.description);
  }

  async function saveEdit(id: string) {
    try {
      await updatePlannedExpense(id, {
        description: editDescription,
        amount: parseFloat(editAmount),
      });
      setEditingId(null);
    } catch {
      alert('Erro ao atualizar');
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <Receipt className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhuma despesa planejada cadastrada</p>
      </div>
    );
  }

  function renderExpenseRow(expense: PlannedExpense) {
    const monthly = toMonthly(expense.amount, expense.frequency);
    const catColor = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;

    return (
      <div
        key={expense.id}
        className={`flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
          !expense.isActive ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className={`px-2 py-1 rounded text-xs font-medium ${catColor}`}>
            {expense.category}
          </span>
          <div className="min-w-0">
            {editingId === expense.id ? (
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
                  onClick={() => saveEdit(expense.id)}
                  className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                  {expense.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  {FREQ_LABELS[expense.frequency] || expense.frequency}
                  {expense.dueDay && (
                    <span className="inline-flex items-center gap-0.5">
                      <CalendarDays size={10} /> dia {expense.dueDay}
                    </span>
                  )}
                  {expense.frequency !== 'monthly' && (
                    <span className="text-gray-400">({formatCurrency(monthly)}/mês)</span>
                  )}
                </p>
              </>
            )}
          </div>
        </div>

        {editingId !== expense.id && (
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <p className="font-bold text-red-600 dark:text-red-400">
              {formatCurrency(expense.amount)}
            </p>
            <button
              onClick={() => startEdit(expense)}
              className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded transition"
              title="Editar"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => handleDelete(expense.id)}
              className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition"
              title="Remover"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Fixed expenses section */}
      {fixed.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Lock size={14} className="text-red-500" />
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Despesas fixas
            </h4>
            <span className="ml-auto text-xs font-medium text-red-600 dark:text-red-400">
              {formatCurrency(totalFixed)}/mês
            </span>
          </div>
          <div className="space-y-2">{fixed.map(renderExpenseRow)}</div>
        </div>
      )}

      {/* Variable expenses section */}
      {variable.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Shuffle size={14} className="text-amber-500" />
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Despesas variáveis
            </h4>
            <span className="ml-auto text-xs font-medium text-amber-600 dark:text-amber-400">
              {formatCurrency(totalVariable)}/mês
            </span>
          </div>
          <div className="space-y-2">{variable.map(renderExpenseRow)}</div>
        </div>
      )}

      {/* Inactive section */}
      {inactive.length > 0 && (
        <div className="mb-4 opacity-60">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
            Inativas ({inactive.length})
          </h4>
          <div className="space-y-2">{inactive.map(renderExpenseRow)}</div>
        </div>
      )}

      {/* Total */}
      <div className="mt-3 pt-3 border-t dark:border-gray-700 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total planejado mensal</span>
        <span className="text-lg font-bold text-red-600 dark:text-red-400">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Trash2, Pencil, DollarSign, TrendingUp, Briefcase, Home, MoreHorizontal } from 'lucide-react';
import { deleteIncome, updateIncome, toMonthly } from '@/app/actions/planning';
import { formatCurrency } from '@/lib/currency';

type Income = {
  id: string;
  description: string;
  amount: number;
  type: string;
  frequency: string;
  isActive: boolean;
};

const TYPE_CONFIG: Record<string, { icon: typeof DollarSign; color: string; label: string }> = {
  salary: { icon: Briefcase, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400', label: 'Salário' },
  freelance: { icon: TrendingUp, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400', label: 'Freelance' },
  investment: { icon: TrendingUp, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400', label: 'Investimento' },
  rental: { icon: Home, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400', label: 'Aluguel' },
  other: { icon: MoreHorizontal, color: 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400', label: 'Outro' },
};

const FREQ_LABELS: Record<string, string> = {
  monthly: 'Mensal',
  biweekly: 'Quinzenal',
  weekly: 'Semanal',
};

export default function IncomeList({ incomes }: { incomes: Income[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const totalMonthly = incomes
    .filter((i) => i.isActive)
    .reduce((sum, i) => sum + toMonthly(i.amount, i.frequency), 0);

  async function handleDelete(id: string) {
    if (!confirm('Remover esta fonte de renda?')) return;
    try {
      await deleteIncome(id);
    } catch {
      alert('Erro ao remover');
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
      alert('Erro ao atualizar');
    }
  }

  if (incomes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhuma fonte de renda cadastrada</p>
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
              className={`flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                !income.isActive ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`p-2 rounded-lg ${config.color}`}>
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
                        {income.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {config.label} • {FREQ_LABELS[income.frequency] || income.frequency}
                        {income.frequency !== 'monthly' && (
                          <span className="ml-1 text-gray-400">({formatCurrency(monthly)}/mês)</span>
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {editingId !== income.id && (
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <p className="font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(income.amount)}
                  </p>
                  <button
                    onClick={() => startEdit(income)}
                    className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded transition"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(income.id)}
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition"
                    title="Remover"
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
      <div className="mt-3 pt-3 border-t dark:border-gray-700 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Renda mensal total</span>
        <span className="text-lg font-bold text-green-600 dark:text-green-400">
          {formatCurrency(totalMonthly)}
        </span>
      </div>
    </div>
  );
}

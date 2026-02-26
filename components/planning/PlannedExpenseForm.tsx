'use client';

import { useState, useRef } from 'react';
import { Plus, Receipt } from 'lucide-react';
import { addPlannedExpense } from '@/app/actions/planning';

const CATEGORIES = [
  'Housing', 'Utilities', 'Transport', 'Food',
  'Subscriptions', 'Insurance', 'Financial', 'Health',
  'Entertainment', 'Shopping', 'Bills', 'Other',
];

const FREQUENCIES = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'yearly', label: 'Anual' },
  { value: 'daily', label: 'Diário' },
];

export default function PlannedExpenseForm() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set('isFixed', isFixed.toString());

    try {
      await addPlannedExpense(formData);
      formRef.current?.reset();
      setIsFixed(true);
      setOpen(false);
    } catch {
      alert('Erro ao salvar despesa planejada');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-orange-400 hover:text-orange-500 transition"
      >
        <Plus size={18} />
        Adicionar despesa planejada
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50/50 dark:bg-orange-900/10 space-y-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <Receipt size={16} className="text-orange-600" />
        <h4 className="font-medium text-orange-700 dark:text-orange-400 text-sm">Nova despesa planejada</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Descrição</label>
          <input
            type="text"
            name="description"
            required
            placeholder="Ex: Aluguel"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Valor</label>
          <input
            type="number"
            name="amount"
            required
            step="0.01"
            min="0"
            placeholder="0,00"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Categoria</label>
          <select
            name="category"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 dark:text-gray-100"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Frequência</label>
          <select
            name="frequency"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 dark:text-gray-100"
          >
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Dia de vencimento</label>
          <input
            type="number"
            name="dueDay"
            min="1"
            max="31"
            placeholder="Ex: 10"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Fixed vs Variable toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsFixed(true)}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition ${
            isFixed
              ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
              : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          Fixa (ex: aluguel)
        </button>
        <button
          type="button"
          onClick={() => setIsFixed(false)}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition ${
            !isFixed
              ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
              : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          Variável (ex: comida)
        </button>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition dark:text-gray-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium transition"
        >
          {loading ? 'Salvando...' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}

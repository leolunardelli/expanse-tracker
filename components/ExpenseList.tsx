'use client';

import { useState } from 'react';
import { Trash2, Pencil, Search, RefreshCw } from 'lucide-react';
import { deleteExpense } from '@/app/actions/expenses';
import { formatCurrency } from '@/lib/currency';
import EditExpenseModal from './EditExpenseModal';
import { getTagColor } from '@/components/tags/TagInput';

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

const formatDate = (date: Date | string) => new Date(date).toISOString().split('T')[0];

const getRecurrenceLabel = (type?: string | null) => {
  const labels: Record<string, string> = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' };
  return labels[type || ''] || '';
};

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = expenses.filter(expense => 
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
    } catch {
      alert('Delete failed');
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800/50 p-6">
        <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No expenses yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800/50 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Expenses</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{filteredExpenses.length} of {expenses.length}</span>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-gray-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredExpenses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No expenses match "{searchQuery}"</p>
          ) : (
            filteredExpenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{expense.description}</p>
                    {expense.isRecurring && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        <RefreshCw size={10} />
                        {getRecurrenceLabel(expense.recurrenceType)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category} • {formatDate(expense.date)}</p>
                  {expense.tags && expense.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {expense.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getTagColor(tag)}`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {expense.notes && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate max-w-xs">
                      {expense.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-lg">{formatCurrency(expense.amount)}</p>
                  <button
                    onClick={() => setEditingExpense(expense)}
                    className="p-2 hover:bg-blue-100 text-blue-600 rounded transition"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <EditExpenseModal 
        expense={editingExpense} 
        onClose={() => setEditingExpense(null)} 
      />
    </>
  );
}

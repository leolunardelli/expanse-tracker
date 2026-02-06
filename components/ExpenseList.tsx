'use client';

import { useState } from 'react';
import { Trash2, Pencil, Search, RefreshCw } from 'lucide-react';
import { deleteExpense } from '@/app/actions/expenses';
import { formatCurrency } from '@/lib/currency';
import EditExpenseModal from './EditExpenseModal';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date | string;
  isRecurring?: boolean;
  recurrenceType?: string | null;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

function getRecurrenceLabel(type: string | null | undefined): string {
  switch (type) {
    case 'daily': return 'Daily';
    case 'weekly': return 'Weekly';
    case 'monthly': return 'Monthly';
    case 'yearly': return 'Yearly';
    default: return '';
  }
}

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter expenses by search query
  const filteredExpenses = expenses.filter(expense => 
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
    } catch (error) {
      alert('Error deleting expense: ' + (error as Error).message);
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
        <p className="text-gray-500 text-center py-8">No expenses yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Expenses</h2>
          <span className="text-sm text-gray-500">{filteredExpenses.length} of {expenses.length}</span>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredExpenses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No expenses match "{searchQuery}"</p>
          ) : (
            filteredExpenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    {expense.isRecurring && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        <RefreshCw size={10} />
                        {getRecurrenceLabel(expense.recurrenceType)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{expense.category} • {formatDate(expense.date)}</p>
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

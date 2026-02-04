'use client';

import { Trash2 } from 'lucide-react';
import { deleteExpense } from '@/app/actions/expenses';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
}

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
      <div className="space-y-2">
        {expenses.map((expense) => (
          <div key={expense.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{expense.description}</p>
              <p className="text-sm text-gray-500">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-bold text-lg">${expense.amount.toFixed(2)}</p>
              <button
                onClick={() => handleDelete(expense.id)}
                className="p-2 hover:bg-red-100 text-red-600 rounded transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

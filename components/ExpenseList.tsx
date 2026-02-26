'use client';

import { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { deleteExpense } from '@/app/actions/expenses';
import { formatCurrency } from '@/lib/currency';
import { CategoryIcon } from '@/components/ui';
import { type CategoryKey } from '@/lib/design-tokens';
import EditExpenseModal from './EditExpenseModal';
import TransactionDetailSheet from './TransactionDetailSheet';
import DeleteConfirmDialog from './DeleteConfirmDialog';

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

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getRecurrenceLabel = (type?: string | null) => {
  const labels: Record<string, string> = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' };
  return labels[type || ''] || '';
};

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = expenses.filter(expense => 
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleDelete(id: string) {
    try {
      await deleteExpense(id);
      setDeletingId(null);
      setViewingExpense(null);
    } catch {
      alert('Delete failed');
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Expenses</h2>
        <p className="text-muted-foreground text-center py-8">No expenses yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="card p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Expenses</h2>
          <span className="text-xs text-muted-foreground">{filteredExpenses.length} of {expenses.length}</span>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-gray-900 dark:hover:text-white text-sm"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Transaction List */}
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {filteredExpenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-6 text-sm">No expenses match &ldquo;{searchQuery}&rdquo;</p>
          ) : (
            filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                onClick={() => setViewingExpense(expense)}
                className="flex items-center gap-3 p-3 rounded-montra-sm hover:bg-surface-light dark:hover:bg-dark-700 transition-colors cursor-pointer -mx-1"
              >
                <CategoryIcon category={expense.category as CategoryKey} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{expense.description}</p>
                    {expense.isRecurring && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-info-20 dark:bg-info-100/10 text-info-100 text-[10px] rounded-full font-medium">
                        <RefreshCw size={8} />
                        {getRecurrenceLabel(expense.recurrenceType)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{expense.category} • {formatDate(expense.date)}</p>
                </div>
                <p className="font-semibold text-sm text-expense-100">-{formatCurrency(expense.amount)}</p>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Detail Sheet */}
      <TransactionDetailSheet
        transaction={viewingExpense}
        onClose={() => setViewingExpense(null)}
        onEdit={(tx) => {
          setViewingExpense(null);
          setEditingExpense(tx);
        }}
        onDelete={(id) => {
          setDeletingId(id);
        }}
      />

      {/* Edit Modal */}
      <EditExpenseModal 
        expense={editingExpense} 
        onClose={() => setEditingExpense(null)} 
      />

      {/* Delete Confirm */}
      <DeleteConfirmDialog
        isOpen={!!deletingId}
        onConfirm={() => handleDelete(deletingId!)}
        onCancel={() => setDeletingId(null)}
      />
    </>
  );
}

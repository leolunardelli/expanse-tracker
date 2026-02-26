'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { Trash2, Pencil, RefreshCw, Loader2, FileX2 } from 'lucide-react';
import { getFilteredExpenses, deleteExpense } from '@/app/actions/expenses';
import { formatCurrency } from '@/lib/currency';
import { useFilterParams } from '@/lib/useFilterParams';
import FilterBar, { FilterState } from '@/components/filters/FilterBar';
import ActiveFilters from '@/components/filters/ActiveFilters';
import Pagination from '@/components/filters/Pagination';
import EditExpenseModal from '@/components/EditExpenseModal';
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
};

type PaginationData = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

const formatDate = (date: Date | string) =>
  new Date(date).toISOString().split('T')[0];

const getRecurrenceLabel = (type?: string | null) => {
  const labels: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
  };
  return labels[type || ''] || '';
};

type FilteredExpenseListProps = {
  categories: string[];
  availableTags: string[];
  initialExpenses: Expense[];
  initialPagination: PaginationData;
};

export default function FilteredExpenseList({
  categories,
  availableTags,
  initialExpenses,
  initialPagination,
}: FilteredExpenseListProps) {
  const { filters, page, setFilters, setPage, clearFilters } = useFilterParams();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [pagination, setPagination] = useState<PaginationData>(initialPagination);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) =>
      value !== '' &&
      key !== 'sortOrder' &&
      !(key === 'sortBy' && value === 'date')
  ).length;

  const fetchExpenses = useCallback(
    (currentFilters: FilterState, currentPage: number) => {
      startTransition(async () => {
        const result = await getFilteredExpenses({
          search: currentFilters.search || undefined,
          category: currentFilters.category || undefined,
          dateFrom: currentFilters.dateFrom || undefined,
          dateTo: currentFilters.dateTo || undefined,
          amountMin: currentFilters.amountMin || undefined,
          amountMax: currentFilters.amountMax || undefined,
          tag: currentFilters.tag || undefined,
          sortBy: currentFilters.sortBy || undefined,
          sortOrder: currentFilters.sortOrder,
          page: currentPage,
          pageSize: 10,
        });
        setExpenses(result.expenses);
        setPagination(result.pagination);
      });
    },
    []
  );

  // Fetch when filters or page change (driven by URL)
  useEffect(() => {
    fetchExpenses(filters, page);
  }, [filters, page, fetchExpenses]);

  function handleFilterChange(newFilters: FilterState) {
    setFilters(newFilters, 1);
  }

  function handleClearFilters() {
    clearFilters();
  }

  function handleRemoveFilter(key: keyof FilterState) {
    const updated = {
      ...filters,
      [key]: key === 'sortBy' ? 'date' : key === 'sortOrder' ? 'desc' : '',
    };
    setFilters(updated, 1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      fetchExpenses(filters, page);
    } catch {
      alert('Delete failed');
    }
  }

  return (
    <div>
      <FilterBar
        filters={filters}
        categories={categories}
        availableTags={availableTags}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />

      <ActiveFilters
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearFilters}
      />

      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Expenses
          </h2>
          {isPending && (
            <Loader2 className="w-5 h-5 animate-spin text-violet-100" />
          )}
        </div>

        {/* Expense rows */}
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
            <FileX2 className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No expenses found</p>
            {activeFilterCount > 0 && (
              <p className="text-sm mt-1">Try adjusting your filters</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center p-3 border border-light-40 dark:border-dark-600 rounded-montra-sm hover:bg-surface-light dark:hover:bg-dark-700 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {expense.description}
                    </p>
                    {expense.isRecurring && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-20 dark:bg-violet-100/10 text-violet-100 dark:text-violet-60 text-xs rounded-full shrink-0">
                        <RefreshCw size={10} />
                        {getRecurrenceLabel(expense.recurrenceType)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {expense.category} &bull; {formatDate(expense.date)}
                  </p>
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
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    {formatCurrency(expense.amount)}
                  </p>
                  <button
                    onClick={() => setEditingExpense(expense)}
                    className="p-2 hover:bg-violet-20 dark:hover:bg-violet-100/10 text-violet-100 dark:text-violet-60 rounded transition"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 hover:bg-expense-100/10 text-expense-100 rounded transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          pageSize={pagination.pageSize}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={handlePageChange}
        />
      </div>

      <EditExpenseModal
        expense={editingExpense}
        onClose={() => setEditingExpense(null)}
      />
    </div>
  );
}

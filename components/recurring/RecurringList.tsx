'use client';

import { useState } from 'react';
import RecurringCard from './RecurringCard';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';

type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date | string;
  isRecurring: boolean;
  recurrenceType: string | null;
  createdAt: Date | string;
};

type RecurringListProps = {
  expenses: Expense[];
};

export default function RecurringList({ expenses }: RecurringListProps) {
  const [search, setSearch] = useState('');
  const [filterFrequency, setFilterFrequency] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'amount' | 'date' | 'name'>('amount');

  // Get unique categories
  const categories = Array.from(
    new Set(expenses.map((e) => e.category))
  ).sort();

  // Get unique frequencies
  const frequencies = Array.from(
    new Set(expenses.map((e) => e.recurrenceType || 'monthly'))
  ).sort();

  // Filter & sort
  const filtered = expenses.filter((e) => {
    const matchesSearch = e.description
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFreq =
      filterFrequency === 'all' ||
      (e.recurrenceType || 'monthly') === filterFrequency;
    const matchesCat =
      filterCategory === 'all' || e.category === filterCategory;
    return matchesSearch && matchesFreq && matchesCat;
  });

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.amount - a.amount;
      case 'date':
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'name':
        return a.description.localeCompare(b.description);
      default:
        return 0;
    }
  });

  return (
    <div>
      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Filters
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm input"
            />
          </div>

          {/* Frequency filter */}
          <select
            value={filterFrequency}
            onChange={(e) => setFilterFrequency(e.target.value)}
            className="input text-sm"
          >
            <option value="all">All Frequencies</option>
            {frequencies.map((f) => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as 'amount' | 'date' | 'name')
            }
            className="input text-sm"
          >
            <option value="amount">Sort by Amount</option>
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-violet-20 dark:bg-violet-100/10 flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-violet-100" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {expenses.length === 0
              ? 'No recurring expenses yet'
              : 'No matching results'}
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-5">
            {expenses.length === 0
              ? 'Track subscriptions and recurring costs using the form above.'
              : 'Try adjusting your search or filters to find what you\'re looking for.'}
          </p>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((expense) => (
            <RecurringCard key={expense.id} expense={expense} />
          ))}
        </div>
      )}

      {/* Count indicator */}
      {filtered.length > 0 && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Showing {filtered.length} of {expenses.length} recurring expense
          {expenses.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

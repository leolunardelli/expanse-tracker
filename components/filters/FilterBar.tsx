'use client';

import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import SearchBar from './SearchBar';
import DateRangeFilter from './DateRangeFilter';
import CategoryFilter from './CategoryFilter';
import AmountRangeFilter from './AmountRangeFilter';
import SortSelect from './SortSelect';
import TagFilter from './TagFilter';

export type FilterState = {
  search: string;
  category: string;
  tag: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};

type FilterBarProps = {
  filters: FilterState;
  categories: string[];
  availableTags: string[];
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
};

export default function FilterBar({
  filters,
  categories,
  availableTags,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onFilterChange({ ...filters, [key]: value });
  }

  return (
    <div className="card p-4 mb-6">
      {/* Search + Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchBar
            value={filters.search}
            onChange={(v) => updateFilter('search', v)}
          />
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border transition ${
            activeFilterCount > 0
              ? 'bg-violet-20 dark:bg-violet-100/10 border-violet-100/30 dark:border-violet-100/20 text-violet-100 dark:text-violet-60'
              : 'bg-white dark:bg-dark-700 border-light-40 dark:border-dark-600 text-muted-foreground hover:bg-surface-light dark:hover:bg-dark-600'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-violet-100 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expanded Filters */}
      {expanded && (
          <div className="mt-4 pt-4 border-t border-light-40 dark:border-dark-600">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <CategoryFilter
              value={filters.category}
              onChange={(v) => updateFilter('category', v)}
              categories={categories}
            />
            <TagFilter
              value={filters.tag}
              onChange={(v) => updateFilter('tag', v)}
              availableTags={availableTags}
            />
            <DateRangeFilter
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              onDateFromChange={(v) => updateFilter('dateFrom', v)}
              onDateToChange={(v) => updateFilter('dateTo', v)}
            />
            <AmountRangeFilter
              amountMin={filters.amountMin}
              amountMax={filters.amountMax}
              onAmountMinChange={(v) => updateFilter('amountMin', v)}
              onAmountMaxChange={(v) => updateFilter('amountMax', v)}
            />
            <SortSelect
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSortByChange={(v) => updateFilter('sortBy', v)}
              onSortOrderChange={(v) => updateFilter('sortOrder', v)}
            />
          </div>

          {/* Clear button */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={onClearFilters}
                className="text-sm text-expense-100 hover:text-expense-80 transition"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

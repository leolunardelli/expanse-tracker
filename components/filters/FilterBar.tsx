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
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
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
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
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
                className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 transition"
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

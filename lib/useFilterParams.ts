'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { FilterState } from '@/components/filters/FilterBar';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  category: '',
  dateFrom: '',
  dateTo: '',
  amountMin: '',
  amountMax: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

const FILTER_PARAM_MAP: Record<keyof FilterState, string> = {
  search: 'q',
  category: 'cat',
  dateFrom: 'from',
  dateTo: 'to',
  amountMin: 'min',
  amountMax: 'max',
  sortBy: 'sort',
  sortOrder: 'order',
};

export function useFilterParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read filters from URL
  const filters = useMemo<FilterState>(() => {
    return {
      search: searchParams.get(FILTER_PARAM_MAP.search) ?? '',
      category: searchParams.get(FILTER_PARAM_MAP.category) ?? '',
      dateFrom: searchParams.get(FILTER_PARAM_MAP.dateFrom) ?? '',
      dateTo: searchParams.get(FILTER_PARAM_MAP.dateTo) ?? '',
      amountMin: searchParams.get(FILTER_PARAM_MAP.amountMin) ?? '',
      amountMax: searchParams.get(FILTER_PARAM_MAP.amountMax) ?? '',
      sortBy: searchParams.get(FILTER_PARAM_MAP.sortBy) ?? 'date',
      sortOrder: (searchParams.get(FILTER_PARAM_MAP.sortOrder) as 'asc' | 'desc') ?? 'desc',
    };
  }, [searchParams]);

  const page = useMemo(() => {
    const p = searchParams.get('page');
    return p ? parseInt(p, 10) : 1;
  }, [searchParams]);

  // Write filters to URL
  const setFilters = useCallback(
    (newFilters: FilterState, newPage?: number) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        const paramKey = FILTER_PARAM_MAP[key as keyof FilterState];
        const defaultValue = DEFAULT_FILTERS[key as keyof FilterState];
        if (value && value !== defaultValue) {
          params.set(paramKey, value);
        }
      });

      if (newPage && newPage > 1) {
        params.set('page', String(newPage));
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname]
  );

  const setPage = useCallback(
    (newPage: number) => {
      setFilters(filters, newPage);
    },
    [filters, setFilters]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return { filters, page, setFilters, setPage, clearFilters };
}

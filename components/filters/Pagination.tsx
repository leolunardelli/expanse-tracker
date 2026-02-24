'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

type PaginationProps = {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  hasNext,
  hasPrev,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
      {/* Info */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {startItem}–{endItem} of {totalCount} expenses
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrev}
          className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((pageNum, idx) =>
          typeof pageNum === 'string' ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-gray-400 dark:text-gray-500 text-sm"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[32px] h-8 text-sm rounded-lg transition font-medium ${
                pageNum === page
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {pageNum}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext}
          className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

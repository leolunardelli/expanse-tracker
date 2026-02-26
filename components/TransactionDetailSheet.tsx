'use client';

import { X, Calendar, Tag, FileText, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import { CategoryIcon } from '@/components/ui';
import { formatCurrency } from '@/lib/currency';
import { getCategoryConfig, type CategoryKey } from '@/lib/design-tokens';
import { getTagColor } from '@/components/tags/TagInput';

interface Transaction {
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

interface TransactionDetailSheetProps {
  transaction: Transaction | null;
  onClose: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const getRecurrenceLabel = (type?: string | null) => {
  const labels: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
  };
  return labels[type || ''] || '';
};

export default function TransactionDetailSheet({
  transaction,
  onClose,
  onEdit,
  onDelete,
}: TransactionDetailSheetProps) {
  if (!transaction) return null;

  const config = getCategoryConfig(transaction.category);

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-800 rounded-t-[24px] max-h-[85vh] overflow-y-auto animate-slide-up sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bottom-auto sm:rounded-montra-lg sm:max-w-md sm:w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Header with category color */}
        <div
          className="mx-4 mt-4 rounded-montra-md p-4 flex items-center gap-3"
          style={{ backgroundColor: `${config.color}15` }}
        >
          <CategoryIcon category={transaction.category as CategoryKey} size="lg" />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {transaction.description}
            </h2>
            <p className="text-sm" style={{ color: config.color }}>
              {config.label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 dark:bg-dark-700 flex items-center justify-center hover:bg-white dark:hover:bg-dark-600 transition sm:block hidden"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Amount */}
        <div className="px-4 py-5 text-center border-b border-gray-100 dark:border-dark-700">
          <p className="text-3xl font-bold text-expense-100">
            -{formatCurrency(transaction.amount)}
          </p>
        </div>

        {/* Details */}
        <div className="px-4 py-4 space-y-4">
          {/* Date */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-surface-light dark:bg-dark-700 flex items-center justify-center">
              <Calendar size={16} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(transaction.date)}
              </p>
            </div>
          </div>

          {/* Recurring */}
          {transaction.isRecurring && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-info-20 dark:bg-info-100/10 flex items-center justify-center">
                <RefreshCw size={16} className="text-info-100" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Recurring</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getRecurrenceLabel(transaction.recurrenceType)}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {transaction.tags && transaction.tags.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-light dark:bg-dark-700 flex items-center justify-center flex-shrink-0">
                <Tag size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {transaction.tags.map((tag) => {
                    const tagColor = getTagColor(tag);
                    return (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${tagColor}20`,
                          color: tagColor,
                        }}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {transaction.notes && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-light dark:bg-dark-700 flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {transaction.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 pb-6 pt-2 flex gap-3">
          <button
            onClick={() => onEdit(transaction)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-montra-md bg-violet-20 dark:bg-violet-100/10 text-violet-100 font-medium text-sm hover:bg-violet-40 dark:hover:bg-violet-100/20 transition"
          >
            <Pencil size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-montra-md bg-expense-20 dark:bg-expense-100/10 text-expense-100 font-medium text-sm hover:bg-expense-40 dark:hover:bg-expense-100/20 transition"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

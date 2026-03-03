'use client';

import { RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import Link from 'next/link';

type RecurringExpenseItem = {
  id: string;
  description: string;
  amount: number;
  category: string;
  recurrenceType: string;
  monthlyAmount: number;
};

const FREQ_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export default function RecurringInPlanning({
  items,
}: {
  items: RecurringExpenseItem[];
}) {
  const total = items.reduce((s, i) => s + i.monthlyAmount, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p>No recurring expenses</p>
        <Link
          href="/recurring"
          className="text-violet-100 text-xs hover:underline mt-1 inline-block"
        >
          Add recurring expenses →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between py-2.5 px-3 rounded-montra-sm bg-surface-light dark:bg-dark-700"
        >
          <div className="flex items-center gap-3 min-w-0">
            <RefreshCw size={14} className="text-violet-100 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {item.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.category} · {FREQ_LABELS[item.recurrenceType] || item.recurrenceType}
                {item.recurrenceType !== 'monthly' && (
                  <span className="ml-1">
                    ({formatCurrency(item.amount)}/{item.recurrenceType.replace('ly', '')})
                  </span>
                )}
              </p>
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap ml-3">
            {formatCurrency(item.monthlyAmount)}
            <span className="text-xs text-muted-foreground font-normal">/mo</span>
          </span>
        </div>
      ))}

      {/* Total */}
      <div className="flex items-center justify-between pt-2 border-t border-border-light dark:border-border-dark">
        <span className="text-sm font-medium text-muted-foreground">
          Total recurring ({items.length})
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {formatCurrency(total)}/mo
        </span>
      </div>

      <div className="text-right">
        <Link
          href="/recurring"
          className="text-violet-100 text-xs hover:underline"
        >
          Manage recurring →
        </Link>
      </div>
    </div>
  );
}

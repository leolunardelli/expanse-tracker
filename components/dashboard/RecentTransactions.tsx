'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CategoryIcon } from '@/components/ui';
import { formatCurrency } from '@/lib/currency';
import { type CategoryKey } from '@/lib/design-tokens';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date | string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

function formatRelativeDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-violet-20 dark:bg-violet-100/10 flex items-center justify-center mx-auto mb-3">
            <ArrowRight size={20} className="text-violet-100" />
          </div>
          <p className="text-sm text-muted-foreground">No transactions yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add your first expense to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-medium text-violet-100 hover:text-violet-80 transition-colors"
        >
          See all
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-1">
        {transactions.slice(0, 5).map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 p-2.5 rounded-montra-sm hover:bg-surface-light dark:hover:bg-dark-700 transition-colors -mx-1"
          >
            <CategoryIcon category={tx.category as CategoryKey} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {tx.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {tx.category}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-expense-100">
                -{formatCurrency(tx.amount)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeDate(tx.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

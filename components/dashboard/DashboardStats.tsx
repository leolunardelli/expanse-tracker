'use client';

import { useState, useTransition } from 'react';
import { Calendar } from 'lucide-react';
import { getExpenseStats } from '@/app/actions/expenses';
import { formatCurrency } from '@/lib/currency';
import SpendingBreakdown from '@/components/dashboard/SpendingBreakdown';
import StatsCard from '@/components/StatsCard';
import { Wallet, Receipt, FolderOpen } from 'lucide-react';

type Period = 'month' | '30d' | '3m' | 'year' | 'all';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'month', label: 'This Month' },
  { value: '30d', label: '30 Days' },
  { value: '3m', label: '3 Months' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
];

interface DashboardStatsProps {
  initialStats: {
    total: number;
    byCategory: Record<string, number>;
    count: number;
  };
}

export default function DashboardStats({ initialStats }: DashboardStatsProps) {
  const [stats, setStats] = useState(initialStats);
  const [period, setPeriod] = useState<Period>('month');
  const [isPending, startTransition] = useTransition();

  function handlePeriodChange(newPeriod: Period) {
    setPeriod(newPeriod);
    startTransition(async () => {
      const data = await getExpenseStats(newPeriod);
      setStats(data);
    });
  }

  return (
    <>
      {/* Period Selector */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={14} className="text-muted-foreground" />
        <div className="flex gap-1 flex-wrap">
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handlePeriodChange(value)}
              disabled={isPending}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                period === value
                  ? 'bg-violet-100 text-white'
                  : 'bg-surface-light dark:bg-dark-700 text-muted-foreground hover:text-dark-900 dark:hover:text-white'
              } ${isPending ? 'opacity-60' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatsCard
          title="Spent"
          value={formatCurrency(stats.total)}
          icon={<Wallet size={16} />}
        />
        <StatsCard
          title="Transactions"
          value={stats.count}
          icon={<Receipt size={16} />}
        />
        <StatsCard
          title="Categories"
          value={Object.keys(stats.byCategory).length}
          icon={<FolderOpen size={16} />}
        />
      </div>

      {/* Spending Breakdown responds to period */}
      <div className="mb-6">
        <SpendingBreakdown
          byCategory={stats.byCategory}
          total={stats.total}
          periodLabel={PERIODS.find(p => p.value === period)?.label}
        />
      </div>
    </>
  );
}

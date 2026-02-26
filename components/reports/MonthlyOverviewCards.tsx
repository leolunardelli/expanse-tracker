'use client';

import {
  DollarSign,
  Hash,
  TrendingUp,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

type MonthlyOverviewCardsProps = {
  totalSpent: number;
  transactionCount: number;
  avgPerTransaction: number;
  avgPerDay: number;
  daysWithSpending: number;
  daysInMonth: number;
  highestDay: { date: string; amount: number };
  lowestDay: { date: string; amount: number };
};

export default function MonthlyOverviewCards({
  totalSpent,
  transactionCount,
  avgPerTransaction,
  avgPerDay,
  daysWithSpending,
  daysInMonth,
  highestDay,
  lowestDay,
}: MonthlyOverviewCardsProps) {
  const cards = [
    {
      icon: DollarSign,
      label: 'Total Spent',
      value: formatCurrency(totalSpent),
      color: 'text-violet-100',
      bg: 'bg-violet-20 dark:bg-violet-100/10',
    },
    {
      icon: Hash,
      label: 'Transactions',
      value: String(transactionCount),
      sub: `${daysWithSpending} of ${daysInMonth} days`,
      color: 'text-violet-60',
      bg: 'bg-violet-20 dark:bg-violet-100/10',
    },
    {
      icon: TrendingUp,
      label: 'Avg / Transaction',
      value: formatCurrency(avgPerTransaction),
      color: 'text-income-100',
      bg: 'bg-income-20 dark:bg-income-100/10',
    },
    {
      icon: CalendarDays,
      label: 'Avg / Day',
      value: formatCurrency(avgPerDay),
      color: 'text-warning-100',
      bg: 'bg-warning-20 dark:bg-warning-100/10',
    },
    {
      icon: ArrowUpRight,
      label: 'Highest Day',
      value: formatCurrency(highestDay.amount),
      sub: highestDay.date
        ? new Date(highestDay.date + 'T12:00:00').toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })
        : '—',
      color: 'text-expense-100',
      bg: 'bg-expense-20 dark:bg-expense-100/10',
    },
    {
      icon: ArrowDownRight,
      label: 'Lowest Day',
      value: formatCurrency(lowestDay.amount),
      sub: lowestDay.date
        ? new Date(lowestDay.date + 'T12:00:00').toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })
        : '—',
      color: 'text-info-100',
      bg: 'bg-info-100/10 dark:bg-info-100/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="card p-4"
        >
          <div className={`inline-flex p-2 rounded-montra-sm ${card.bg} mb-2`}>
            <card.icon className={`w-4 h-4 ${card.color}`} />
          </div>
          <p className="text-xs text-muted-foreground mb-1">
            {card.label}
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {card.value}
          </p>
          {card.sub && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {card.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

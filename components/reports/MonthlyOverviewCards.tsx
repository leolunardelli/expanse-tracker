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
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: Hash,
      label: 'Transactions',
      value: String(transactionCount),
      sub: `${daysWithSpending} of ${daysInMonth} days`,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: TrendingUp,
      label: 'Avg / Transaction',
      value: formatCurrency(avgPerTransaction),
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: CalendarDays,
      label: 'Avg / Day',
      value: formatCurrency(avgPerDay),
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
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
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
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
      color: 'text-cyan-500',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4"
        >
          <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-2`}>
            <card.icon className={`w-4 h-4 ${card.color}`} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {card.label}
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {card.value}
          </p>
          {card.sub && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {card.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

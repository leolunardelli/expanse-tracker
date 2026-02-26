'use client';

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface BalanceCardProps {
  totalSpent: number;
  monthlyIncome: number;
  remaining: number;
  transactionCount: number;
}

export default function BalanceCard({ totalSpent, monthlyIncome, remaining }: BalanceCardProps) {
  const spentPercentage = monthlyIncome > 0 ? Math.min((totalSpent / monthlyIncome) * 100, 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-montra-lg bg-gradient-to-br from-violet-100 to-violet-80 p-6 text-white">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

      <div className="relative z-10">
        <p className="text-white/70 text-sm font-medium mb-1">Account Balance</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">{formatCurrency(remaining)}</h1>

        <div className="grid grid-cols-2 gap-4">
          {/* Income */}
          <div className="bg-white/15 backdrop-blur-sm rounded-montra-md p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-income-100 flex items-center justify-center">
                <ArrowDownLeft size={14} className="text-white" />
              </div>
              <span className="text-white/70 text-xs font-medium">Income</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(monthlyIncome)}</p>
          </div>

          {/* Expenses */}
          <div className="bg-white/15 backdrop-blur-sm rounded-montra-md p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-expense-100 flex items-center justify-center">
                <ArrowUpRight size={14} className="text-white" />
              </div>
              <span className="text-white/70 text-xs font-medium">Expenses</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(totalSpent)}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Budget used</span>
            <span>{spentPercentage.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${spentPercentage}%`,
                backgroundColor: spentPercentage > 80 ? '#FD3C4A' : spentPercentage > 60 ? '#FCAC12' : '#00A86B',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

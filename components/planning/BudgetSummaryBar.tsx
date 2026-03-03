'use client';

import { Wallet, Receipt, PiggyBank, Target } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

type Props = {
  income: number;
  recurringTotal: number;
  budgetTotal: number;
  actualSpent: number;
};

export default function BudgetSummaryBar({
  income,
  recurringTotal,
  budgetTotal,
  actualSpent,
}: Props) {
  const afterFixed = income - recurringTotal;
  const allocated = budgetTotal;
  const free = afterFixed - allocated;
  const usedPct = income > 0 ? (actualSpent / income) * 100 : 0;

  const monthName = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-4">
      {/* Month + spending badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 capitalize">
          {monthName}
        </h3>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            usedPct > 100
              ? 'bg-expense-20 text-expense-100 dark:bg-expense-100/10'
              : usedPct > 80
              ? 'bg-warning-20 text-warning-100 dark:bg-warning-100/10'
              : 'bg-income-20 text-income-100 dark:bg-income-100/10'
          }`}
        >
          {usedPct.toFixed(0)}% of income spent
        </span>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card p-4 flex items-start gap-3">
          <span className="p-2 rounded-montra-sm bg-income-20 text-income-100 dark:bg-income-100/10">
            <Wallet size={18} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Income</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(income)}
            </p>
          </div>
        </div>

        <div className="card p-4 flex items-start gap-3">
          <span className="p-2 rounded-montra-sm bg-expense-20 text-expense-100 dark:bg-expense-100/10">
            <Receipt size={18} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Fixed bills</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(recurringTotal)}
            </p>
            {income > 0 && (
              <p className="text-xs text-muted-foreground">
                {((recurringTotal / income) * 100).toFixed(0)}% of income
              </p>
            )}
          </div>
        </div>

        <div className="card p-4 flex items-start gap-3">
          <span className="p-2 rounded-montra-sm bg-violet-20 text-violet-100 dark:bg-violet-100/10">
            <Target size={18} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Allocated</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(allocated)}
            </p>
            {afterFixed > 0 && (
              <p className="text-xs text-muted-foreground">
                {((allocated / afterFixed) * 100).toFixed(0)}% of available
              </p>
            )}
          </div>
        </div>

        <div className="card p-4 flex items-start gap-3">
          <span className={`p-2 rounded-montra-sm ${
            free >= 0
              ? 'bg-income-20 text-income-100 dark:bg-income-100/10'
              : 'bg-expense-20 text-expense-100 dark:bg-expense-100/10'
          }`}>
            <PiggyBank size={18} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Free money</p>
            <p className={`text-lg font-bold ${
              free >= 0 ? 'text-income-100' : 'text-expense-100'
            }`}>
              {formatCurrency(free)}
            </p>
          </div>
        </div>
      </div>

      {/* Visual distribution bar */}
      <div className="card p-4">
        <p className="text-xs text-muted-foreground mb-2">Income distribution</p>
        <div className="w-full h-5 bg-surface-light dark:bg-dark-700 rounded-full overflow-hidden flex">
          {recurringTotal > 0 && income > 0 && (
            <div
              className="h-full bg-expense-100 transition-all duration-700 flex items-center justify-center"
              style={{ width: `${Math.min((recurringTotal / income) * 100, 100)}%` }}
            >
              {(recurringTotal / income) * 100 > 8 && (
                <span className="text-[10px] text-white font-medium">
                  {((recurringTotal / income) * 100).toFixed(0)}%
                </span>
              )}
            </div>
          )}
          {allocated > 0 && income > 0 && (
            <div
              className="h-full bg-violet-100 transition-all duration-700 flex items-center justify-center"
              style={{
                width: `${Math.min(
                  (allocated / income) * 100,
                  Math.max(100 - (recurringTotal / income) * 100, 0)
                )}%`,
              }}
            >
              {(allocated / income) * 100 > 8 && (
                <span className="text-[10px] text-white font-medium">
                  {((allocated / income) * 100).toFixed(0)}%
                </span>
              )}
            </div>
          )}
          {free > 0 && income > 0 && (
            <div
              className="h-full bg-income-100 transition-all duration-700 flex items-center justify-center"
              style={{
                width: `${Math.min(
                  (free / income) * 100,
                  Math.max(100 - (recurringTotal / income) * 100 - (allocated / income) * 100, 0)
                )}%`,
              }}
            >
              {(free / income) * 100 > 8 && (
                <span className="text-[10px] text-white font-medium">
                  {((free / income) * 100).toFixed(0)}%
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-expense-100 inline-block" />
            Fixed {formatCurrency(recurringTotal)}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-100 inline-block" />
            Allocated {formatCurrency(allocated)}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-income-100 inline-block" />
            Free {formatCurrency(Math.max(free, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}

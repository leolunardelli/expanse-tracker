'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/currency';
import { cancelRecurring } from '@/app/actions/recurring';
import { useToast } from '@/components/Toast';
import {
  CalendarClock,
  XCircle,
  RotateCcw,
  Calendar,
  Tag,
  AlertTriangle,
} from 'lucide-react';

type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date | string;
  isRecurring: boolean;
  recurrenceType: string | null;
  createdAt: Date | string;
};

type RecurringCardProps = {
  expense: Expense;
};

const frequencyConfig: Record<
  string,
  { label: string; color: string; monthlyMultiplier: number }
> = {
  daily: {
    label: 'Daily',
    color: 'bg-expense-20 text-expense-100 dark:bg-expense-100/10 dark:text-expense-100',
    monthlyMultiplier: 30,
  },
  weekly: {
    label: 'Weekly',
    color:
      'bg-warning-20 text-warning-100 dark:bg-warning-100/10 dark:text-warning-100',
    monthlyMultiplier: 4.33,
  },
  monthly: {
    label: 'Monthly',
    color: 'bg-violet-20 text-violet-100 dark:bg-violet-100/10 dark:text-violet-100',
    monthlyMultiplier: 1,
  },
  yearly: {
    label: 'Yearly',
    color:
      'bg-income-20 text-income-100 dark:bg-income-100/10 dark:text-income-100',
    monthlyMultiplier: 1 / 12,
  },
};

export default function RecurringCard({ expense }: RecurringCardProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();

  const freq = frequencyConfig[expense.recurrenceType || 'monthly'] ||
    frequencyConfig.monthly;

  const monthlyAmount = expense.amount * freq.monthlyMultiplier;
  const yearlyAmount = monthlyAmount * 12;

  const startDate = new Date(expense.createdAt);

  async function handleCancel() {
    setLoading(true);
    try {
      await cancelRecurring(expense.id);
    } catch {
      toast('Failed to cancel recurring expense', 'error');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  }

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title & Category */}
          <div className="flex items-center gap-2 mb-2">
            <RotateCcw className="w-4 h-4 text-violet-100 flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {expense.description}
            </h3>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${freq.color}`}
            >
              <CalendarClock className="w-3 h-3" />
              {freq.label}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-surface-light text-gray-700 dark:bg-dark-700 dark:text-gray-300">
              <Tag className="w-3 h-3" />
              {expense.category}
            </span>
          </div>

          {/* Cost breakdown */}
          <div className="space-y-1">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(expense.amount)}
              <span className="text-sm font-normal text-muted-foreground">
                /{expense.recurrenceType || 'month'}
              </span>
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{formatCurrency(monthlyAmount)}/mo</span>
              <span>{formatCurrency(yearlyAmount)}/yr</span>
            </div>
          </div>

          {/* Start date */}
          <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>
              Since{' '}
              {startDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Cancel button */}
        <div className="flex-shrink-0">
          {showConfirm ? (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 text-xs text-warning-100">
                <AlertTriangle className="w-3 h-3" />
                <span>Cancel this?</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="btn-danger px-3 py-1 text-xs"
                >
                  {loading ? 'Canceling...' : 'Yes'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-outline px-3 py-1 text-xs"
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 text-muted-foreground hover:text-expense-100 hover:bg-expense-20 dark:hover:bg-expense-100/10 rounded-montra-sm transition"
              title="Cancel recurring expense"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/currency';
import { cancelRecurring } from '@/app/actions/recurring';
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
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    monthlyMultiplier: 30,
  },
  weekly: {
    label: 'Weekly',
    color:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    monthlyMultiplier: 4.33,
  },
  monthly: {
    label: 'Monthly',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    monthlyMultiplier: 1,
  },
  yearly: {
    label: 'Yearly',
    color:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    monthlyMultiplier: 1 / 12,
  },
};

export default function RecurringCard({ expense }: RecurringCardProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      alert('Failed to cancel recurring expense');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title & Category */}
          <div className="flex items-center gap-2 mb-2">
            <RotateCcw className="w-4 h-4 text-blue-500 flex-shrink-0" />
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
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <Tag className="w-3 h-3" />
              {expense.category}
            </span>
          </div>

          {/* Cost breakdown */}
          <div className="space-y-1">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(expense.amount)}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                /{expense.recurrenceType || 'month'}
              </span>
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatCurrency(monthlyAmount)}/mo</span>
              <span>{formatCurrency(yearlyAmount)}/yr</span>
            </div>
          </div>

          {/* Start date */}
          <div className="flex items-center gap-1 mt-3 text-xs text-gray-400 dark:text-gray-500">
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
              <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                <span>Cancel this?</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {loading ? 'Canceling...' : 'Yes'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
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

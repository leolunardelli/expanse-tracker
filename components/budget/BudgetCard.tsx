'use client';

import { Trash2, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { deleteBudget } from '@/app/actions/budget';
import { formatCurrency } from '@/lib/currency';
import { useState } from 'react';

interface BudgetStatus {
  id: string;
  category: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  isNearLimit: boolean;
  alertAt: number;
}

const CATEGORY_INFO: Record<string, { label: string; emoji: string; color: string }> = {
  all: { label: 'Total Budget', emoji: '💰', color: 'purple' },
  food: { label: 'Food & Dining', emoji: '🍔', color: 'orange' },
  transport: { label: 'Transport', emoji: '🚗', color: 'blue' },
  entertainment: { label: 'Entertainment', emoji: '🎬', color: 'pink' },
  shopping: { label: 'Shopping', emoji: '🛍️', color: 'green' },
  bills: { label: 'Bills & Utilities', emoji: '📄', color: 'red' },
  health: { label: 'Health', emoji: '🏥', color: 'teal' },
  other: { label: 'Other', emoji: '📦', color: 'gray' },
};

interface BudgetCardProps {
  budget: BudgetStatus;
  onDelete?: () => void;
}

export default function BudgetCard({ budget, onDelete }: BudgetCardProps) {
  const [deleting, setDeleting] = useState(false);
  const info = CATEGORY_INFO[budget.category] || CATEGORY_INFO.other;

  const handleDelete = async () => {
    if (!confirm('Delete this budget?')) return;
    setDeleting(true);
    await deleteBudget(budget.id);
    onDelete?.();
    setDeleting(false);
  };

  const getProgressColor = () => {
    if (budget.isOverBudget) return 'bg-red-500';
    if (budget.isNearLimit) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = () => {
    if (budget.isOverBudget) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
    if (budget.isNearLimit) {
      return <TrendingUp className="w-5 h-5 text-yellow-500" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusText = () => {
    if (budget.isOverBudget) {
      return `Over budget by ${formatCurrency(Math.abs(budget.remaining))}`;
    }
    if (budget.isNearLimit) {
      return `${formatCurrency(budget.remaining)} left - approaching limit`;
    }
    return `${formatCurrency(budget.remaining)} remaining`;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 ${
      budget.isOverBudget ? 'border-red-500' : budget.isNearLimit ? 'border-yellow-500' : 'border-green-500'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{info.emoji}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {info.label}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Alert at {budget.alertAt}%
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 text-gray-400 hover:text-red-500 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">
            {formatCurrency(budget.spent)} spent
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(budget.budgetAmount)}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-500`}
            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-500">{budget.percentage.toFixed(0)}% used</span>
          {budget.isOverBudget && (
            <span className="text-red-500 font-medium">
              {((budget.spent / budget.budgetAmount) * 100 - 100).toFixed(0)}% over
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <div className={`flex items-center gap-2 p-2 rounded-lg ${
        budget.isOverBudget 
          ? 'bg-red-50 dark:bg-red-900/20' 
          : budget.isNearLimit 
            ? 'bg-yellow-50 dark:bg-yellow-900/20' 
            : 'bg-green-50 dark:bg-green-900/20'
      }`}>
        {getStatusIcon()}
        <span className={`text-sm font-medium ${
          budget.isOverBudget 
            ? 'text-red-700 dark:text-red-400' 
            : budget.isNearLimit 
              ? 'text-yellow-700 dark:text-yellow-400' 
              : 'text-green-700 dark:text-green-400'
        }`}>
          {getStatusText()}
        </span>
      </div>
    </div>
  );
}

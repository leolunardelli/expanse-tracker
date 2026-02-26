'use client';

import { Trash2, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { deleteBudget } from '@/app/actions/budget';
import { formatCurrency } from '@/lib/currency';
import { getCategoryConfig } from '@/lib/design-tokens';
import { CategoryIcon } from '@/components/ui';
import { type CategoryKey } from '@/lib/design-tokens';
import { useState } from 'react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

type BudgetStatus = {
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

type BudgetCardProps = {
  budget: BudgetStatus;
  onDelete?: () => void;
}

export default function BudgetCard({ budget, onDelete }: BudgetCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const config = getCategoryConfig(budget.category);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteBudget(budget.id);
    onDelete?.();
    setDeleting(false);
    setShowDeleteConfirm(false);
  };

  const getProgressColor = () => {
    if (budget.isOverBudget) return 'bg-expense-100';
    if (budget.isNearLimit) return 'bg-warning-100';
    return 'bg-income-100';
  };

  const getStatusIcon = () => {
    if (budget.isOverBudget) {
      return <AlertTriangle className="w-4 h-4 text-expense-100" />;
    }
    if (budget.isNearLimit) {
      return <TrendingUp className="w-4 h-4 text-warning-100" />;
    }
    return <CheckCircle className="w-4 h-4 text-income-100" />;
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
    <>
    <div className={`card p-5 border-l-4 ${
      budget.isOverBudget ? 'border-expense-100' : budget.isNearLimit ? 'border-warning-100' : 'border-income-100'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <CategoryIcon category={budget.category as CategoryKey} size="sm" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {config.label}
            </h3>
            <p className="text-xs text-muted-foreground">
              Alert at {budget.alertAt}%
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleting}
          className="p-1.5 text-muted-foreground hover:text-expense-100 transition rounded-full hover:bg-expense-20 dark:hover:bg-expense-100/10"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">
            {formatCurrency(budget.spent)} spent
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(budget.budgetAmount)}
          </span>
        </div>
        <div className="w-full h-2 bg-surface-light dark:bg-dark-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-muted-foreground">{budget.percentage.toFixed(0)}% used</span>
          {budget.isOverBudget && (
            <span className="text-expense-100 font-medium">
              {((budget.spent / budget.budgetAmount) * 100 - 100).toFixed(0)}% over
            </span>
          )}
        </div>
      </div>

      <div className={`flex items-center gap-2 p-2 rounded-montra-sm ${
        budget.isOverBudget 
          ? 'bg-expense-20 dark:bg-expense-100/10' 
          : budget.isNearLimit 
            ? 'bg-warning-20 dark:bg-warning-100/10' 
            : 'bg-income-20 dark:bg-income-100/10'
      }`}>
        {getStatusIcon()}
        <span className={`text-xs font-medium ${
          budget.isOverBudget 
            ? 'text-expense-100' 
            : budget.isNearLimit 
              ? 'text-warning-100' 
              : 'text-income-100'
        }`}>
          {getStatusText()}
        </span>
      </div>
    </div>

    <DeleteConfirmDialog
      isOpen={showDeleteConfirm}
      title="Delete Budget"
      message={`Delete the ${config.label} budget? This action cannot be undone.`}
      onConfirm={handleDelete}
      onCancel={() => setShowDeleteConfirm(false)}
    />
    </>
  );
}

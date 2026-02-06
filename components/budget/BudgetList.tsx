'use client';

import { useEffect, useState } from 'react';
import { getBudgetStatus } from '@/app/actions/budget';
import BudgetForm from './BudgetForm';
import BudgetCard from './BudgetCard';
import { Wallet } from 'lucide-react';

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

export default function BudgetList() {
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchBudgets = async () => {
      setLoading(true);
      const data = await getBudgetStatus();
      if (mounted) {
        setBudgets(data);
        setLoading(false);
      }
    };
    fetchBudgets();
    return () => { mounted = false; };
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  const existingCategories = budgets.map((b) => b.category);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <BudgetForm existingCategories={existingCategories} onSuccess={handleRefresh} />

      {budgets.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Wallet className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No budgets set
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Create your first budget to start tracking your spending limits. 
            Set a total budget or budgets for specific categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {budgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} onDelete={handleRefresh} />
          ))}
        </div>
      )}

      {/* Tips */}
      {budgets.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            💡 Budget Tips
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Set a "Total Budget" to limit your overall monthly spending</li>
            <li>• Add category budgets to control specific spending areas</li>
            <li>• Alerts will notify you when approaching your limits</li>
            <li>• Review and adjust budgets monthly based on your needs</li>
          </ul>
        </div>
      )}
    </div>
  );
}

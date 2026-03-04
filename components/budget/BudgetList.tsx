'use client';

import { useEffect, useState } from 'react';
import { getBudgetStatus } from '@/app/actions/budget';
import { getCustomCategories } from '@/app/actions/categories';
import BudgetForm from './BudgetForm';
import BudgetCard from './BudgetCard';
import { Wallet } from 'lucide-react';

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

type CustomCat = { name: string; color: string; icon: string };

export default function BudgetList() {
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      const [data, customCats] = await Promise.all([
        getBudgetStatus(),
        getCustomCategories(),
      ]);
      if (mounted) {
        setBudgets(data);
        setCustomCategories(customCats.map((c) => ({ name: c.name, color: c.color, icon: c.icon })));
        setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  const existingCategories = budgets.map((b) => b.category);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 w-32 bg-surface-light dark:bg-dark-700 rounded-montra-sm animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-surface-light dark:bg-dark-700 rounded-montra animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <BudgetForm existingCategories={existingCategories} customCategories={customCategories} onSuccess={handleRefresh} />

      {budgets.length === 0 ? (
        <div className="card p-12 text-center">
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No budgets set
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
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

      {budgets.length > 0 && (
        <div className="mt-8 p-5 bg-violet-20 dark:bg-violet-100/5 rounded-montra border border-violet-40 dark:border-violet-100/10">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
            Budget Tips
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1">
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

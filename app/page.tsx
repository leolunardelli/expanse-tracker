import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getFilteredExpenses, getCategories, getExpenseStats, getTags } from './actions/expenses';
import { getAIInsights } from './actions/ai';
import { getMonthlyPlanSummary } from './actions/planning';
import AppShell from '@/components/AppShell';
import ExpenseForm from '@/components/ExpenseForm';
import ExportButton from '@/components/ExportButton';
import StatsCard from '@/components/StatsCard';
import AIInsights from '@/components/AIInsights';
import BudgetAlerts from '@/components/budget/BudgetAlerts';
import FilteredExpenseList from '@/components/filters/FilteredExpenseList';
import { authOptions } from '@/lib/auth';
import { formatCurrency } from '@/lib/currency';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }
  
  const [{ expenses, pagination }, categories, stats, insights, availableTags, planSummary] = await Promise.all([
    getFilteredExpenses({ page: 1, pageSize: 10 }),
    getCategories(),
    getExpenseStats(),
    getAIInsights(),
    getTags(),
    getMonthlyPlanSummary(),
  ]);
  
  return (
    <AppShell userName={session.user?.name} userImage={session.user?.image}>
      <BudgetAlerts />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Spent" value={formatCurrency(stats.total)} />
        <StatsCard title="Transactions" value={stats.count} />
        <StatsCard title="Categories" value={Object.keys(stats.byCategory).length} />
        <StatsCard
          title="Available Income"
          value={formatCurrency(planSummary.remaining)}
          className={planSummary.remaining < 0 ? 'border-expense-20 dark:border-expense-100/20' : 'border-income-20 dark:border-income-100/20'}
        />
      </div>
      
      <AIInsights insights={insights} />
      
      <div className="flex justify-end mb-4">
        <ExportButton />
      </div>
      
      <div className="mb-6">
        <ExpenseForm />
      </div>

      <Suspense fallback={
        <div className="card p-6 animate-pulse">
          <div className="h-6 bg-surface-light dark:bg-dark-700 rounded w-32 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface-light dark:bg-dark-700 rounded-montra-sm" />
            ))}
          </div>
        </div>
      }>
        <FilteredExpenseList
          categories={categories}
          availableTags={availableTags}
          initialExpenses={expenses}
          initialPagination={pagination}
        />
      </Suspense>
    </AppShell>
  );
}

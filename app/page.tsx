import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getFilteredExpenses, getCategories, getExpenseStats, getTags } from './actions/expenses';
import { getAIInsights } from './actions/ai';
import { getMonthlyPlanSummary } from './actions/planning';
import Header from '@/components/Header';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header userName={session.user?.name} userImage={session.user?.image} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <BudgetAlerts />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Spent" value={formatCurrency(stats.total)} />
          <StatsCard title="Transactions" value={stats.count} />
          <StatsCard title="Categories" value={Object.keys(stats.byCategory).length} />
          <StatsCard
            title="Renda disponível"
            value={formatCurrency(planSummary.remaining)}
            className={planSummary.remaining < 0 ? 'border-red-200 dark:border-red-800' : 'border-green-200 dark:border-green-800'}
          />
        </div>
        
        <AIInsights insights={insights} />
        
        <div className="flex justify-end mb-6">
          <ExportButton />
        </div>
        
        <div className="mb-8">
          <ExpenseForm />
        </div>

        <Suspense fallback={
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg" />
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
      </main>
    </div>
  );
}

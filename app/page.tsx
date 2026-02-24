import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getFilteredExpenses, getCategories, getExpenseStats } from './actions/expenses';
import { getAIInsights } from './actions/ai';
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
  
  const [{ expenses, pagination }, categories, stats, insights] = await Promise.all([
    getFilteredExpenses({ page: 1, pageSize: 10 }),
    getCategories(),
    getExpenseStats(),
    getAIInsights(),
  ]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header userName={session.user?.name} userImage={session.user?.image} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <BudgetAlerts />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Spent" value={formatCurrency(stats.total)} />
          <StatsCard title="Transactions" value={stats.count} />
          <StatsCard title="Categories" value={Object.keys(stats.byCategory).length} />
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
            initialExpenses={expenses}
            initialPagination={pagination}
          />
        </Suspense>
      </main>
    </div>
  );
}

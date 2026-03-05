import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getFilteredExpenses, getCategories, getExpenseStats, getTags } from './actions/expenses';
import { getMonthlyPlanSummary } from './actions/planning';
import AppShell from '@/components/AppShell';
import ExportButton from '@/components/ExportButton';
import BudgetAlerts from '@/components/budget/BudgetAlerts';
import FilteredExpenseList from '@/components/filters/FilteredExpenseList';
import BalanceCard from '@/components/dashboard/BalanceCard';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import QuickActions from '@/components/dashboard/QuickActions';
import DashboardGreeting from '@/components/dashboard/DashboardGreeting';
import AsyncAIInsights from '@/components/dashboard/AsyncAIInsights';
import { TransactionListSkeleton } from '@/components/Skeletons';
import { authOptions } from '@/lib/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }
  
  const [{ expenses, pagination }, categories, stats, availableTags, planSummary] = await Promise.all([
    getFilteredExpenses({ page: 1, pageSize: 10 }),
    getCategories(),
    getExpenseStats('month'),
    getTags(),
    getMonthlyPlanSummary(),
  ]);
  
  return (
    <AppShell userName={session.user?.name} userImage={session.user?.image}>
      <BudgetAlerts />
      
      {/* Greeting */}
      <div className="mb-6">
        <DashboardGreeting userName={session.user?.name} />
      </div>

      {/* Balance Hero Card */}
      <div className="mb-6">
        <BalanceCard
          totalSpent={stats.total}
          monthlyIncome={planSummary.income}
          remaining={planSummary.remaining}
          transactionCount={stats.count}
        />
      </div>

      {/* Stats with Date Range Filter + Spending Breakdown */}
      <DashboardStats initialStats={stats} />

      {/* AI Insights (loads client-side, non-blocking) */}
      <div className="mb-6">
        <AsyncAIInsights />
      </div>
      
      {/* Recent Transactions */}
      <div className="mb-6">
        <RecentTransactions transactions={expenses} />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <QuickActions />
      </div>

      {/* Export */}
      <div className="flex justify-end mb-4">
        <ExportButton />
      </div>
      
      {/* Full Transaction List */}
      <Suspense fallback={<TransactionListSkeleton />}>
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

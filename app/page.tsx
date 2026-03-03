import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getFilteredExpenses, getCategories, getExpenseStats, getTags } from './actions/expenses';
import { getMonthlyPlanSummary } from './actions/planning';
import AppShell from '@/components/AppShell';
import ExpenseForm from '@/components/ExpenseForm';
import ExportButton from '@/components/ExportButton';
import BudgetAlerts from '@/components/budget/BudgetAlerts';
import FilteredExpenseList from '@/components/filters/FilteredExpenseList';
import BalanceCard from '@/components/dashboard/BalanceCard';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import QuickActions from '@/components/dashboard/QuickActions';
import DashboardGreeting from '@/components/dashboard/DashboardGreeting';
import ExpenseTemplates from '@/components/dashboard/ExpenseTemplates';
import AsyncAIInsights from '@/components/dashboard/AsyncAIInsights';
import { TransactionListSkeleton, Skeleton } from '@/components/Skeletons';
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

      {/* Quick Add Templates */}
      <div className="mb-6">
        <ExpenseTemplates />
      </div>

      {/* AI Insights (streamed independently) */}
      <div className="mb-6">
        <Suspense fallback={
          <div className="card p-4 space-y-3 animate-pulse">
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        }>
          <AsyncAIInsights />
        </Suspense>
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
      
      {/* Add Expense Form */}
      <div className="mb-6">
        <ExpenseForm />
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

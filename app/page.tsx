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
import BalanceCard from '@/components/dashboard/BalanceCard';
import SpendingBreakdown from '@/components/dashboard/SpendingBreakdown';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import QuickActions from '@/components/dashboard/QuickActions';
import DashboardGreeting from '@/components/dashboard/DashboardGreeting';
import { TransactionListSkeleton } from '@/components/Skeletons';
import { authOptions } from '@/lib/auth';
import { formatCurrency } from '@/lib/currency';
import { Wallet, Receipt, FolderOpen } from 'lucide-react';

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

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatsCard
          title="Spent"
          value={formatCurrency(stats.total)}
          icon={<Wallet size={16} />}
        />
        <StatsCard
          title="Transactions"
          value={stats.count}
          icon={<Receipt size={16} />}
        />
        <StatsCard
          title="Categories"
          value={Object.keys(stats.byCategory).length}
          icon={<FolderOpen size={16} />}
        />
      </div>

      {/* AI Insights */}
      <div className="mb-6">
        <AIInsights insights={insights} />
      </div>
      
      {/* Two Column Layout: Spending + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <SpendingBreakdown byCategory={stats.byCategory} total={stats.total} />
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

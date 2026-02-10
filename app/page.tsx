import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getExpenses, getExpenseStats } from './actions/expenses';
import { getAIInsights } from './actions/ai';
import Header from '@/components/Header';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExportButton from '@/components/ExportButton';
import StatsCard from '@/components/StatsCard';
import AIInsights from '@/components/AIInsights';
import BudgetAlerts from '@/components/budget/BudgetAlerts';
import { authOptions } from '@/lib/auth';
import { formatCurrency } from '@/lib/currency';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }
  
  const expenses = await getExpenses();
  const stats = await getExpenseStats();
  const insights = await getAIInsights();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={session.user?.name} userImage={session.user?.image} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Budget Alerts */}
        <BudgetAlerts />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Spent" value={formatCurrency(stats.total)} />
          <StatsCard title="Transactions" value={stats.count} />
          <StatsCard title="Categories" value={Object.keys(stats.byCategory).length} />
        </div>
        
        <AIInsights insights={insights} />
        
        {/* Export Button */}
        <div className="flex justify-end mb-6">
          <ExportButton />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <ExpenseForm />
          <ExpenseList expenses={expenses} />
        </div>
      </main>
    </div>
  );
}

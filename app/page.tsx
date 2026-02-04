import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getExpenses, getExpenseStats } from './actions/expenses';
import { getAIInsights } from './actions/ai';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import StatsCard from '@/components/StatsCard';
import AIInsights from '@/components/AIInsights';
import { authOptions } from '@/lib/auth';

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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">💰 Expense Tracker</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{session.user?.name}</span>
            {session.user?.image && (
              <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full" />
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Spent" value={`$${stats.total.toFixed(2)}`} />
          <StatsCard title="Transactions" value={stats.count} />
          <StatsCard title="Categories" value={Object.keys(stats.byCategory).length} />
        </div>
        
        <AIInsights insights={insights} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <ExpenseForm />
          <ExpenseList expenses={expenses} />
        </div>
      </main>
    </div>
  );
}

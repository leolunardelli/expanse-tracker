import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Header from '@/components/Header';
import BudgetList from '@/components/budget/BudgetList';
import { Target, TrendingUp } from 'lucide-react';

export default async function BudgetPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header userName={session.user?.name} userImage={session.user?.image} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Budget Goals
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            Set spending limits and track your progress
          </p>
        </div>

        <BudgetList />
      </main>
    </div>
  );
}

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AppShell from '@/components/AppShell';
import BudgetList from '@/components/budget/BudgetList';
import { Target, TrendingUp } from 'lucide-react';

export default async function BudgetPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <AppShell userName={session.user?.name} userImage={session.user?.image}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-100 rounded-montra-sm">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
            Budget Goals
          </h1>
        </div>
        <p className="text-muted flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-100" />
          Set spending limits and track your progress
        </p>
      </div>

      <BudgetList />
    </AppShell>
  );
}

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getRecurringExpenses, getRecurringStats } from '../actions/recurring';
import AppShell from '@/components/AppShell';
import RecurringStats from '@/components/recurring/RecurringStats';
import RecurringList from '@/components/recurring/RecurringList';
import AddRecurringForm from '@/components/recurring/AddRecurringForm';
import { RefreshCw, TrendingUp } from 'lucide-react';

export default async function RecurringPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const [expenses, stats] = await Promise.all([
    getRecurringExpenses(),
    getRecurringStats(),
  ]);

  return (
    <AppShell userName={session.user?.name} userImage={session.user?.image}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-100 rounded-montra-sm">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
            Recurring Expenses
          </h1>
        </div>
        <p className="text-muted flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-100" />
          Manage subscriptions and recurring bills
        </p>
      </div>

      <RecurringStats stats={stats} />

      {/* Add Recurring Expense */}
      <div className="mb-6">
        <AddRecurringForm />
      </div>

        {/* Category Breakdown */}
        {Object.keys(stats.byCategory).length > 0 && (
          <div className="card p-5 mb-8">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Monthly Cost by Category
            </h2>
            <div className="space-y-3">
              {Object.entries(stats.byCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => {
                  const percentage =
                    stats.monthlyTotal > 0
                      ? (amount / stats.monthlyTotal) * 100
                      : 0;
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">
                          {category}
                        </span>
                        <span className="text-muted-foreground">
                          ${amount.toFixed(2)}/mo ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-surface-light dark:bg-dark-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-violet-100 to-violet-60 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        <RecurringList expenses={expenses} />
    </AppShell>
  );
}

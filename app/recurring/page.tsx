import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getRecurringExpenses, getRecurringStats } from '../actions/recurring';
import AppShell from '@/components/AppShell';
import RecurringStats from '@/components/recurring/RecurringStats';
import RecurringList from '@/components/recurring/RecurringList';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Plus } from 'lucide-react';

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-gray-900 dark:hover:text-gray-200 transition"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-100 to-violet-60 rounded-montra-sm">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Recurring Expenses
                </h1>
                <p className="text-sm text-muted-foreground">
                  Track and manage your subscriptions & recurring costs
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="btn-primary flex items-center gap-2 px-4 py-2 text-sm font-medium"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Expense</span>
          </Link>
        </div>

        <RecurringStats stats={stats} />

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

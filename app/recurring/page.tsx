import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getRecurringExpenses, getRecurringStats } from '../actions/recurring';
import Header from '@/components/Header';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header userName={session.user?.name} userImage={session.user?.image} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Recurring Expenses
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track and manage your subscriptions & recurring costs
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Expense</span>
          </Link>
        </div>

        <RecurringStats stats={stats} />

        {/* Category Breakdown */}
        {Object.keys(stats.byCategory).length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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
                        <span className="text-gray-500 dark:text-gray-400">
                          ${amount.toFixed(2)}/mo ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
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
      </main>
    </div>
  );
}

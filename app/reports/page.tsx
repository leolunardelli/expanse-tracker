import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getMonthlyReport, getAvailableMonths } from '../actions/reports';
import { getBudgets } from '../actions/budget';
import Header from '@/components/Header';
import ReportView from '@/components/reports/ReportView';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const months = await getAvailableMonths();

  // Get initial report for the most recent month
  const currentMonth =
    months.length > 0
      ? months[0].value
      : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  const [initialReport, allBudgets] = await Promise.all([
    getMonthlyReport(currentMonth),
    getBudgets(),
  ]);

  // Calculate budget progress for initial month
  const initialBudgets = allBudgets
    .map((b) => {
      const catData = initialReport.categoryBreakdown.find(
        (c) => c.name === b.category
      );
      const spent = catData?.amount || 0;
      return {
        category: b.category,
        budgetAmount: b.amount,
        spent,
        percentage: b.amount > 0 ? (spent / b.amount) * 100 : 0,
      };
    })
    .filter((b) => b.spent > 0 || b.budgetAmount > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header userName={session.user?.name} userImage={session.user?.image} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              📋 Monthly Reports
            </h1>
          </div>
        </div>

        <ReportView
          months={months}
          initialReport={initialReport}
          initialBudgets={initialBudgets}
        />
      </main>
    </div>
  );
}

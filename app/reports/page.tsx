import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getMonthlyReport, getAvailableMonths } from '../actions/reports';
import { getBudgets } from '../actions/budget';
import AppShell from '@/components/AppShell';
import ReportView from '@/components/reports/ReportView';


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
    <AppShell userName={session.user?.name} userImage={session.user?.image}>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
          Monthly Reports
        </h1>
      </div>

      <ReportView
        months={months}
        initialReport={initialReport}
        initialBudgets={initialBudgets}
      />
    </AppShell>
  );
}

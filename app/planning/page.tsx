import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AppShell from '@/components/AppShell';
import IncomeForm from '@/components/planning/IncomeForm';
import IncomeList from '@/components/planning/IncomeList';
import PlannedExpenseForm from '@/components/planning/PlannedExpenseForm';
import PlannedExpenseList from '@/components/planning/PlannedExpenseList';
import MonthlyOverview from '@/components/planning/MonthlyOverview';
import PlanningProgressBar from '@/components/planning/PlanningProgressBar';
import CategoryComparison from '@/components/planning/CategoryComparison';
import { getIncomes, getPlannedExpenses, getMonthlyPlanSummary } from '@/app/actions/planning';

export const metadata = {
  title: 'Monthly Planning | Expanse Tracker',
  description: 'Plan your monthly income and expenses to keep your budget on track.',
};

export default async function PlanningPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  const [incomes, expenses, summary] = await Promise.all([
    getIncomes(),
    getPlannedExpenses(),
    getMonthlyPlanSummary(),
  ]);

  return (
    <AppShell userName={session.user?.name} userImage={session.user?.image}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
          Monthly Planning
        </h1>
        <p className="text-sm text-muted mt-1">
          Set your income and expenses to see how much you have left at the end of the month.
        </p>
      </div>

        {/* Overview section */}
        <section className="mb-8">
          <MonthlyOverview summary={summary} />
        </section>

        {/* Progress bar */}
        <section className="mb-8">
          <PlanningProgressBar
            income={summary.income}
            plannedFixed={summary.plannedFixed}
            plannedVariable={summary.plannedVariable}
            recurringTotal={summary.recurringTotal}
            actualSpent={summary.actualSpent}
          />
        </section>

        {/* Income and Expenses side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income section */}
          <section className="card p-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-income-100" />
              Income Sources
            </h2>
            <IncomeForm />
            <div className="mt-4">
              <IncomeList incomes={incomes} />
            </div>
          </section>

          {/* Planned expenses section */}
          <section className="card p-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-expense-100" />
              Planned Expenses
            </h2>
            <PlannedExpenseForm />
            <div className="mt-4">
              <PlannedExpenseList expenses={expenses} />
            </div>
          </section>
        </div>

        {/* Category comparison */}
        <section className="mb-8">
          <CategoryComparison data={summary.categoryComparison} />
        </section>
    </AppShell>
  );
}

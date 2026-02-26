import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Header from '@/components/Header';
import IncomeForm from '@/components/planning/IncomeForm';
import IncomeList from '@/components/planning/IncomeList';
import PlannedExpenseForm from '@/components/planning/PlannedExpenseForm';
import PlannedExpenseList from '@/components/planning/PlannedExpenseList';
import MonthlyOverview from '@/components/planning/MonthlyOverview';
import PlanningProgressBar from '@/components/planning/PlanningProgressBar';
import CategoryComparison from '@/components/planning/CategoryComparison';
import { getIncomes, getPlannedExpenses, getMonthlyPlanSummary } from '@/app/actions/planning';

export const metadata = {
  title: 'Planejamento Mensal | Expanse Tracker',
  description: 'Planeje sua renda e despesas mensais para controlar seu orçamento.',
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Planejamento Mensal
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Defina sua renda e despesas para visualizar quanto sobra no final do mês.
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
            actualSpent={summary.actualSpent}
          />
        </section>

        {/* Income and Expenses side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income section */}
          <section className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Fontes de renda
            </h2>
            <IncomeForm />
            <div className="mt-4">
              <IncomeList incomes={incomes} />
            </div>
          </section>

          {/* Planned expenses section */}
          <section className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Despesas planejadas
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
      </main>
    </div>
  );
}

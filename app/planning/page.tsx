import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AppShell from '@/components/AppShell';
import IncomeForm from '@/components/planning/IncomeForm';
import IncomeList from '@/components/planning/IncomeList';
import BudgetSummaryBar from '@/components/planning/BudgetSummaryBar';
import RecurringInPlanning from '@/components/planning/RecurringInPlanning';
import BudgetAllocation from '@/components/planning/BudgetAllocation';
import BudgetTracker from '@/components/planning/BudgetTracker';
import { getIncomes, getMonthlyPlanSummary, getRecurringExpenseItems, getRecurringByCategory } from '@/app/actions/planning';
import { getBudgets, getBudgetStatus } from '@/app/actions/budget';
import { CATEGORIES } from '@/lib/design-tokens';

export const metadata = {
  title: 'Monthly Budget | Expanse Tracker',
  description: 'Set your salary, see your fixed bills, and allocate the rest.',
};

export default async function PlanningPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  const [incomes, summary, recurringItems, recurringByCat, budgets, budgetStatus] = await Promise.all([
    getIncomes(),
    getMonthlyPlanSummary(),
    getRecurringExpenseItems(),
    getRecurringByCategory(),
    getBudgets(),
    getBudgetStatus(),
  ]);

  return (
    <AppShell userName={session.user?.name} userImage={session.user?.image}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
          Monthly Budget
        </h1>
        <p className="text-sm text-muted mt-1">
          Salary → Fixed bills → Allocate the rest
        </p>
      </div>

      {/* Summary bar — key numbers at a glance */}
      <section className="mb-8">
        <BudgetSummaryBar
          income={summary.income}
          recurringTotal={summary.recurringTotal}
          budgetTotal={summary.budgetTotal}
          actualSpent={summary.actualSpent}
        />
      </section>

      {/* Step 1: Income / Salary */}
      <section className="card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-income-20 text-income-100 text-xs font-bold dark:bg-income-100/10">
            1
          </span>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Your Income
          </h2>
        </div>
        <IncomeForm />
        <div className="mt-4">
          <IncomeList incomes={incomes} />
        </div>
      </section>

      {/* Step 2: Fixed / Recurring Expenses (auto-pulled) */}
      <section className="card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-expense-20 text-expense-100 text-xs font-bold dark:bg-expense-100/10">
            2
          </span>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Fixed Bills
          </h2>
          <span className="text-xs text-muted-foreground ml-auto">Auto-synced from recurring expenses</span>
        </div>
        <RecurringInPlanning items={recurringItems} />
      </section>

      {/* Step 3: Allocate remaining income to categories */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-20 text-violet-100 text-xs font-bold dark:bg-violet-100/10">
            3
          </span>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Allocate the Rest
          </h2>
        </div>
        <BudgetAllocation
          income={summary.income}
          recurringTotal={summary.recurringTotal}
          currentBudgets={budgets.map((b) => ({ category: b.category, amount: b.amount }))}
          recurringByCategory={recurringByCat}
          categories={CATEGORIES as unknown as string[]}
        />
      </section>

      {/* Step 4: Live budget tracking */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-income-20 text-income-100 text-xs font-bold dark:bg-income-100/10">
            4
          </span>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Track Spending
          </h2>
          <span className="text-xs text-muted-foreground ml-auto">Updates automatically when you add expenses</span>
        </div>
        <BudgetTracker budgets={budgetStatus} />
      </section>
    </AppShell>
  );
}

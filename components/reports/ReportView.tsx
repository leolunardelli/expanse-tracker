'use client';

import { useState, useEffect, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { getMonthlyReport, MonthlyReport } from '@/app/actions/reports';
import { getBudgets } from '@/app/actions/budget';
import MonthSelector from './MonthSelector';
import MonthlyOverviewCards from './MonthlyOverviewCards';
import MonthlyCategoryBreakdown from './MonthlyCategoryBreakdown';
import MonthlyDailyChart from './MonthlyDailyChart';
import MonthlyTopExpenses from './MonthlyTopExpenses';
import MonthlyComparison from './MonthlyComparison';
import MonthlyBudgetProgress from './MonthlyBudgetProgress';
import MonthlyExportButton from './MonthlyExportButton';

type AvailableMonth = {
  value: string;
  label: string;
  count: number;
  total: number;
};

type BudgetItem = {
  category: string;
  budgetAmount: number;
  spent: number;
  percentage: number;
};

type ReportViewProps = {
  months: AvailableMonth[];
  initialReport: MonthlyReport;
  initialBudgets: BudgetItem[];
};

export default function ReportView({
  months,
  initialReport,
  initialBudgets,
}: ReportViewProps) {
  const [selectedMonth, setSelectedMonth] = useState(
    months.length > 0 ? months[0].value : ''
  );
  const [report, setReport] = useState<MonthlyReport>(initialReport);
  const [budgets, setBudgets] = useState<BudgetItem[]>(initialBudgets);
  const [isPending, startTransition] = useTransition();
  const [initialized, setInitialized] = useState(true);

  useEffect(() => {
    if (!initialized) return;
    // Skip initial fetch since we have initialReport
    setInitialized(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleMonthChange(month: string) {
    setSelectedMonth(month);
    startTransition(async () => {
      const [newReport, allBudgets] = await Promise.all([
        getMonthlyReport(month),
        getBudgets(),
      ]);
      setReport(newReport);

      // Calculate budget progress for selected month categories
      const budgetItems: BudgetItem[] = allBudgets
        .map((b) => {
          const catData = newReport.categoryBreakdown.find(
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

      setBudgets(budgetItems);
    });
  }

  if (months.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No expense data yet. Add expenses to generate monthly reports.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading overlay */}
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-950/50 rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Month selector */}
      <MonthSelector
        months={months}
        selected={selectedMonth}
        onSelect={handleMonthChange}
      />

      {/* Export / Print buttons */}
      <div className="flex justify-end mb-4 print:hidden">
        <MonthlyExportButton report={report} />
      </div>

      {/* Overview cards */}
      <MonthlyOverviewCards
        totalSpent={report.totalSpent}
        transactionCount={report.transactionCount}
        avgPerTransaction={report.avgPerTransaction}
        avgPerDay={report.avgPerDay}
        daysWithSpending={report.daysWithSpending}
        daysInMonth={report.daysInMonth}
        highestDay={report.highestDay}
        lowestDay={report.lowestDay}
      />

      {/* Month comparison */}
      <div className="mb-6">
        <MonthlyComparison
          currentMonthLabel={report.monthLabel}
          currentTotal={report.totalSpent}
          comparison={report.comparison}
        />
      </div>

      {/* Daily chart */}
      <div className="mb-6">
        <MonthlyDailyChart
          data={report.dailySpending}
          avgPerDay={report.avgPerDay}
        />
      </div>

      {/* Category + Top expenses side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MonthlyCategoryBreakdown
          data={report.categoryBreakdown}
          totalSpent={report.totalSpent}
        />
        <MonthlyTopExpenses
          expenses={report.topExpenses}
          totalSpent={report.totalSpent}
        />
      </div>

      {/* Budget progress */}
      <div className="mb-6">
        <MonthlyBudgetProgress budgets={budgets} />
      </div>
    </div>
  );
}

import { TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard, Receipt, ArrowUpRight, ArrowDownRight, RefreshCw, Target } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

type MonthlyPlanSummary = {
  income: number;
  plannedFixed: number;
  plannedVariable: number;
  recurringTotal: number;
  totalPlanned: number;
  disposable: number;
  actualSpent: number;
  remaining: number;
  incomeUsedPercent: number;
  budgetTotal: number;
};

function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
  subtext,
}: {
  label: string;
  value: number;
  icon: typeof Wallet;
  color: string;
  subtext?: string;
}) {
  return (
    <div className="card p-4 flex items-start gap-3">
      <span className={`p-2.5 rounded-montra-sm ${color}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-xl font-bold mt-0.5 ${
          value >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-expense-100'
        }`}>
          {formatCurrency(Math.abs(value))}
          {value < 0 && <span className="text-sm ml-1">(negative)</span>}
        </p>
        {subtext && <p className="text-xs text-muted-foreground mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}

export default function MonthlyOverview({ summary }: { summary: MonthlyPlanSummary }) {
  const {
    income,
    plannedFixed,
    plannedVariable,
    recurringTotal,
    totalPlanned,
    disposable,
    actualSpent,
    remaining,
    incomeUsedPercent,
    budgetTotal,
  } = summary;

  const isOverBudget = remaining < 0;
  const disposableIsNegative = disposable < 0;

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 capitalize">{monthName}</h3>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            isOverBudget
              ? 'bg-expense-20 text-expense-100 dark:bg-expense-100/10'
              : incomeUsedPercent > 80
              ? 'bg-warning-20 text-warning-100 dark:bg-warning-100/10'
              : 'bg-income-20 text-income-100 dark:bg-income-100/10'
          }`}
        >
          {incomeUsedPercent.toFixed(1)}% of income used
        </span>
      </div>

      {/* Main cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <SummaryCard
          label="Monthly income"
          value={income}
          icon={Wallet}
          color="bg-income-20 text-income-100 dark:bg-income-100/10 dark:text-income-100"
        />
        <SummaryCard
          label="Fixed expenses"
          value={plannedFixed}
          icon={Receipt}
          color="bg-expense-20 text-expense-100 dark:bg-expense-100/10 dark:text-expense-100"
          subtext={income > 0 ? `${((plannedFixed / income) * 100).toFixed(0)}% of income` : undefined}
        />
        <SummaryCard
          label="Variable expenses"
          value={plannedVariable}
          icon={CreditCard}
          color="bg-warning-20 text-warning-100 dark:bg-warning-100/10 dark:text-warning-100"
          subtext={income > 0 ? `${((plannedVariable / income) * 100).toFixed(0)}% of income` : undefined}
        />
        {recurringTotal > 0 && (
          <SummaryCard
            label="Recurring expenses"
            value={recurringTotal}
            icon={RefreshCw}
            color="bg-violet-20 text-violet-100 dark:bg-violet-100/10 dark:text-violet-100"
            subtext={income > 0 ? `${((recurringTotal / income) * 100).toFixed(0)}% of income` : undefined}
          />
        )}
        {budgetTotal > 0 && (
          <SummaryCard
            label="Budget limits"
            value={budgetTotal}
            icon={Target}
            color="bg-income-20 text-income-100 dark:bg-income-100/10 dark:text-income-100"
            subtext="Total category budgets"
          />
        )}
      </div>

      {/* Disposable income highlight */}
      <div
        className={`relative overflow-hidden rounded-montra p-5 ${
          disposableIsNegative
            ? 'bg-gradient-to-r from-expense-100 to-red-600'
            : 'bg-gradient-to-r from-income-100 to-teal-600'
        }`}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <PiggyBank size={18} className="text-white/80" />
            <p className="text-white/80 text-sm font-medium">Disposable income (after planned)</p>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(disposable)}</p>
          <p className="text-white/70 text-xs mt-1">
            {formatCurrency(income)} income − {formatCurrency(totalPlanned)} planned
            {recurringTotal > 0 && ` (incl. ${formatCurrency(recurringTotal)} recurring)`}
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          {disposableIsNegative ? (
            <TrendingDown size={120} strokeWidth={1} />
          ) : (
            <TrendingUp size={120} strokeWidth={1} />
          )}
        </div>
      </div>

      {/* Actual spending vs plan */}
      <div className="card p-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Planned vs. Actual (current month)</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Already spent this month</span>
            <span className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
              <ArrowDownRight size={14} className="text-expense-100" />
              {formatCurrency(actualSpent)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Remaining income</span>
            <span
              className={`font-bold flex items-center gap-1 ${
                isOverBudget ? 'text-expense-100' : 'text-income-100'
              }`}
            >
              <ArrowUpRight size={14} />
              {formatCurrency(remaining)}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-3 bg-surface-light dark:bg-dark-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                incomeUsedPercent > 100
                  ? 'bg-expense-100'
                  : incomeUsedPercent > 80
                  ? 'bg-warning-100'
                  : 'bg-income-100'
              }`}
              style={{ width: `${Math.min(incomeUsedPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

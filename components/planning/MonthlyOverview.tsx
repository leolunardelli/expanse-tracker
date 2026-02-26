import { TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

type MonthlyPlanSummary = {
  income: number;
  plannedFixed: number;
  plannedVariable: number;
  totalPlanned: number;
  disposable: number;
  actualSpent: number;
  remaining: number;
  incomeUsedPercent: number;
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
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 flex items-start gap-3">
      <span className={`p-2.5 rounded-xl ${color}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-xl font-bold mt-0.5 ${
          value >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-600 dark:text-red-400'
        }`}>
          {formatCurrency(Math.abs(value))}
          {value < 0 && <span className="text-sm ml-1">(negativo)</span>}
        </p>
        {subtext && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}

export default function MonthlyOverview({ summary }: { summary: MonthlyPlanSummary }) {
  const {
    income,
    plannedFixed,
    plannedVariable,
    totalPlanned,
    disposable,
    actualSpent,
    remaining,
    incomeUsedPercent,
  } = summary;

  const isOverBudget = remaining < 0;
  const disposableIsNegative = disposable < 0;

  const monthName = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 capitalize">{monthName}</h3>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            isOverBudget
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : incomeUsedPercent > 80
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}
        >
          {incomeUsedPercent.toFixed(1)}% da renda utilizada
        </span>
      </div>

      {/* Main cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <SummaryCard
          label="Renda mensal"
          value={income}
          icon={Wallet}
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <SummaryCard
          label="Despesas fixas"
          value={plannedFixed}
          icon={Receipt}
          color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          subtext={income > 0 ? `${((plannedFixed / income) * 100).toFixed(0)}% da renda` : undefined}
        />
        <SummaryCard
          label="Despesas variáveis"
          value={plannedVariable}
          icon={CreditCard}
          color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          subtext={income > 0 ? `${((plannedVariable / income) * 100).toFixed(0)}% da renda` : undefined}
        />
      </div>

      {/* Disposable income highlight */}
      <div
        className={`relative overflow-hidden rounded-xl p-5 ${
          disposableIsNegative
            ? 'bg-gradient-to-r from-red-500 to-red-600'
            : 'bg-gradient-to-r from-emerald-500 to-teal-600'
        }`}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <PiggyBank size={18} className="text-white/80" />
            <p className="text-white/80 text-sm font-medium">Renda disponível (após planejado)</p>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(disposable)}</p>
          <p className="text-white/70 text-xs mt-1">
            {formatCurrency(income)} renda − {formatCurrency(totalPlanned)} planejado
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
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Planejado vs. Real (mês atual)</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Já gasto este mês</span>
            <span className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
              <ArrowDownRight size={14} className="text-red-500" />
              {formatCurrency(actualSpent)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Restante da renda</span>
            <span
              className={`font-bold flex items-center gap-1 ${
                isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
              }`}
            >
              <ArrowUpRight size={14} />
              {formatCurrency(remaining)}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                incomeUsedPercent > 100
                  ? 'bg-red-500'
                  : incomeUsedPercent > 80
                  ? 'bg-amber-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(incomeUsedPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

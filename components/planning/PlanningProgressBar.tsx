import { formatCurrency } from '@/lib/currency';

type ProgressProps = {
  income: number;
  plannedFixed: number;
  plannedVariable: number;
  recurringTotal: number;
  actualSpent: number;
};

export default function PlanningProgressBar({ income, plannedFixed, plannedVariable, recurringTotal, actualSpent }: ProgressProps) {
  if (income <= 0) return null;

  const fixedPct = Math.min((plannedFixed / income) * 100, 100);
  const variablePct = Math.min((plannedVariable / income) * 100, 100 - fixedPct);
  const recurringPct = Math.min((recurringTotal / income) * 100, Math.max(100 - fixedPct - variablePct, 0));
  const spentPct = Math.min((actualSpent / income) * 100, 100);
  const freePct = Math.max(100 - fixedPct - variablePct - recurringPct, 0);

  return (
    <div className="card p-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Income Distribution
      </h4>

      {/* Planned allocation bar */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1.5">Planned allocation</p>
        <div className="w-full h-5 bg-surface-light dark:bg-dark-700 rounded-full overflow-hidden flex">
          {fixedPct > 0 && (
            <div
              className="h-full bg-expense-100 transition-all duration-700 flex items-center justify-center"
              style={{ width: `${fixedPct}%` }}
            >
              {fixedPct > 8 && (
                <span className="text-[10px] text-white font-medium">{fixedPct.toFixed(0)}%</span>
              )}
            </div>
          )}
          {variablePct > 0 && (
            <div
              className="h-full bg-warning-100 transition-all duration-700 flex items-center justify-center"
              style={{ width: `${variablePct}%` }}
            >
              {variablePct > 8 && (
                <span className="text-[10px] text-white font-medium">{variablePct.toFixed(0)}%</span>
              )}
            </div>
          )}
          {recurringPct > 0 && (
            <div
              className="h-full bg-violet-100 transition-all duration-700 flex items-center justify-center"
              style={{ width: `${recurringPct}%` }}
            >
              {recurringPct > 8 && (
                <span className="text-[10px] text-white font-medium">{recurringPct.toFixed(0)}%</span>
              )}
            </div>
          )}
          {freePct > 0 && (
            <div
              className="h-full bg-income-100 dark:bg-income-100 transition-all duration-700 flex items-center justify-center"
              style={{ width: `${freePct}%` }}
            >
              {freePct > 8 && (
                <span className="text-[10px] text-white font-medium">{freePct.toFixed(0)}%</span>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-expense-100 inline-block" />
            Fixed {formatCurrency(plannedFixed)}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-warning-100 inline-block" />
            Variable {formatCurrency(plannedVariable)}
          </span>
          {recurringTotal > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-100 inline-block" />
              Recurring {formatCurrency(recurringTotal)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-income-100 inline-block" />
            Free {formatCurrency(Math.max(income - plannedFixed - plannedVariable - recurringTotal, 0))}
          </span>
        </div>
      </div>

      {/* Actual spending indicator */}
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Actual spending this month</p>
        <div className="relative w-full h-3 bg-surface-light dark:bg-dark-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              spentPct > 100
                ? 'bg-expense-100'
                : spentPct > 80
                ? 'bg-warning-100'
                : 'bg-violet-100'
            }`}
            style={{ width: `${Math.min(spentPct, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{formatCurrency(actualSpent)} spent</span>
          <span>{formatCurrency(income)} income</span>
        </div>
      </div>
    </div>
  );
}

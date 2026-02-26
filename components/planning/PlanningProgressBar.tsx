import { formatCurrency } from '@/lib/currency';

type ProgressProps = {
  income: number;
  plannedFixed: number;
  plannedVariable: number;
  actualSpent: number;
};

export default function PlanningProgressBar({ income, plannedFixed, plannedVariable, actualSpent }: ProgressProps) {
  if (income <= 0) return null;

  const fixedPct = Math.min((plannedFixed / income) * 100, 100);
  const variablePct = Math.min((plannedVariable / income) * 100, 100 - fixedPct);
  const spentPct = Math.min((actualSpent / income) * 100, 100);
  const freePct = Math.max(100 - fixedPct - variablePct, 0);

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Distribuição da renda
      </h4>

      {/* Planned allocation bar */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Alocação planejada</p>
        <div className="w-full h-5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
          {fixedPct > 0 && (
            <div
              className="h-full bg-red-500 transition-all duration-700 flex items-center justify-center"
              style={{ width: `${fixedPct}%` }}
            >
              {fixedPct > 8 && (
                <span className="text-[10px] text-white font-medium">{fixedPct.toFixed(0)}%</span>
              )}
            </div>
          )}
          {variablePct > 0 && (
            <div
              className="h-full bg-amber-500 transition-all duration-700 flex items-center justify-center"
              style={{ width: `${variablePct}%` }}
            >
              {variablePct > 8 && (
                <span className="text-[10px] text-white font-medium">{variablePct.toFixed(0)}%</span>
              )}
            </div>
          )}
          {freePct > 0 && (
            <div
              className="h-full bg-green-400 dark:bg-green-600 transition-all duration-700 flex items-center justify-center"
              style={{ width: `${freePct}%` }}
            >
              {freePct > 8 && (
                <span className="text-[10px] text-white font-medium">{freePct.toFixed(0)}%</span>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            Fixas {formatCurrency(plannedFixed)}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            Variáveis {formatCurrency(plannedVariable)}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-600 inline-block" />
            Livre {formatCurrency(Math.max(income - plannedFixed - plannedVariable, 0))}
          </span>
        </div>
      </div>

      {/* Actual spending indicator */}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Gasto real este mês</p>
        <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              spentPct > 100
                ? 'bg-red-500'
                : spentPct > 80
                ? 'bg-amber-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(spentPct, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatCurrency(actualSpent)} gastos</span>
          <span>{formatCurrency(income)} renda</span>
        </div>
      </div>
    </div>
  );
}

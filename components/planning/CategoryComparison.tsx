'use client';

import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

type CategoryComparisonItem = {
  category: string;
  planned: number;
  actual: number;
  delta: number;
};

export default function CategoryComparison({ data }: { data: CategoryComparisonItem[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        No comparison data this month
      </div>
    );
  }

  return (
    <div className="card p-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Planned vs. Actual by category
      </h4>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground uppercase border-b dark:border-dark-600">
              <th className="text-left py-2 pr-2">Category</th>
              <th className="text-right py-2 px-2">Planned</th>
              <th className="text-right py-2 px-2">Actual</th>
              <th className="text-right py-2 pl-2">Difference</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const isOver = item.delta > 0;
              const isUnder = item.delta < 0;
              const pct = item.planned > 0
                ? ((item.actual / item.planned) * 100).toFixed(0)
                : item.actual > 0 ? '∞' : '0';

              return (
                <tr key={item.category} className="border-b dark:border-dark-600/50 last:border-0">
                  <td className="py-2.5 pr-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{item.category}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{pct}%</span>
                  </td>
                  <td className="text-right py-2.5 px-2 text-gray-600 dark:text-gray-400">
                    {formatCurrency(item.planned)}
                  </td>
                  <td className="text-right py-2.5 px-2 font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(item.actual)}
                  </td>
                  <td className="text-right py-2.5 pl-2">
                    <span
                      className={`inline-flex items-center gap-0.5 font-medium ${
                        isOver
                          ? 'text-expense-100'
                          : isUnder
                          ? 'text-income-100'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {isOver ? <ArrowUp size={12} /> : isUnder ? <ArrowDown size={12} /> : <Minus size={12} />}
                      {formatCurrency(Math.abs(item.delta))}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

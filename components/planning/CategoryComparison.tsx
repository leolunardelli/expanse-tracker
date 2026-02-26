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
      <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
        Sem dados de comparação este mês
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Planejado vs. Real por categoria
      </h4>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase border-b dark:border-gray-700">
              <th className="text-left py-2 pr-2">Categoria</th>
              <th className="text-right py-2 px-2">Planejado</th>
              <th className="text-right py-2 px-2">Real</th>
              <th className="text-right py-2 pl-2">Diferença</th>
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
                <tr key={item.category} className="border-b dark:border-gray-700/50 last:border-0">
                  <td className="py-2.5 pr-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{item.category}</span>
                    <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">{pct}%</span>
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
                          ? 'text-red-600 dark:text-red-400'
                          : isUnder
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400'
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

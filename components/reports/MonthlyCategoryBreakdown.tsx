'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/currency';

type CategoryItem = {
  name: string;
  amount: number;
  percentage: number;
  count: number;
};

type MonthlyCategoryBreakdownProps = {
  data: CategoryItem[];
  totalSpent: number;
};

const COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
  '#14b8a6', '#e11d48',
];

export default function MonthlyCategoryBreakdown({
  data,
  totalSpent,
}: MonthlyCategoryBreakdownProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Category Breakdown
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No category data for this month
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Category Breakdown
      </h3>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Pie Chart */}
        <div className="w-full lg:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg, #fff)',
                  border: '1px solid var(--tooltip-border, #e5e7eb)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category list */}
        <div className="w-full lg:w-1/2 space-y-3">
          {data.map((cat, index) => (
            <div key={cat.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {cat.name}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white shrink-0 ml-2">
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 w-12 text-right">
                    {cat.percentage}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {cat.count} transaction{cat.count !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

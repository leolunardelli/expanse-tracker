'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatCurrency } from '@/lib/currency';

type DailyData = {
  date: string;
  day: number;
  amount: number;
  label: string;
};

type MonthlyDailyChartProps = {
  data: DailyData[];
  avgPerDay: number;
};

export default function MonthlyDailyChart({
  data,
  avgPerDay,
}: MonthlyDailyChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daily Spending
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No daily data for this month
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Daily Spending
        </h3>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500" />
            Daily total
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-6 h-0.5 bg-red-400 inline-block" style={{ borderTop: '2px dashed' }} />
            Avg ({formatCurrency(avgPerDay)}/day)
          </span>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--grid-stroke, #e5e7eb)"
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: 'var(--axis-text, #9ca3af)' }}
              tickLine={false}
              axisLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--axis-text, #9ca3af)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
              width={50}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), 'Spent']}
              labelFormatter={(label) => {
                const item = data.find((d) => d.day === label);
                return item?.label || `Day ${label}`;
              }}
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, #fff)',
                border: '1px solid var(--tooltip-border, #e5e7eb)',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            />
            <ReferenceLine
              y={avgPerDay}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={1.5}
            />
            <Bar
              dataKey="amount"
              fill="#3b82f6"
              radius={[3, 3, 0, 0]}
              maxBarSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

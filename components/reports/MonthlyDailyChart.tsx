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
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Daily Spending
        </h3>
        <p className="text-muted-foreground text-center py-8">
          No daily data for this month
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Daily Spending
        </h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-violet-100" />
            Daily total
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-6 h-0.5 bg-expense-100 inline-block" style={{ borderTop: '2px dashed' }} />
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
              className="stroke-gray-200 dark:stroke-dark-600"
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#91919F' }}
              tickLine={false}
              axisLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#91919F' }}
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
                backgroundColor: '#212325',
                border: '1px solid #333338',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '13px',
              }}
            />
            <ReferenceLine
              y={avgPerDay}
              stroke="#FD3C4A"
              strokeDasharray="5 5"
              strokeWidth={1.5}
            />
            <Bar
              dataKey="amount"
              fill="#0D7390"
              radius={[6, 6, 0, 0]}
              maxBarSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

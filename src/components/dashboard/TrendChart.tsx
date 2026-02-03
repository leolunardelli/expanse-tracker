import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Expense } from '../../types/index';
import { formatCurrency } from '../../utils/stats';

interface TrendChartProps {
  expenses: Expense[];
}

// Custom tooltip component
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-800 p-3 rounded-xl shadow-lg border border-dark-200 dark:border-dark-700">
        <p className="text-sm font-medium text-dark-600 dark:text-dark-300">{label}</p>
        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

export default function TrendChart({ expenses }: TrendChartProps) {
  // Group expenses by day for the last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyData: Record<string, number> = {};
  
  // Initialize all days with 0
  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    const key = date.toISOString().split('T')[0];
    dailyData[key] = 0;
  }

  // Sum expenses by date
  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.date);
    if (expenseDate >= thirtyDaysAgo && expenseDate <= today) {
      const key = expense.date;
      if (dailyData[key] !== undefined) {
        dailyData[key] += expense.amount;
      }
    }
  });

  // Convert to array for chart
  const chartData = Object.entries(dailyData)
    .map(([date, amount]) => ({
      date,
      amount: Math.round(amount * 100) / 100,
      displayDate: new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // If no data, show empty state
  if (expenses.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-display font-semibold text-dark-900 dark:text-white mb-4">
          Spending Trend
        </h3>
        <div className="flex items-center justify-center h-[300px] bg-dark-50 dark:bg-dark-800/50 rounded-xl border-2 border-dashed border-dark-200 dark:border-dark-700">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-dark-100 dark:bg-dark-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-dark-500 dark:text-dark-400 text-sm">
              Add expenses to see your spending trend
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold text-dark-900 dark:text-white">
          Spending Trend
        </h3>
        <span className="text-sm text-dark-500 dark:text-dark-400">Last 30 days</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="displayDate"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickMargin={10}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickMargin={10}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#6366f1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAmount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

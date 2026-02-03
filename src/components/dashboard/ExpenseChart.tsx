import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Expense, Category } from '../../types/index';
import {
  calculateExpenseStats,
  getCategoryColor,
  getCategoryLabel,
  formatCurrency,
} from '../../utils/stats';

interface ExpenseChartProps {
  expenses: Expense[];
}

// Custom tooltip component
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { percentage: number };
  }>;
}) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-lg border border-dark-200 dark:border-dark-700">
        <p className="font-semibold text-dark-900 dark:text-white">{data.name}</p>
        <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-1">
          {formatCurrency(data.value)}
        </p>
        <p className="text-dark-500 dark:text-dark-400 text-sm mt-1">
          {data.payload.percentage.toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
}

// Custom legend
function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  if (!payload) return null;
  
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-dark-600 dark:text-dark-300">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  const stats = calculateExpenseStats(expenses);

  // Prepare data for pie chart
  const chartData = (
    Object.entries(stats.byCategory) as [Category, number][]
  )
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: getCategoryLabel(category),
      value: Math.round(amount * 100) / 100,
      category,
      percentage: stats.total > 0 ? (amount / stats.total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-display font-semibold text-dark-900 dark:text-white mb-4">
          Spending Distribution
        </h3>
        <div className="flex items-center justify-center h-[300px] bg-dark-50 dark:bg-dark-800/50 rounded-xl border-2 border-dashed border-dark-200 dark:border-dark-700">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-dark-100 dark:bg-dark-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <p className="text-dark-500 dark:text-dark-400 text-sm">
              Add expenses to see the distribution
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-display font-semibold text-dark-900 dark:text-white mb-4">
        Spending Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.category}`}
                fill={getCategoryColor(entry.category)}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

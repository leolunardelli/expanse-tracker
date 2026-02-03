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

// Custom tooltip component (defined outside to avoid re-creation)
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
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-300">
        <p className="font-semibold text-gray-900">{data.name}</p>
        <p className="text-blue-600 font-bold">
          {formatCurrency(data.value)}
        </p>
        <p className="text-gray-600 text-sm">
          {data.payload.percentage.toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
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
      value: Math.round(amount * 100) / 100, // Round to 2 decimals
      category,
      percentage: stats.total > 0 ? (amount / stats.total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-center">
          No data yet. Add expenses to see the chart!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Spending Distribution
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => {
              const entry = chartData.find((d) => d.value === value);
              return entry ? `${name}: ${entry.percentage.toFixed(0)}%` : '';
            }}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.category}`}
                fill={getCategoryColor(entry.category)}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend with values */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {chartData.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getCategoryColor(item.category) }}
              />
              <span className="text-sm font-medium text-gray-700">
                {item.name}
              </span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatCurrency(item.value)}
              </p>
              <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

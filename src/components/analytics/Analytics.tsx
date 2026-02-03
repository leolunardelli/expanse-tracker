import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Expense, Category } from '../../types/index';
import { formatCurrency, getCategoryLabel, getCategoryColor, calculateExpenseStats } from '../../utils/stats';

interface AnalyticsProps {
  expenses: Expense[];
}

// Custom tooltip
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-lg border border-dark-200 dark:border-dark-700">
        <p className="text-sm font-semibold text-dark-900 dark:text-white mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm" style={{ color: p.color }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function Analytics({ expenses }: AnalyticsProps) {
  const stats = calculateExpenseStats(expenses);

  // Get monthly data
  const getMonthlyData = () => {
    const monthlyData: Record<string, Record<string, number>> = {};
    
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          food: 0,
          transport: 0,
          entertainment: 0,
          utilities: 0,
          shopping: 0,
          health: 0,
          other: 0,
        };
      }
      
      monthlyData[monthKey][expense.category] += expense.amount;
    });

    return Object.entries(monthlyData)
      .map(([month, categories]) => ({
        month,
        ...categories,
      }))
      .slice(-6); // Last 6 months
  };

  const monthlyData = getMonthlyData();

  // Calculate insights
  const getInsights = () => {
    if (expenses.length === 0) return [];

    const insights = [];

    // Most expensive day
    const dayTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      const day = new Date(e.date).toLocaleDateString('en-US', { weekday: 'long' });
      dayTotals[day] = (dayTotals[day] || 0) + e.amount;
    });
    const mostExpensiveDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0];
    if (mostExpensiveDay) {
      insights.push({
        icon: '📅',
        title: 'Most Expensive Day',
        value: mostExpensiveDay[0],
        detail: formatCurrency(mostExpensiveDay[1]),
      });
    }

    // Largest single expense
    const largest = expenses.reduce((max, e) => (e.amount > max.amount ? e : max), expenses[0]);
    insights.push({
      icon: '💸',
      title: 'Largest Expense',
      value: largest.description,
      detail: formatCurrency(largest.amount),
    });

    // Average per day
    const days = new Set(expenses.map((e) => e.date)).size;
    const avgPerDay = stats.total / (days || 1);
    insights.push({
      icon: '📊',
      title: 'Daily Average',
      value: formatCurrency(avgPerDay),
      detail: `Based on ${days} days`,
    });

    // Most frequent category
    const maxCategory = Object.entries(stats.categoryCount).sort((a, b) => b[1] - a[1])[0];
    if (maxCategory) {
      insights.push({
        icon: '🏷️',
        title: 'Most Frequent',
        value: getCategoryLabel(maxCategory[0] as Category),
        detail: `${maxCategory[1]} expenses`,
      });
    }

    return insights;
  };

  const insights = getInsights();

  // Category colors for chart
  const categoryColors: Record<string, string> = {
    food: '#10b981',
    transport: '#3b82f6',
    entertainment: '#8b5cf6',
    utilities: '#f59e0b',
    shopping: '#ec4899',
    health: '#ef4444',
    other: '#6b7280',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">
          Analytics
        </h2>
        <p className="text-dark-500 dark:text-dark-400 mt-1">
          Deep insights into your spending patterns
        </p>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <div
            key={insight.title}
            className="glass-card-solid p-5 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{insight.icon}</span>
              <div>
                <p className="text-sm text-dark-500 dark:text-dark-400">{insight.title}</p>
                <p className="text-lg font-bold text-dark-900 dark:text-white truncate">
                  {insight.value}
                </p>
                <p className="text-xs text-dark-400 dark:text-dark-500">{insight.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Comparison Chart */}
      <div className="glass-card-solid p-6">
        <h3 className="text-lg font-display font-semibold text-dark-900 dark:text-white mb-4">
          Monthly Category Breakdown
        </h3>
        
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => getCategoryLabel(value as Category)}
              />
              {Object.keys(categoryColors).map((category) => (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId="a"
                  fill={categoryColors[category]}
                  radius={[0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[350px] bg-dark-50 dark:bg-dark-800/50 rounded-xl border-2 border-dashed border-dark-200 dark:border-dark-700">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-dark-100 dark:bg-dark-700 flex items-center justify-center">
                <svg className="w-6 h-6 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-dark-500 dark:text-dark-400 text-sm">
                Add expenses to see monthly breakdown
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Category Details */}
      <div className="glass-card-solid p-6">
        <h3 className="text-lg font-display font-semibold text-dark-900 dark:text-white mb-4">
          Category Statistics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(stats.byCategory) as Category[]).map((category) => {
            const amount = stats.byCategory[category];
            const count = stats.categoryCount[category];
            const percentage = stats.total > 0 ? (amount / stats.total) * 100 : 0;

            return (
              <div
                key={category}
                className={`p-4 rounded-xl border-2 transition-all ${
                  amount > 0
                    ? 'border-dark-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600'
                    : 'border-dark-100 dark:border-dark-800 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getCategoryColor(category) }}
                  />
                  <span className="font-medium text-dark-900 dark:text-white">
                    {getCategoryLabel(category)}
                  </span>
                </div>
                <p className="text-2xl font-bold text-dark-900 dark:text-white">
                  {formatCurrency(amount)}
                </p>
                <div className="flex items-center justify-between mt-2 text-sm text-dark-500 dark:text-dark-400">
                  <span>{count} expenses</span>
                  <span>{percentage.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spending Tips */}
      <div className="glass-card-solid p-6 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-200 dark:border-primary-800">
        <h3 className="text-lg font-display font-semibold text-dark-900 dark:text-white mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Smart Tip
        </h3>
        <p className="text-dark-600 dark:text-dark-300">
          {stats.highestCategory
            ? `Your highest spending category is ${getCategoryLabel(stats.highestCategory.category)}. Consider setting a budget limit for this category to better manage your expenses.`
            : 'Start tracking your expenses to get personalized insights and tips!'}
        </p>
      </div>
    </div>
  );
}

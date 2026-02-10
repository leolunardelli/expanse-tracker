'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

type MonthlyData = {
  month: string;
  amount: number;
}

export default function MonthlyBarChart({ data }: { data: MonthlyData[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800/50 p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Spending</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800/50 p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Spending</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: isDark ? '#9ca3af' : '#6B7280', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: isDark ? '#9ca3af' : '#6B7280', fontSize: 12 }}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Spent']}
            contentStyle={{ 
              backgroundColor: isDark ? '#1f2937' : '#fff', 
              border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
              borderRadius: '8px',
              color: isDark ? '#f3f4f6' : '#111827',
            }}
          />
          <Bar 
            dataKey="amount" 
            fill="#3B82F6" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

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
      <div className="card p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Monthly Spending</h3>
        <p className="text-muted-foreground text-center py-8 text-sm">No data yet</p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Monthly Spending</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333338' : '#E0E0E0'} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: isDark ? '#91919F' : '#91919F', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: isDark ? '#91919F' : '#91919F', fontSize: 12 }}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Spent']}
            contentStyle={{ 
              backgroundColor: isDark ? '#212325' : '#fff', 
              border: `1px solid ${isDark ? '#333338' : '#E0E0E0'}`,
              borderRadius: '12px',
              color: isDark ? '#fff' : '#212325',
            }}
          />
          <Bar 
            dataKey="amount" 
            fill="#7F3DFF" 
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

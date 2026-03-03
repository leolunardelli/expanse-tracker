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
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-14 h-14 rounded-full bg-violet-20 dark:bg-violet-100/10 flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-violet-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">No monthly data yet</p>
          <p className="text-xs text-muted-foreground mt-1">Start tracking to see monthly trends</p>
        </div>
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
            fill="#0099CC" 
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

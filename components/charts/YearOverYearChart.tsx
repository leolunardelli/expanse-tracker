'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

type YoYData = {
  month: string;
  current: number;
  previous: number;
};

export default function YearOverYearChart({ data, currentYear, previousYear }: { 
  data: YoYData[]; 
  currentYear: number;
  previousYear: number;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800/50 p-6">
      <h3 className="text-lg font-bold mb-4">Year-over-Year Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
          <XAxis dataKey="month" tick={{ fill: isDark ? '#9ca3af' : '#6B7280' }} />
          <YAxis tick={{ fill: isDark ? '#9ca3af' : '#6B7280' }} />
          <Tooltip 
            formatter={(value: number | undefined) => value ? `$${value.toFixed(2)}` : '-'}
            labelFormatter={(label) => `Month: ${label}`}
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
              borderRadius: '8px',
              color: isDark ? '#f3f4f6' : '#111827',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="current" 
            stroke="#3b82f6" 
            name={`${currentYear}`}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="previous" 
            stroke="#10b981" 
            name={`${previousYear}`}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

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
    <div className="card p-5">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Year-over-Year Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333338' : '#E0E0E0'} />
          <XAxis dataKey="month" tick={{ fill: '#91919F' }} />
          <YAxis tick={{ fill: '#91919F' }} />
          <Tooltip 
            formatter={(value: number | undefined) => value ? `$${value.toFixed(2)}` : '-'}
            labelFormatter={(label) => `Month: ${label}`}
            contentStyle={{
              backgroundColor: isDark ? '#212325' : '#fff',
              border: `1px solid ${isDark ? '#333338' : '#E0E0E0'}`,
              borderRadius: '12px',
              color: isDark ? '#fff' : '#212325',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="current" 
            stroke="#0099CC" 
            name={`${currentYear}`}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="previous" 
            stroke="#00A86B" 
            name={`${previousYear}`}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

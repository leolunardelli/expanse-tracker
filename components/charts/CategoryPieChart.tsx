'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from 'next-themes';

type CategoryData = {
  name: string;
  value: number;
}

const COLORS = [
  '#7F3DFF', // violet
  '#00A86B', // green
  '#FD3C4A', // red
  '#FCAC12', // yellow
  '#0077FF', // blue
  '#B18AFF', // violet-60
  '#65D1A3', // green-60
  '#FD6F7A', // red-60
];

export default function CategoryPieChart({ data }: { data: CategoryData[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  if (data.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-14 h-14 rounded-full bg-violet-20 dark:bg-violet-100/10 flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-violet-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">No spending data yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add expenses to see your category breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
            contentStyle={{
              backgroundColor: isDark ? '#212325' : '#fff',
              border: `1px solid ${isDark ? '#333338' : '#E0E0E0'}`,
              borderRadius: '12px',
              color: isDark ? '#fff' : '#212325',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

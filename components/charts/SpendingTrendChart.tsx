'use client';

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useTheme } from 'next-themes';

type TrendData = {
  date: string;
  amount: number;
}

export default function SpendingTrendChart({ data }: { data: TrendData[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  if (data.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Spending Trend (Last 30 Days)</h3>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-14 h-14 rounded-full bg-violet-20 dark:bg-violet-100/10 flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-violet-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">No trend data yet</p>
          <p className="text-xs text-muted-foreground mt-1">Trends appear after a few days of tracking</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Spending Trend (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7F3DFF" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#7F3DFF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333338' : '#E0E0E0'} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: isDark ? '#91919F' : '#91919F', fontSize: 10 }}
            tickLine={false}
            interval="preserveStartEnd"
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
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#7F3DFF" 
            strokeWidth={2}
            fill="url(#colorAmount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

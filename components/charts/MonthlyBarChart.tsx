'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type MonthlyData = {
  month: string;
  amount: number;
}

export default function MonthlyBarChart({ data }: { data: MonthlyData[] }) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Spending</h3>
        <p className="text-gray-500 text-center py-8">No data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Spending</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Spent']}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
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

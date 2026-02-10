'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">Year-over-Year Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            formatter={(value: number | undefined) => value ? `$${value.toFixed(2)}` : '-'}
            labelFormatter={(label) => `Month: ${label}`}
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

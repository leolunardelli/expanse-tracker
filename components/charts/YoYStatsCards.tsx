'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

type YoYStats = {
  currentYearTotal: number;
  previousYearTotal: number;
  difference: number;
  percentChange: number;
  currentAverage: number;
  previousAverage: number;
  currentYear: number;
  previousYear: number;
};

export default function YoYStatsCards({ stats }: { stats: YoYStats }) {
  const isPositive = stats.difference > 0;
  const changeColor = isPositive ? 'text-red-600' : 'text-green-600';
  const bgColor = isPositive ? 'bg-red-50' : 'bg-green-50';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
        <p className="text-gray-600 text-sm font-medium">Total Annual Spending</p>
        <div className="mt-2">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm text-gray-500">{stats.currentYear}</span>
            <span className="text-2xl font-bold text-blue-600">${stats.currentYearTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-sm text-gray-500">{stats.previousYear}</span>
            <span className="text-lg text-gray-600">${stats.previousYearTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={`rounded-lg shadow p-4 border-l-4 ${bgColor} ${isPositive ? 'border-red-500' : 'border-green-500'}`}>
        <p className="text-gray-600 text-sm font-medium">Year-over-Year Change</p>
        <div className="mt-2 flex items-center gap-3">
          {isPositive ? (
            <TrendingUp className="text-red-600" size={24} />
          ) : (
            <TrendingDown className="text-green-600" size={24} />
          )}
          <div>
            <p className={`text-2xl font-bold ${changeColor}`}>
              {isPositive ? '+' : ''}{stats.difference.toFixed(2)}
            </p>
            <p className={`text-sm ${changeColor}`}>
              {stats.percentChange > 0 ? '+' : ''}{stats.percentChange.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
        <p className="text-gray-600 text-sm font-medium">Monthly Average</p>
        <div className="mt-2">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm text-gray-500">{stats.currentYear}</span>
            <span className="text-2xl font-bold text-purple-600">${stats.currentAverage.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-sm text-gray-500">{stats.previousYear}</span>
            <span className="text-lg text-gray-600">${stats.previousAverage.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

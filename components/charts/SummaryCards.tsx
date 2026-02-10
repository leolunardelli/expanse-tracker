'use client';

import { TrendingUp, TrendingDown, DollarSign, Calendar, Hash } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

type SummaryData = {
  totalExpenses: number;
  totalSpent: number;
  currentMonthTotal: number;
  lastMonthTotal: number;
  monthlyChange: number;
  avgPerDay: number;
}

export default function SummaryCards({ data }: { data: SummaryData }) {
  const isPositiveChange = data.monthlyChange > 0;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <DollarSign size={18} />
          <span className="text-sm">Total Spent</span>
        </div>
        <p className="text-2xl font-bold">{formatCurrency(data.totalSpent)}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <Hash size={18} />
          <span className="text-sm">Transactions</span>
        </div>
        <p className="text-2xl font-bold">{data.totalExpenses}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <Calendar size={18} />
          <span className="text-sm">This Month</span>
        </div>
        <p className="text-2xl font-bold">{formatCurrency(data.currentMonthTotal)}</p>
        <div className={`flex items-center gap-1 text-sm mt-1 ${isPositiveChange ? 'text-red-500' : 'text-green-500'}`}>
          {isPositiveChange ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(data.monthlyChange)}% vs last month</span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <TrendingUp size={18} />
          <span className="text-sm">Avg/Day</span>
        </div>
        <p className="text-2xl font-bold">{formatCurrency(data.avgPerDay)}</p>
        <p className="text-sm text-gray-500 mt-1">this month</p>
      </div>
    </div>
  );
}

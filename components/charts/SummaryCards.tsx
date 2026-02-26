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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="card p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <DollarSign size={16} />
          <span className="text-xs font-medium">Total Spent</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(data.totalSpent)}</p>
      </div>
      
      <div className="card p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Hash size={16} />
          <span className="text-xs font-medium">Transactions</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.totalExpenses}</p>
      </div>
      
      <div className="card p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Calendar size={16} />
          <span className="text-xs font-medium">This Month</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(data.currentMonthTotal)}</p>
        <div className={`flex items-center gap-1 text-xs mt-1 ${isPositiveChange ? 'text-expense-100' : 'text-income-100'}`}>
          {isPositiveChange ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(data.monthlyChange)}% vs last month</span>
        </div>
      </div>
      
      <div className="card p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <TrendingUp size={16} />
          <span className="text-xs font-medium">Avg/Day</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(data.avgPerDay)}</p>
        <p className="text-xs text-muted-foreground mt-1">this month</p>
      </div>
    </div>
  );
}

import type { Expense } from '../../types/index';
import {
  calculateExpenseStats,
  formatCurrency,
  getCategoryLabel,
} from '../../utils/stats';
import ExpenseChart from './ExpenseChart';
import TrendChart from './TrendChart';

interface DashboardProps {
  expenses: Expense[];
}

export default function Dashboard({ expenses }: DashboardProps) {
  const stats = calculateExpenseStats(expenses);

  const statCards = [
    {
      title: 'Total Expenses',
      value: formatCurrency(stats.total),
      subtitle: `${stats.count} transactions`,
      gradient: 'from-primary-600 to-primary-400',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Average Expense',
      value: formatCurrency(stats.average),
      subtitle: 'Per transaction',
      gradient: 'from-accent-600 to-accent-400',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Top Category',
      value: stats.highestCategory ? getCategoryLabel(stats.highestCategory.category) : 'N/A',
      subtitle: stats.highestCategory ? formatCurrency(stats.highestCategory.amount) : 'No data',
      gradient: 'from-purple-600 to-purple-400',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'This Month',
      value: formatCurrency(stats.total),
      subtitle: 'Total spending',
      gradient: 'from-amber-500 to-orange-400',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={card.title}
            className={`stat-card bg-gradient-to-br ${card.gradient} text-white animate-slide-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                {card.icon}
              </div>
              <div className="p-1.5 bg-white/20 rounded-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">{card.title}</p>
            <p className="text-2xl lg:text-3xl font-bold tracking-tight">{card.value}</p>
            <p className="text-white/70 text-sm mt-2">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Distribution */}
        <div className="glass-card-solid p-6">
          <ExpenseChart expenses={expenses} />
        </div>

        {/* Spending Trend */}
        <div className="glass-card-solid p-6">
          <TrendChart expenses={expenses} />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass-card-solid p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-display font-semibold text-dark-900 dark:text-white">
            Category Breakdown
          </h3>
          <span className="text-sm text-dark-500 dark:text-dark-400">
            {Object.values(stats.byCategory).filter(v => v > 0).length} active categories
          </span>
        </div>
        
        <div className="space-y-4">
          {(
            Object.entries(stats.byCategory) as [
              keyof typeof stats.byCategory,
              number,
            ][]
          )
            .filter(([, amount]) => amount > 0)
            .sort(([, amountA], [, amountB]) => amountB - amountA)
            .map(([category, amount]) => {
              const percentage = stats.total > 0 ? (amount / stats.total) * 100 : 0;
              const count = stats.categoryCount[category];
              const colorMap: Record<string, string> = {
                food: 'bg-emerald-500',
                transport: 'bg-blue-500',
                entertainment: 'bg-purple-500',
                utilities: 'bg-amber-500',
                shopping: 'bg-pink-500',
                health: 'bg-red-500',
                other: 'bg-gray-500',
              };

              return (
                <div key={String(category)} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colorMap[category] || 'bg-gray-500'}`} />
                      <span className="text-sm font-medium text-dark-700 dark:text-dark-200">
                        {getCategoryLabel(category as never)}
                      </span>
                      <span className="text-xs text-dark-400 dark:text-dark-500">
                        {count} {count === 1 ? 'expense' : 'expenses'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-dark-900 dark:text-white">
                        {formatCurrency(amount)}
                      </span>
                      <span className="text-xs text-dark-500 dark:text-dark-400 w-12 text-right">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-dark-100 dark:bg-dark-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ease-out ${colorMap[category] || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          {Object.values(stats.byCategory).every((amount) => amount === 0) && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-100 dark:bg-dark-700 flex items-center justify-center">
                <svg className="w-8 h-8 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-dark-500 dark:text-dark-400">
                No expenses yet. Add one to see the breakdown!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

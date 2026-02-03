import type { Expense, Category } from '../types/index';

export interface ExpenseStats {
  total: number;
  count: number;
  average: number;
  byCategory: Record<Category, number>;
  categoryCount: Record<Category, number>;
  highestCategory: { category: Category; amount: number } | null;
}

export function calculateExpenseStats(expenses: Expense[]): ExpenseStats {
  const stats: ExpenseStats = {
    total: 0,
    count: expenses.length,
    average: 0,
    byCategory: {
      food: 0,
      transport: 0,
      entertainment: 0,
      utilities: 0,
      shopping: 0,
      health: 0,
      other: 0,
    },
    categoryCount: {
      food: 0,
      transport: 0,
      entertainment: 0,
      utilities: 0,
      shopping: 0,
      health: 0,
      other: 0,
    },
    highestCategory: null,
  };

  if (expenses.length === 0) {
    return stats;
  }

  // Calculate totals and by-category breakdown
  expenses.forEach((expense) => {
    stats.total += expense.amount;
    stats.byCategory[expense.category] += expense.amount;
    stats.categoryCount[expense.category] += 1;
  });

  // Calculate average
  stats.average = stats.total / expenses.length;

  // Find highest spending category
  let highestAmount = 0;
  let highestCat: Category | null = null;

  (Object.keys(stats.byCategory) as Category[]).forEach((category) => {
    if (stats.byCategory[category] > highestAmount) {
      highestAmount = stats.byCategory[category];
      highestCat = category;
    }
  });

  if (highestCat) {
    stats.highestCategory = {
      category: highestCat,
      amount: highestAmount,
    };
  }

  return stats;
}

/**
 * Format currency with proper symbol and decimals
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get display name for category
 */
export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    food: 'Food & Dining',
    transport: 'Transportation',
    entertainment: 'Entertainment',
    utilities: 'Utilities',
    shopping: 'Shopping',
    health: 'Health & Medical',
    other: 'Other',
  };
  return labels[category];
}

/**
 * Get color for category (for charts)
 */
export function getCategoryColor(category: Category): string {
  const colors: Record<Category, string> = {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    entertainment: '#FFE66D',
    utilities: '#95E1D3',
    shopping: '#F38181',
    health: '#AA96DA',
    other: '#FCBAD3',
  };
  return colors[category];
}

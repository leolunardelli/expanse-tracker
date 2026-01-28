// Core data types
export type Category = 
  | 'food' 
  | 'transport' 
  | 'entertainment' 
  | 'utilities' 
  | 'shopping' 
  | 'health' 
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO format: "2026-01-28"
  createdAt: string; // ISO format timestamp
}

// UI state types
export interface FilterState {
  category: Category | 'all';
  dateRange: 'week' | 'month' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface ExpenseState {
  expenses: Expense[];
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
}
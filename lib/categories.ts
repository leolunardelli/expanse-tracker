import { CATEGORIES, getCategoryConfig, type CategoryKey } from './design-tokens';

// Expense categories for forms (value + label)
export const EXPENSE_CATEGORIES = CATEGORIES.map((key) => ({
  value: key,
  label: getCategoryConfig(key).label,
}));

// Budget categories include "all" for total budget
export const BUDGET_CATEGORIES = [
  { value: 'all', label: 'Total Budget' },
  ...CATEGORIES.map((key) => ({
    value: key.toLowerCase(),
    label: getCategoryConfig(key).label,
  })),
];

// Categories for AI categorization prompt
export const AI_CATEGORY_LIST = CATEGORIES.join(', ');

export { CATEGORIES, getCategoryConfig, type CategoryKey };

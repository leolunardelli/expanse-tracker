import { CATEGORIES, getCategoryConfig } from './design-tokens';

// Expense categories for forms (value + label)
export const EXPENSE_CATEGORIES: { value: string; label: string }[] = CATEGORIES.map((key) => ({
  value: key,
  label: getCategoryConfig(key).label,
}));

// Budget categories include "all" for total budget
export const BUDGET_CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'Total Budget' },
  ...CATEGORIES.map((key) => ({
    value: key,
    label: getCategoryConfig(key).label,
  })),
];

// Categories for AI categorization prompt
export const AI_CATEGORY_LIST = CATEGORIES.join(', ');

// Merge built-in categories with user's custom categories
export function mergeExpenseCategories(
  customCategories: { name: string; color: string; icon: string }[]
) {
  const base = EXPENSE_CATEGORIES.map((c) => ({ ...c }));
  for (const cc of customCategories) {
    if (!base.some((b) => b.value.toLowerCase() === cc.name.toLowerCase())) {
      base.push({ value: cc.name, label: cc.name });
    }
  }
  return base;
}

export function mergeBudgetCategories(
  customCategories: { name: string; color: string; icon: string }[]
) {
  const base = BUDGET_CATEGORIES.map((c) => ({ ...c }));
  for (const cc of customCategories) {
    if (!base.some((b) => b.value.toLowerCase() === cc.name.toLowerCase())) {
      base.push({ value: cc.name, label: cc.name });
    }
  }
  return base;
}

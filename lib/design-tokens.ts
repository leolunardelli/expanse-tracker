// Montra-inspired Design Tokens
// Based on the Montra Expense Tracker UI Kit

// Category icon mapping with Montra-style colors
export const categoryConfig = {
  Food: {
    label: 'Food',
    color: '#FD3C4A',
    bgColor: '#FDD5D7',
    darkBgColor: '#4A1F22',
    icon: 'UtensilsCrossed',
  },
  Transport: {
    label: 'Transport',
    color: '#0077FF',
    bgColor: '#BDDCFF',
    darkBgColor: '#1A3352',
    icon: 'Car',
  },
  Entertainment: {
    label: 'Entertainment',
    color: '#7F3DFF',
    bgColor: '#EEE5FF',
    darkBgColor: '#2D1F4A',
    icon: 'Gamepad2',
  },
  Shopping: {
    label: 'Shopping',
    color: '#FCAC12',
    bgColor: '#FCEED4',
    darkBgColor: '#4A3A1A',
    icon: 'ShoppingBag',
  },
  Bills: {
    label: 'Bills',
    color: '#00A86B',
    bgColor: '#CFFAEA',
    darkBgColor: '#1A4A33',
    icon: 'Receipt',
  },
  Health: {
    label: 'Health',
    color: '#FD3C4A',
    bgColor: '#FDD5D7',
    darkBgColor: '#4A1F22',
    icon: 'Heart',
  },
  Education: {
    label: 'Education',
    color: '#0077FF',
    bgColor: '#BDDCFF',
    darkBgColor: '#1A3352',
    icon: 'GraduationCap',
  },
  Housing: {
    label: 'Housing',
    color: '#7F3DFF',
    bgColor: '#EEE5FF',
    darkBgColor: '#2D1F4A',
    icon: 'Home',
  },
  Subscription: {
    label: 'Subscription',
    color: '#FCAC12',
    bgColor: '#FCEED4',
    darkBgColor: '#4A3A1A',
    icon: 'CreditCard',
  },
  Other: {
    label: 'Other',
    color: '#91919F',
    bgColor: '#E0E0E0',
    darkBgColor: '#333338',
    icon: 'MoreHorizontal',
  },
} as const;

export type CategoryKey = keyof typeof categoryConfig;

export const CATEGORIES = Object.keys(categoryConfig) as CategoryKey[];

export function getCategoryConfig(category: string) {
  return categoryConfig[category as CategoryKey] || categoryConfig.Other;
}

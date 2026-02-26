// Montra-inspired Design Tokens
// Based on the Montra Expense Tracker UI Kit

export const colors = {
  // Primary - Violet
  violet: {
    DEFAULT: '#7F3DFF',
    20: '#EEE5FF',
    40: '#D3BDFF',
    60: '#B18AFF',
    80: '#8F57FF',
    100: '#7F3DFF',
  },
  // Income - Green
  green: {
    DEFAULT: '#00A86B',
    20: '#CFFAEA',
    40: '#93F0C8',
    60: '#65D1A3',
    80: '#2AB784',
    100: '#00A86B',
  },
  // Expense - Red
  red: {
    DEFAULT: '#FD3C4A',
    20: '#FDD5D7',
    40: '#FDA2A9',
    60: '#FD6F7A',
    80: '#FD5662',
    100: '#FD3C4A',
  },
  // Warning - Yellow
  yellow: {
    DEFAULT: '#FCAC12',
    20: '#FCEED4',
    40: '#FCDDA1',
    60: '#FCCC6F',
    80: '#FCBB3C',
    100: '#FCAC12',
  },
  // Info - Blue
  blue: {
    DEFAULT: '#0077FF',
    20: '#BDDCFF',
    40: '#8AC0FF',
    60: '#57A5FF',
    80: '#248AFF',
    100: '#0077FF',
  },
  // Backgrounds
  light: {
    base: '#F6F6F6',
    surface: '#FFFFFF',
    border: '#E0E0E0',
    text: '#212325',
    textSecondary: '#91919F',
    textMuted: '#C6C6C6',
  },
  dark: {
    base: '#161719',
    surface: '#212325',
    border: '#333338',
    text: '#FFFFFF',
    textSecondary: '#91919F',
    textMuted: '#5A5A66',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  },
  fontSize: {
    'title-x': ['64px', { lineHeight: '80px', fontWeight: '700' }],
    'title-1': ['32px', { lineHeight: '39px', fontWeight: '700' }],
    'title-2': ['24px', { lineHeight: '29px', fontWeight: '600' }],
    'title-3': ['18px', { lineHeight: '22px', fontWeight: '600' }],
    'body-1': ['16px', { lineHeight: '19px', fontWeight: '500' }],
    'body-2': ['16px', { lineHeight: '19px', fontWeight: '600' }],
    'body-3': ['14px', { lineHeight: '18px', fontWeight: '500' }],
    small: ['13px', { lineHeight: '16px', fontWeight: '500' }],
    tiny: ['12px', { lineHeight: '12px', fontWeight: '500' }],
  },
} as const;

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

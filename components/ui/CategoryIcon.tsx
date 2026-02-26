import {
  UtensilsCrossed, Car, Gamepad2, ShoppingBag, Receipt,
  Heart, GraduationCap, Home, CreditCard, MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';
import { getCategoryConfig } from '@/lib/design-tokens';

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  Gamepad2,
  ShoppingBag,
  Receipt,
  Heart,
  GraduationCap,
  Home,
  CreditCard,
  MoreHorizontal,
};

interface CategoryIconProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeMap = {
  sm: { icon: 14, wrapper: 'w-8 h-8' },
  md: { icon: 18, wrapper: 'w-10 h-10' },
  lg: { icon: 24, wrapper: 'w-12 h-12' },
};

export default function CategoryIcon({ category, size = 'md', showLabel = false }: CategoryIconProps) {
  const config = getCategoryConfig(category);
  const Icon = iconMap[config.icon] || MoreHorizontal;
  const s = sizeMap[size];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${s.wrapper} rounded-montra-sm flex items-center justify-center`}
        style={{ backgroundColor: config.bgColor, color: config.color }}
      >
        <Icon size={s.icon} />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-dark-900 dark:text-white">
          {config.label}
        </span>
      )}
    </div>
  );
}

// Hook-like accessor for dark mode category backgrounds
export function useCategoryStyle(category: string) {
  const config = getCategoryConfig(category);
  return {
    color: config.color,
    bgColor: config.bgColor,
    darkBgColor: config.darkBgColor,
    label: config.label,
  };
}

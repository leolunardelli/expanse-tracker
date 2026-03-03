'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAnimatedNumber } from '@/lib/useAnimatedNumber';

interface StatsCardProps {
  title: string;
  value: string | number;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, className, trend, trendValue, icon }: StatsCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-expense-100' : trend === 'down' ? 'text-income-100' : 'text-muted-foreground';

  // Animate numeric values
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^\d.-]/g, ''));
  const animatedNum = useAnimatedNumber(Number.isFinite(numericValue) ? numericValue : 0);

  // If the value was originally a formatted currency string, rebuild it with animated number
  let displayValue: string | number = value;
  if (typeof value === 'string' && /R\$|\$/.test(value)) {
    // Preserve currency format, replace the number portion
    displayValue = value.replace(
      /[\d.,]+/,
      animatedNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
  } else if (typeof value === 'number') {
    displayValue = Math.round(animatedNum);
  }

  return (
    <div className={`card p-3 sm:p-4 ${className || ''}`}>
      <div className="flex items-start justify-between mb-1 sm:mb-2">
        <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</span>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <p className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{displayValue}</p>
      {trendValue && (
        <div className={`flex items-center gap-1 mt-1 sm:mt-1.5 ${trendColor}`}>
          <TrendIcon size={12} />
          <span className="text-xs font-medium">{trendValue}</span>
        </div>
      )}
    </div>
  );
}

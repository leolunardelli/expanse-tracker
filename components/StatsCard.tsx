import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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

  return (
    <div className={`card p-4 ${className || ''}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</span>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {trendValue && (
        <div className={`flex items-center gap-1 mt-1.5 ${trendColor}`}>
          <TrendIcon size={12} />
          <span className="text-xs font-medium">{trendValue}</span>
        </div>
      )}
    </div>
  );
}

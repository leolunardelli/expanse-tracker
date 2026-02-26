import { ReactNode } from 'react';

type BadgeVariant = 'violet' | 'green' | 'red' | 'yellow' | 'blue' | 'gray';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  violet: 'bg-violet-20 text-violet-100',
  green: 'bg-income-20 text-income-100',
  red: 'bg-expense-20 text-expense-100',
  yellow: 'bg-warning-20 text-warning-100',
  blue: 'bg-info-20 text-info-100',
  gray: 'bg-surface-light dark:bg-dark-700 text-muted',
};

export default function Badge({ children, variant = 'violet', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}

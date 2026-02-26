import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export default function Card({ children, className = '', hover = false, padding = 'lg' }: CardProps) {
  return (
    <div
      className={[
        'bg-white dark:bg-card-dark rounded-montra shadow-card dark:shadow-card-dark',
        hover ? 'hover:shadow-card-hover transition-shadow duration-200' : '',
        paddingClasses[padding],
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

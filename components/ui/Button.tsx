'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-violet-100 text-white hover:bg-violet-80 active:bg-violet-100 font-semibold',
  secondary: 'bg-violet-20 text-violet-100 hover:bg-violet-40 font-semibold',
  outline: 'border border-border-light dark:border-border-dark text-dark-900 dark:text-white hover:bg-surface-light dark:hover:bg-dark-700 font-medium',
  danger: 'bg-expense-100 text-white hover:bg-expense-80 font-semibold',
  ghost: 'text-muted hover:bg-surface-light dark:hover:bg-dark-700 font-medium',
  icon: 'text-muted hover:bg-surface-light dark:hover:bg-dark-700 p-0',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-montra-sm',
  md: 'px-6 py-3 text-sm rounded-montra',
  lg: 'px-8 py-4 text-base rounded-montra',
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'p-1.5 rounded-montra-sm',
  md: 'p-2 rounded-montra-sm',
  lg: 'p-3 rounded-montra',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, fullWidth, className = '', children, disabled, ...props }, ref) => {
    const isIcon = variant === 'icon';
    const classes = [
      'inline-flex items-center justify-center gap-2 transition-colors duration-150',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      isIcon ? iconSizeClasses[size] : sizeClasses[size],
      fullWidth ? 'w-full' : '',
      className,
    ].join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

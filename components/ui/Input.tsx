'use client';

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, suffix, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dark-900 dark:text-white mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={[
              'input',
              icon ? 'pl-10' : '',
              suffix ? 'pr-10' : '',
              error ? 'border-expense-100 focus:ring-expense-20 focus:border-expense-100' : '',
              className,
            ].join(' ')}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-expense-100">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

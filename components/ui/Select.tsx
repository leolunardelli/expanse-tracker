'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dark-900 dark:text-white mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={[
            'input appearance-none cursor-pointer',
            error ? 'border-expense-100 focus:ring-expense-20 focus:border-expense-100' : '',
            className,
          ].join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-xs text-expense-100">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;

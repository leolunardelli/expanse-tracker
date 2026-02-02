import { z } from 'zod';
import type { Category } from '../types/index';

// Validation schema for expenses
export const expenseSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be greater than $0.00')
    .max(999999, 'Amount is too large'),
  
  category: z.enum([
    'food',
    'transport',
    'entertainment',
    'utilities',
    'shopping',
    'health',
    'other',
  ] as const),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200, 'Description must be 200 characters or less'),
  
  date: z
    .string()
    .refine(
      (date) => {
        // Check if date is valid and not in the future
        const selected = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected <= today;
      },
      'Date cannot be in the future'
    ),
});

// TypeScript type inferred from schema
export type ExpenseFormData = z.infer<typeof expenseSchema>;

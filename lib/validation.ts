import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .transform((value) => value.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long');

export const registerSchema = z.object({
  name: z.string().trim().max(120).optional().or(z.literal('')),
  email: emailSchema,
  password: passwordSchema,
});

export const expenseFormSchema = z.object({
  description: z.string().trim().min(1).max(140),
  amount: z.number().positive().max(1_000_000_000),
  category: z.string().trim().min(1).max(60),
  date: z.date(),
  isRecurring: z.boolean(),
  recurrenceType: z
    .enum(['daily', 'weekly', 'monthly', 'yearly'])
    .nullable()
    .optional(),
  tags: z.array(z.string().trim().min(1).max(30)).max(10),
  notes: z.string().trim().max(500).nullable(),
});

export const updateExpenseSchema = z.object({
  description: z.string().trim().min(1).max(140),
  amount: z.number().positive().max(1_000_000_000),
  category: z.string().trim().min(1).max(60),
  date: z.date(),
  isRecurring: z.boolean().optional(),
  recurrenceType: z
    .enum(['daily', 'weekly', 'monthly', 'yearly'])
    .nullable()
    .optional(),
  tags: z.array(z.string().trim().min(1).max(30)).max(10).optional(),
  notes: z.string().trim().max(500).nullable().optional(),
});

export const exportFilterSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  category: z.string().optional(),
  format: z.enum(['csv', 'json']).default('csv'),
});

export const incomeSchema = z.object({
  description: z.string().trim().min(1, 'Description is required').max(140),
  amount: z.number().positive('Amount must be positive').max(1_000_000_000),
  type: z.enum(['salary', 'freelance', 'investment', 'rental', 'other']).default('salary'),
  frequency: z.enum(['monthly', 'biweekly', 'weekly']).default('monthly'),
});

export const plannedExpenseSchema = z.object({
  description: z.string().trim().min(1, 'Description is required').max(140),
  amount: z.number().positive('Amount must be positive').max(1_000_000_000),
  category: z.string().trim().min(1).max(60).default('Other'),
  frequency: z.enum(['monthly', 'weekly', 'yearly', 'daily']).default('monthly'),
  isFixed: z.boolean().default(true),
  dueDay: z.number().int().min(1).max(31).nullable().default(null),
});

export const budgetSchema = z.object({
  category: z.string().trim().min(1, 'Category is required').max(60),
  amount: z.number().positive('Amount must be positive').max(1_000_000_000),
  alertAt: z.number().int().min(1).max(100).default(80),
});

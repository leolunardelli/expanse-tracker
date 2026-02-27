'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { categorizeExpense } from '@/lib/ai';
import { expenseFormSchema, updateExpenseSchema } from '@/lib/validation';

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user.id;
}

export async function createExpense(formData: FormData) {
  const userId = await getUserId();
  const description = formData.get('description') as string;
  const amount = Number(formData.get('amount') as string);
  let category = (formData.get('category') as string) || 'Other';
  const date = new Date(formData.get('date') as string);
  const isRecurring = formData.get('isRecurring') === 'true';
  const recurrenceType = formData.get('recurrenceType') as string | null;
  const tagsRaw = formData.get('tags') as string | null;
  const notesRaw = (formData.get('notes') as string | null) || null;

  // Parse tags from comma-separated string
  const tags = tagsRaw
    ? tagsRaw
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0)
    : [];

  const parsed = expenseFormSchema.safeParse({
    description,
    amount,
    category,
    date,
    isRecurring,
    recurrenceType,
    tags,
    notes: notesRaw,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid expense data');
  }

  const { notes } = parsed.data;
  
  if (!category || category === 'Other') {
    try {
      category = await categorizeExpense(description);
    } catch {
      category = 'Other';
    }
  }
  
  await prisma.expense.create({
    data: {
      description: parsed.data.description,
      amount: parsed.data.amount,
      category,
      date: parsed.data.date,
      isRecurring: parsed.data.isRecurring,
      recurrenceType: parsed.data.isRecurring ? parsed.data.recurrenceType : null,
      tags: parsed.data.tags,
      notes,
      userId,
    },
  });
  revalidatePath('/');
}

export async function updateExpense(
  id: string,
  data: { 
    description: string; 
    amount: number; 
    category: string; 
    date: Date;
    isRecurring?: boolean;
    recurrenceType?: string | null;
    tags?: string[];
    notes?: string | null;
  }
) {
  const userId = await getUserId();
  const parsed = updateExpenseSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid expense data');
  }

  const validatedData = parsed.data;
  
  const expense = await prisma.expense.findFirst({
    where: { id, userId },
  });
  
  if (!expense) throw new Error('Expense not found');
  
  await prisma.expense.update({
    where: { id },
    data: {
      description: validatedData.description,
      amount: validatedData.amount,
      category: validatedData.category,
      date: validatedData.date,
      isRecurring: validatedData.isRecurring ?? false,
      recurrenceType:
        validatedData.isRecurring ? validatedData.recurrenceType : null,
      tags: validatedData.tags ?? [],
      notes: validatedData.notes ?? null,
    },
  });
  
  revalidatePath('/');
}

export async function deleteExpense(id: string) {
  const userId = await getUserId();
  
  const expense = await prisma.expense.findFirst({
    where: { id, userId },
  });
  
  if (!expense) throw new Error('Expense not found');
  
  await prisma.expense.delete({
    where: { id },
  });
  
  revalidatePath('/');
}

export async function getExpenses() {
  const userId = await getUserId();
  
  return prisma.expense.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
}

export type FilterParams = {
  search?: string;
  category?: string;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: string;
  amountMax?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
};

export async function getFilteredExpenses(filters: FilterParams = {}) {
  const userId = await getUserId();
  const {
    search,
    category,
    tag,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    sortBy = 'date',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
  } = filters;

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0 && pageSize <= 100 ? pageSize : 10;

  // Build where clause
  const where: Record<string, unknown> = { userId };

  if (search) {
    where.OR = [
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
      { notes: { contains: search, mode: 'insensitive' } },
      { tags: { has: search.toLowerCase() } },
    ];
  }

  if (category && category !== 'all') {
    where.category = category;
  }

  if (tag) {
    where.tags = { has: tag.toLowerCase() };
  }

  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.date as Record<string, unknown>).lte = new Date(dateTo + 'T23:59:59');
  }

  if (amountMin || amountMax) {
    where.amount = {};
    if (amountMin) {
      const parsedMin = Number(amountMin);
      if (!Number.isNaN(parsedMin)) {
        (where.amount as Record<string, unknown>).gte = parsedMin;
      }
    }
    if (amountMax) {
      const parsedMax = Number(amountMax);
      if (!Number.isNaN(parsedMax)) {
        (where.amount as Record<string, unknown>).lte = parsedMax;
      }
    }
  }

  // Build order by
  const validSortFields = ['date', 'amount', 'description', 'category'];
  const orderField = validSortFields.includes(sortBy) ? sortBy : 'date';
  const orderBy = { [orderField]: sortOrder };

  // Get total count for pagination
  const totalCount = await prisma.expense.count({ where });

  // Get paginated results
  const expenses = await prisma.expense.findMany({
    where,
    orderBy,
    skip: (safePage - 1) * safePageSize,
    take: safePageSize,
  });

  return {
    expenses,
    pagination: {
      page: safePage,
      pageSize: safePageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / safePageSize),
      hasNext: safePage * safePageSize < totalCount,
      hasPrev: safePage > 1,
    },
  };
}

export async function getCategories() {
  const userId = await getUserId();

  const expenses = await prisma.expense.findMany({
    where: { userId },
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  });

  return expenses.map((e) => e.category);
}

export async function getExpenseStats() {
  const userId = await getUserId();

  const [count, totals, grouped] = await Promise.all([
    prisma.expense.count({ where: { userId } }),
    prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.expense.groupBy({
      by: ['category'],
      where: { userId },
      _sum: { amount: true },
    }),
  ]);

  const byCategory = grouped.reduce((acc, item) => {
    acc[item.category] = item._sum.amount || 0;
    return acc;
  }, {} as Record<string, number>);

  return { total: totals._sum.amount || 0, byCategory, count };
}

export async function getTags(): Promise<string[]> {
  const userId = await getUserId();

  const expenses = await prisma.expense.findMany({
    where: { userId, tags: { isEmpty: false } },
    select: { tags: true },
  });

  const tagSet = new Set<string>();
  expenses.forEach((e) => e.tags.forEach((t) => tagSet.add(t)));

  return Array.from(tagSet).sort();
}

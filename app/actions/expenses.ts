'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { categorizeExpense } from '@/lib/ai';

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user.id;
}

export async function createExpense(formData: FormData) {
  const userId = await getUserId();
  const description = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  let category = formData.get('category') as string;
  const date = new Date(formData.get('date') as string);
  const isRecurring = formData.get('isRecurring') === 'true';
  const recurrenceType = formData.get('recurrenceType') as string | null;
  
  if (!category || category === 'Other') {
    try {
      category = await categorizeExpense(description);
    } catch {
      category = 'Other';
    }
  }
  
  await prisma.expense.create({
    data: { description, amount, category, date, isRecurring, recurrenceType: isRecurring ? recurrenceType : null, userId },
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
  }
) {
  const userId = await getUserId();
  
  const expense = await prisma.expense.findFirst({
    where: { id, userId },
  });
  
  if (!expense) throw new Error('Expense not found');
  
  await prisma.expense.update({
    where: { id },
    data: {
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: data.date,
      isRecurring: data.isRecurring ?? false,
      recurrenceType: data.isRecurring ? data.recurrenceType : null,
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
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    sortBy = 'date',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
  } = filters;

  // Build where clause
  const where: Record<string, unknown> = { userId };

  if (search) {
    where.OR = [
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category && category !== 'all') {
    where.category = category;
  }

  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.date as Record<string, unknown>).lte = new Date(dateTo + 'T23:59:59');
  }

  if (amountMin || amountMax) {
    where.amount = {};
    if (amountMin) (where.amount as Record<string, unknown>).gte = parseFloat(amountMin);
    if (amountMax) (where.amount as Record<string, unknown>).lte = parseFloat(amountMax);
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
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    expenses,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      hasNext: page * pageSize < totalCount,
      hasPrev: page > 1,
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
  
  const expenses = await prisma.expense.findMany({
    where: { userId },
    select: { amount: true, category: true },
  });
  
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
  
  return { total, byCategory, count: expenses.length };
}

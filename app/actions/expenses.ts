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

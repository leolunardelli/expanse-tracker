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
  const category = formData.get('category') as string;
  
  // AI categorization if category is "Other" or empty
  let finalCategory = category;
  if (!category || category === 'Other') {
    try {
      finalCategory = await categorizeExpense(description);
    } catch {
      finalCategory = 'Other';
    }
  }
  
  await prisma.expense.create({
    data: {
      description,
      amount,
      category: finalCategory,
      userId,
    },
  });
  
  revalidatePath('/');
}

export async function deleteExpense(id: string) {
  await getUserId(); // Auth check
  
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
  
  const total = expenses.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0);
  const byCategory = expenses.reduce((acc: Record<string, number>, e: { amount: number; category: string }) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
  
  return { total, byCategory, count: expenses.length };
}

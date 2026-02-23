'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user.id;
}

export async function getRecurringExpenses() {
  const userId = await getUserId();

  return prisma.expense.findMany({
    where: { userId, isRecurring: true },
    orderBy: { amount: 'desc' },
  });
}

export async function getRecurringStats() {
  const userId = await getUserId();

  const recurring = await prisma.expense.findMany({
    where: { userId, isRecurring: true },
    select: { amount: true, category: true, recurrenceType: true },
  });

  // Calculate monthly equivalent for each recurring expense
  const monthlyTotal = recurring.reduce((sum, e) => {
    switch (e.recurrenceType) {
      case 'daily':
        return sum + e.amount * 30;
      case 'weekly':
        return sum + e.amount * 4.33;
      case 'monthly':
        return sum + e.amount;
      case 'yearly':
        return sum + e.amount / 12;
      default:
        return sum + e.amount;
    }
  }, 0);

  const yearlyTotal = monthlyTotal * 12;

  // Group by category
  const byCategory = recurring.reduce((acc, e) => {
    let monthlyAmount: number;
    switch (e.recurrenceType) {
      case 'daily':
        monthlyAmount = e.amount * 30;
        break;
      case 'weekly':
        monthlyAmount = e.amount * 4.33;
        break;
      case 'monthly':
        monthlyAmount = e.amount;
        break;
      case 'yearly':
        monthlyAmount = e.amount / 12;
        break;
      default:
        monthlyAmount = e.amount;
    }
    acc[e.category] = (acc[e.category] || 0) + monthlyAmount;
    return acc;
  }, {} as Record<string, number>);

  // Group by frequency
  const byFrequency = recurring.reduce((acc, e) => {
    const freq = e.recurrenceType || 'monthly';
    acc[freq] = (acc[freq] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    count: recurring.length,
    monthlyTotal,
    yearlyTotal,
    byCategory,
    byFrequency,
  };
}

export async function cancelRecurring(id: string) {
  const userId = await getUserId();

  const expense = await prisma.expense.findFirst({
    where: { id, userId },
  });

  if (!expense) throw new Error('Expense not found');

  await prisma.expense.update({
    where: { id },
    data: {
      isRecurring: false,
      recurrenceType: null,
    },
  });

  revalidatePath('/recurring');
  revalidatePath('/');
}

export async function reactivateRecurring(id: string, recurrenceType: string) {
  const userId = await getUserId();

  const expense = await prisma.expense.findFirst({
    where: { id, userId },
  });

  if (!expense) throw new Error('Expense not found');

  await prisma.expense.update({
    where: { id },
    data: {
      isRecurring: true,
      recurrenceType,
    },
  });

  revalidatePath('/recurring');
  revalidatePath('/');
}

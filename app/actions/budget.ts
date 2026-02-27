'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { budgetSchema } from '@/lib/validation';

export async function getBudgets() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return prisma.budget.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getBudgetByCategory(category: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.budget.findUnique({
    where: {
      userId_category: {
        userId: session.user.id,
        category,
      },
    },
  });
}

export async function saveBudget(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const category = formData.get('category') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const alertAt = parseInt(formData.get('alertAt') as string) || 80;

  const parsed = budgetSchema.safeParse({ category, amount, alertAt });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid budget data' };
  }

  try {
    await prisma.budget.upsert({
      where: {
        userId_category: {
          userId: session.user.id,
          category: parsed.data.category,
        },
      },
      update: {
        amount: parsed.data.amount,
        alertAt: parsed.data.alertAt,
      },
      create: {
        category: parsed.data.category,
        amount: parsed.data.amount,
        alertAt: parsed.data.alertAt,
        userId: session.user.id,
      },
    });

    revalidatePath('/');
    revalidatePath('/budget');
    return { success: true };
  } catch {
    return { error: 'Failed to save budget' };
  }
}

export async function deleteBudget(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.budget.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    revalidatePath('/');
    revalidatePath('/budget');
    return { success: true };
  } catch {
    return { error: 'Failed to delete budget' };
  }
}

export async function getBudgetStatus() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const budgets = await prisma.budget.findMany({
    where: { userId: session.user.id },
  });

  const expenses = await prisma.expense.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  const spendingByCategory: Record<string, number> = {};
  let totalSpending = 0;

  expenses.forEach((expense) => {
    spendingByCategory[expense.category] = (spendingByCategory[expense.category] || 0) + expense.amount;
    totalSpending += expense.amount;
  });

  return budgets.map((budget) => {
    const spent = budget.category === 'all' 
      ? totalSpending 
      : (spendingByCategory[budget.category] || 0);
    
    const percentage = (spent / budget.amount) * 100;
    const remaining = budget.amount - spent;
    const isOverBudget = spent > budget.amount;
    const isNearLimit = percentage >= budget.alertAt;

    return {
      id: budget.id,
      category: budget.category,
      budgetAmount: budget.amount,
      spent,
      remaining,
      percentage: Math.min(percentage, 100),
      isOverBudget,
      isNearLimit,
      alertAt: budget.alertAt,
    };
  });
}

export async function getBudgetAlerts() {
  const statuses = await getBudgetStatus();
  return statuses.filter((s) => s.isNearLimit || s.isOverBudget);
}

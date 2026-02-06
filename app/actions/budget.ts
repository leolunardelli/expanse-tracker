'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all budgets for the current user
export async function getBudgets() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return prisma.budget.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });
}

// Get a specific budget by category
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

// Create or update a budget (upsert)
export async function saveBudget(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const category = formData.get('category') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const alertAt = parseInt(formData.get('alertAt') as string) || 80;

  if (!category || isNaN(amount) || amount <= 0) {
    return { error: 'Invalid budget data' };
  }

  try {
    await prisma.budget.upsert({
      where: {
        userId_category: {
          userId: session.user.id,
          category,
        },
      },
      update: {
        amount,
        alertAt,
      },
      create: {
        category,
        amount,
        alertAt,
        userId: session.user.id,
      },
    });

    revalidatePath('/');
    revalidatePath('/budget');
    return { success: true };
  } catch (error) {
    console.error('Save budget error:', error);
    return { error: 'Failed to save budget' };
  }
}

// Delete a budget
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
  } catch (error) {
    console.error('Delete budget error:', error);
    return { error: 'Failed to delete budget' };
  }
}

// Get budget status with spending for current month
export async function getBudgetStatus() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Get all budgets
  const budgets = await prisma.budget.findMany({
    where: { userId: session.user.id },
  });

  // Get expenses for this month
  const expenses = await prisma.expense.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  // Calculate spending by category
  const spendingByCategory: Record<string, number> = {};
  let totalSpending = 0;

  expenses.forEach((expense) => {
    spendingByCategory[expense.category] = (spendingByCategory[expense.category] || 0) + expense.amount;
    totalSpending += expense.amount;
  });

  // Build budget status
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

// Get alerts for budgets that are near or over limit
export async function getBudgetAlerts() {
  const statuses = await getBudgetStatus();
  return statuses.filter((s) => s.isNearLimit || s.isOverBudget);
}

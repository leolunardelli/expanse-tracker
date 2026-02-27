'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  generateExpenseInsight, 
  generateSavingTips, 
  predictMonthlySpending,
  generateWeeklyAnalysis 
} from '@/lib/ai';

async function getUserExpenses() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  
  return prisma.expense.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    take: 100,
    select: { description: true, amount: true, category: true, date: true },
  });
}

export async function getAIInsights() {
  try {
    const expenses = await getUserExpenses();
    if (!expenses || expenses.length === 0) {
      return 'Start tracking expenses to get AI-powered insights!';
    }
    
    return await generateExpenseInsight(expenses);
  } catch {
    // AI service unavailable – graceful fallback
    return 'Unable to generate insights at this time.';
  }
}

export async function getSavingTips() {
  try {
    const expenses = await getUserExpenses();
    if (!expenses || expenses.length === 0) {
      return [];
    }
    
    return await generateSavingTips(expenses);
  } catch {
    // AI service unavailable – graceful fallback
    return [];
  }
}

export async function getSpendingPrediction() {
  try {
    const expenses = await getUserExpenses();
    if (!expenses || expenses.length === 0) {
      return null;
    }
    
    return await predictMonthlySpending(expenses);
  } catch {
    // AI service unavailable – graceful fallback
    return null;
  }
}

export async function getWeeklyAnalysis() {
  try {
    const expenses = await getUserExpenses();
    if (!expenses || expenses.length === 0) {
      return null;
    }
    
    return await generateWeeklyAnalysis(expenses);
  } catch {
    // AI service unavailable – graceful fallback
    return null;
  }
}

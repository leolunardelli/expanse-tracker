'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateExpenseInsight } from '@/lib/ai';

export async function getAIInsights() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return 'Sign in to get AI-powered insights!';
    }
    
    const expenses = await prisma.expense.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: 50,
      select: { description: true, amount: true, category: true },
    });
    
    if (expenses.length === 0) {
      return 'Start tracking expenses to get AI-powered insights!';
    }
    
    return await generateExpenseInsight(expenses);
  } catch (error) {
    console.error('AI Insights error:', error);
    return 'Unable to generate insights at this time.';
  }
}

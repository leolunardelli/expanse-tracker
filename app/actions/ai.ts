'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateExpenseInsight } from '@/lib/ai';

export async function getAIInsights() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  
  if (!user) throw new Error('User not found');
  
  const expenses = await prisma.expense.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
    take: 50,
    select: { description: true, amount: true, category: true },
  });
  
  if (expenses.length === 0) {
    return 'Start tracking expenses to get AI-powered insights!';
  }
  
  return generateExpenseInsight(expenses);
}

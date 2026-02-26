'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user.id;
}

// ─── Frequency normalization ─────────────────────────────────────

export function toMonthly(amount: number, frequency: string): number {
  switch (frequency) {
    case 'daily':
      return amount * 30;
    case 'weekly':
      return amount * 4.33;
    case 'biweekly':
      return amount * 2.17;
    case 'monthly':
      return amount;
    case 'yearly':
      return amount / 12;
    default:
      return amount;
  }
}

// ─── Income CRUD ──────────────────────────────────────────────────

export async function getIncomes() {
  const userId = await getUserId();

  return prisma.income.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addIncome(formData: FormData) {
  const userId = await getUserId();

  const description = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const type = (formData.get('type') as string) || 'salary';
  const frequency = (formData.get('frequency') as string) || 'monthly';

  if (!description || isNaN(amount) || amount <= 0) {
    return { error: 'Invalid income data' };
  }

  await prisma.income.create({
    data: {
      description,
      amount,
      type,
      frequency,
      userId,
    },
  });

  revalidatePath('/planning');
  revalidatePath('/');
}

export async function updateIncome(
  id: string,
  data: {
    description?: string;
    amount?: number;
    type?: string;
    frequency?: string;
    isActive?: boolean;
  }
) {
  const userId = await getUserId();

  await prisma.income.update({
    where: { id, userId },
    data,
  });

  revalidatePath('/planning');
  revalidatePath('/');
}

export async function deleteIncome(id: string) {
  const userId = await getUserId();

  await prisma.income.delete({
    where: { id, userId },
  });

  revalidatePath('/planning');
  revalidatePath('/');
}

export async function getMonthlyIncomeTotal(): Promise<number> {
  const userId = await getUserId();

  const incomes = await prisma.income.findMany({
    where: { userId, isActive: true },
  });

  return incomes.reduce((sum, inc) => sum + toMonthly(inc.amount, inc.frequency), 0);
}

// ─── Planned Expenses CRUD ────────────────────────────────────────

export async function getPlannedExpenses() {
  const userId = await getUserId();

  return prisma.plannedExpense.findMany({
    where: { userId },
    orderBy: [{ isFixed: 'desc' }, { amount: 'desc' }],
  });
}

export async function addPlannedExpense(formData: FormData) {
  const userId = await getUserId();

  const description = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const category = (formData.get('category') as string) || 'Other';
  const frequency = (formData.get('frequency') as string) || 'monthly';
  const isFixed = formData.get('isFixed') === 'true';
  const dueDayStr = formData.get('dueDay') as string;
  const dueDay = dueDayStr ? parseInt(dueDayStr) : null;

  if (!description || isNaN(amount) || amount <= 0) {
    return { error: 'Invalid planned expense data' };
  }

  await prisma.plannedExpense.create({
    data: {
      description,
      amount,
      category,
      frequency,
      isFixed,
      dueDay,
      userId,
    },
  });

  revalidatePath('/planning');
  revalidatePath('/');
}

export async function updatePlannedExpense(
  id: string,
  data: {
    description?: string;
    amount?: number;
    category?: string;
    frequency?: string;
    isFixed?: boolean;
    dueDay?: number | null;
    isActive?: boolean;
  }
) {
  const userId = await getUserId();

  await prisma.plannedExpense.update({
    where: { id, userId },
    data,
  });

  revalidatePath('/planning');
  revalidatePath('/');
}

export async function deletePlannedExpense(id: string) {
  const userId = await getUserId();

  await prisma.plannedExpense.delete({
    where: { id, userId },
  });

  revalidatePath('/planning');
  revalidatePath('/');
}

// ─── Monthly Plan Summary ─────────────────────────────────────────

export type MonthlyPlanSummary = {
  income: number;
  plannedFixed: number;
  plannedVariable: number;
  totalPlanned: number;
  disposable: number;
  actualSpent: number;
  remaining: number;
  incomeUsedPercent: number;
  categoryComparison: {
    category: string;
    planned: number;
    actual: number;
    delta: number;
  }[];
};

export async function getMonthlyPlanSummary(): Promise<MonthlyPlanSummary> {
  const userId = await getUserId();

  // Get active incomes
  const incomes = await prisma.income.findMany({
    where: { userId, isActive: true },
  });
  const income = incomes.reduce((sum, inc) => sum + toMonthly(inc.amount, inc.frequency), 0);

  // Get active planned expenses
  const planned = await prisma.plannedExpense.findMany({
    where: { userId, isActive: true },
  });

  const plannedFixed = planned
    .filter((p) => p.isFixed)
    .reduce((sum, p) => sum + toMonthly(p.amount, p.frequency), 0);

  const plannedVariable = planned
    .filter((p) => !p.isFixed)
    .reduce((sum, p) => sum + toMonthly(p.amount, p.frequency), 0);

  const totalPlanned = plannedFixed + plannedVariable;
  const disposable = income - totalPlanned;

  // Get actual spending for current month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      date: { gte: monthStart, lte: monthEnd },
    },
    select: { amount: true, category: true },
  });

  const actualSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = income - actualSpent;
  const incomeUsedPercent = income > 0 ? (actualSpent / income) * 100 : 0;

  // Category comparison: planned vs actual
  const categoryMap = new Map<string, { planned: number; actual: number }>();

  planned.forEach((p) => {
    const monthlyAmount = toMonthly(p.amount, p.frequency);
    const existing = categoryMap.get(p.category) || { planned: 0, actual: 0 };
    existing.planned += monthlyAmount;
    categoryMap.set(p.category, existing);
  });

  expenses.forEach((e) => {
    const existing = categoryMap.get(e.category) || { planned: 0, actual: 0 };
    existing.actual += e.amount;
    categoryMap.set(e.category, existing);
  });

  const categoryComparison = Array.from(categoryMap.entries())
    .map(([category, { planned: p, actual: a }]) => ({
      category,
      planned: Math.round(p * 100) / 100,
      actual: Math.round(a * 100) / 100,
      delta: Math.round((a - p) * 100) / 100,
    }))
    .sort((a, b) => b.planned - a.planned);

  return {
    income: Math.round(income * 100) / 100,
    plannedFixed: Math.round(plannedFixed * 100) / 100,
    plannedVariable: Math.round(plannedVariable * 100) / 100,
    totalPlanned: Math.round(totalPlanned * 100) / 100,
    disposable: Math.round(disposable * 100) / 100,
    actualSpent: Math.round(actualSpent * 100) / 100,
    remaining: Math.round(remaining * 100) / 100,
    incomeUsedPercent: Math.round(incomeUsedPercent * 10) / 10,
    categoryComparison,
  };
}

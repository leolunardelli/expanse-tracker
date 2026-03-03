'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { toMonthly } from '@/lib/planning';
import { incomeSchema, plannedExpenseSchema } from '@/lib/validation';

async function getUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user.id;
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

  const parsed = incomeSchema.safeParse({
    description: formData.get('description') as string,
    amount: parseFloat(formData.get('amount') as string),
    type: (formData.get('type') as string) || 'salary',
    frequency: (formData.get('frequency') as string) || 'monthly',
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid income data' };
  }

  await prisma.income.create({
    data: {
      description: parsed.data.description,
      amount: parsed.data.amount,
      type: parsed.data.type,
      frequency: parsed.data.frequency,
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

  const dueDayStr = formData.get('dueDay') as string;

  const parsed = plannedExpenseSchema.safeParse({
    description: formData.get('description') as string,
    amount: parseFloat(formData.get('amount') as string),
    category: (formData.get('category') as string) || 'Other',
    frequency: (formData.get('frequency') as string) || 'monthly',
    isFixed: formData.get('isFixed') === 'true',
    dueDay: dueDayStr ? parseInt(dueDayStr) : null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid planned expense data' };
  }

  await prisma.plannedExpense.create({
    data: {
      description: parsed.data.description,
      amount: parsed.data.amount,
      category: parsed.data.category,
      frequency: parsed.data.frequency,
      isFixed: parsed.data.isFixed,
      dueDay: parsed.data.dueDay,
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

export type RecurringExpenseItem = {
  id: string;
  description: string;
  amount: number;
  category: string;
  recurrenceType: string;
  monthlyAmount: number;
};

export async function getRecurringExpenseItems(): Promise<RecurringExpenseItem[]> {
  const userId = await getUserId();

  const expenses = await prisma.expense.findMany({
    where: { userId, isRecurring: true },
    select: { id: true, description: true, amount: true, category: true, recurrenceType: true },
    orderBy: { amount: 'desc' },
  });

  return expenses.map((e) => ({
    id: e.id,
    description: e.description,
    amount: e.amount,
    category: e.category,
    recurrenceType: e.recurrenceType || 'monthly',
    monthlyAmount: toMonthly(e.amount, e.recurrenceType || 'monthly'),
  }));
}

// ─── Budget Allocation from Income ────────────────────────────────

export async function saveBudgetAllocations(
  allocations: { category: string; amount: number }[]
) {
  const userId = await getUserId();

  for (const alloc of allocations) {
    if (alloc.amount <= 0) {
      // Delete budget if amount is 0
      await prisma.budget.deleteMany({
        where: { userId, category: alloc.category },
      });
    } else {
      await prisma.budget.upsert({
        where: {
          userId_category: { userId, category: alloc.category },
        },
        update: { amount: alloc.amount },
        create: {
          category: alloc.category,
          amount: alloc.amount,
          alertAt: 80,
          userId,
        },
      });
    }
  }

  revalidatePath('/planning');
  revalidatePath('/budget');
  revalidatePath('/');
}

export type RecurringByCategory = {
  category: string;
  total: number;
  items: { description: string; monthlyAmount: number }[];
};

export async function getRecurringByCategory(): Promise<RecurringByCategory[]> {
  const userId = await getUserId();

  const expenses = await prisma.expense.findMany({
    where: { userId, isRecurring: true },
    select: { description: true, amount: true, category: true, recurrenceType: true },
    orderBy: { amount: 'desc' },
  });

  const map = new Map<string, { total: number; items: { description: string; monthlyAmount: number }[] }>();

  for (const e of expenses) {
    const monthly = toMonthly(e.amount, e.recurrenceType || 'monthly');
    const entry = map.get(e.category) || { total: 0, items: [] };
    entry.total += monthly;
    entry.items.push({ description: e.description, monthlyAmount: monthly });
    map.set(e.category, entry);
  }

  return Array.from(map.entries())
    .map(([category, data]) => ({
      category,
      total: Math.round(data.total * 100) / 100,
      items: data.items,
    }))
    .sort((a, b) => b.total - a.total);
}

export type MonthlyPlanSummary = {
  income: number;
  plannedFixed: number;
  plannedVariable: number;
  recurringTotal: number;
  totalPlanned: number;
  disposable: number;
  actualSpent: number;
  remaining: number;
  incomeUsedPercent: number;
  budgetTotal: number;
  categoryComparison: {
    category: string;
    planned: number;
    actual: number;
    budget: number;
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

  // Get recurring expenses (from Expense model) as additional planned costs
  const recurringExpenses = await prisma.expense.findMany({
    where: { userId, isRecurring: true },
    select: { amount: true, category: true, recurrenceType: true },
  });

  const recurringTotal = recurringExpenses.reduce(
    (sum, e) => sum + toMonthly(e.amount, e.recurrenceType || 'monthly'),
    0,
  );

  // Get budget limits
  const budgets = await prisma.budget.findMany({
    where: { userId },
    select: { category: true, amount: true },
  });

  const budgetTotal = budgets
    .filter((b) => b.category !== 'all')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalPlanned = plannedFixed + plannedVariable + recurringTotal;
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

  // Build budget map by category
  const budgetMap = new Map<string, number>();
  budgets.forEach((b) => {
    if (b.category !== 'all') {
      budgetMap.set(b.category, b.amount);
    }
  });

  // Category comparison: planned + recurring vs actual vs budget
  const categoryMap = new Map<string, { planned: number; actual: number; budget: number }>();

  planned.forEach((p) => {
    const monthlyAmount = toMonthly(p.amount, p.frequency);
    const existing = categoryMap.get(p.category) || { planned: 0, actual: 0, budget: 0 };
    existing.planned += monthlyAmount;
    categoryMap.set(p.category, existing);
  });

  // Add recurring expenses to planned amounts per category
  recurringExpenses.forEach((e) => {
    const monthlyAmount = toMonthly(e.amount, e.recurrenceType || 'monthly');
    const existing = categoryMap.get(e.category) || { planned: 0, actual: 0, budget: 0 };
    existing.planned += monthlyAmount;
    categoryMap.set(e.category, existing);
  });

  expenses.forEach((e) => {
    const existing = categoryMap.get(e.category) || { planned: 0, actual: 0, budget: 0 };
    existing.actual += e.amount;
    categoryMap.set(e.category, existing);
  });

  // Merge budget limits into categories
  budgetMap.forEach((amount, category) => {
    const existing = categoryMap.get(category) || { planned: 0, actual: 0, budget: 0 };
    existing.budget = amount;
    categoryMap.set(category, existing);
  });

  const categoryComparison = Array.from(categoryMap.entries())
    .map(([category, { planned: p, actual: a, budget: b }]) => ({
      category,
      planned: Math.round(p * 100) / 100,
      actual: Math.round(a * 100) / 100,
      budget: Math.round(b * 100) / 100,
      delta: Math.round((a - p) * 100) / 100,
    }))
    .sort((a, b) => b.planned - a.planned);

  return {
    income: Math.round(income * 100) / 100,
    plannedFixed: Math.round(plannedFixed * 100) / 100,
    plannedVariable: Math.round(plannedVariable * 100) / 100,
    recurringTotal: Math.round(recurringTotal * 100) / 100,
    totalPlanned: Math.round(totalPlanned * 100) / 100,
    disposable: Math.round(disposable * 100) / 100,
    actualSpent: Math.round(actualSpent * 100) / 100,
    remaining: Math.round(remaining * 100) / 100,
    incomeUsedPercent: Math.round(incomeUsedPercent * 10) / 10,
    budgetTotal: Math.round(budgetTotal * 100) / 100,
    categoryComparison,
  };
}

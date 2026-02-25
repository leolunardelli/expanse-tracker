'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user.id;
}

export type MonthlyReport = {
  month: string; // 'YYYY-MM'
  monthLabel: string;
  totalSpent: number;
  transactionCount: number;
  avgPerTransaction: number;
  avgPerDay: number;
  daysInMonth: number;
  daysWithSpending: number;
  highestDay: { date: string; amount: number };
  lowestDay: { date: string; amount: number };
  categoryBreakdown: { name: string; amount: number; percentage: number; count: number }[];
  dailySpending: { date: string; day: number; amount: number; label: string }[];
  topExpenses: {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
  }[];
  comparison: {
    prevMonth: string;
    prevMonthLabel: string;
    prevTotal: number;
    changeAmount: number;
    changePercent: number;
    direction: 'up' | 'down' | 'same';
  };
};

export async function getMonthlyReport(month: string): Promise<MonthlyReport> {
  const userId = await getUserId();

  // Parse month string 'YYYY-MM'
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr);
  const monthNum = parseInt(monthStr);

  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
  const daysInMonth = endDate.getDate();

  const monthLabel = startDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Get all expenses for this month
  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { date: 'desc' },
  });

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const transactionCount = expenses.length;
  const avgPerTransaction = transactionCount > 0 ? totalSpent / transactionCount : 0;

  // Daily spending breakdown
  const dailyMap: Record<number, number> = {};
  for (let d = 1; d <= daysInMonth; d++) dailyMap[d] = 0;
  expenses.forEach((e) => {
    const day = new Date(e.date).getDate();
    dailyMap[day] += e.amount;
  });

  const dailySpending = Object.entries(dailyMap).map(([day, amount]) => {
    const dayNum = parseInt(day);
    const dateObj = new Date(year, monthNum - 1, dayNum);
    return {
      date: dateObj.toISOString().slice(0, 10),
      day: dayNum,
      amount: Math.round(amount * 100) / 100,
      label: dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
    };
  });

  const daysWithSpending = dailySpending.filter((d) => d.amount > 0).length;
  const avgPerDay = daysInMonth > 0 ? totalSpent / daysInMonth : 0;

  // Highest / lowest spending day (among days with spending)
  const spendingDays = dailySpending.filter((d) => d.amount > 0);
  const highestDay = spendingDays.length > 0
    ? spendingDays.reduce((max, d) => (d.amount > max.amount ? d : max))
    : { date: '', amount: 0 };
  const lowestDay = spendingDays.length > 0
    ? spendingDays.reduce((min, d) => (d.amount < min.amount ? d : min))
    : { date: '', amount: 0 };

  // Category breakdown
  const categoryMap: Record<string, { amount: number; count: number }> = {};
  expenses.forEach((e) => {
    if (!categoryMap[e.category]) categoryMap[e.category] = { amount: 0, count: 0 };
    categoryMap[e.category].amount += e.amount;
    categoryMap[e.category].count += 1;
  });

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([name, { amount, count }]) => ({
      name,
      amount: Math.round(amount * 100) / 100,
      percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 1000) / 10 : 0,
      count,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Top expenses
  const topExpenses = expenses
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)
    .map((e) => ({
      id: e.id,
      description: e.description,
      amount: e.amount,
      category: e.category,
      date: new Date(e.date).toISOString().slice(0, 10),
    }));

  // Previous month comparison
  const prevStartDate = new Date(year, monthNum - 2, 1);
  const prevEndDate = new Date(year, monthNum - 1, 0, 23, 59, 59, 999);
  const prevMonthLabel = prevStartDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const prevExpenses = await prisma.expense.findMany({
    where: {
      userId,
      date: { gte: prevStartDate, lte: prevEndDate },
    },
    select: { amount: true },
  });

  const prevTotal = prevExpenses.reduce((sum, e) => sum + e.amount, 0);
  const changeAmount = totalSpent - prevTotal;
  const changePercent = prevTotal > 0 ? (changeAmount / prevTotal) * 100 : 0;

  return {
    month,
    monthLabel,
    totalSpent: Math.round(totalSpent * 100) / 100,
    transactionCount,
    avgPerTransaction: Math.round(avgPerTransaction * 100) / 100,
    avgPerDay: Math.round(avgPerDay * 100) / 100,
    daysInMonth,
    daysWithSpending,
    highestDay: { date: highestDay.date, amount: Math.round(highestDay.amount * 100) / 100 },
    lowestDay: { date: lowestDay.date, amount: Math.round(lowestDay.amount * 100) / 100 },
    categoryBreakdown,
    dailySpending,
    topExpenses,
    comparison: {
      prevMonth: `${prevStartDate.getFullYear()}-${String(prevStartDate.getMonth() + 1).padStart(2, '0')}`,
      prevMonthLabel,
      prevTotal: Math.round(prevTotal * 100) / 100,
      changeAmount: Math.round(changeAmount * 100) / 100,
      changePercent: Math.round(changePercent * 10) / 10,
      direction: changeAmount > 0 ? 'up' : changeAmount < 0 ? 'down' : 'same',
    },
  };
}

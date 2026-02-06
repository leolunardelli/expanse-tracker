'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user.id;
}

export async function getAnalyticsData() {
  const userId = await getUserId();
  
  const expenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
    select: { amount: true, category: true, date: true },
  });

  // Category breakdown for pie chart
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(byCategory).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }));

  // Monthly data for bar chart
  const byMonth = expenses.reduce((acc, e) => {
    const month = new Date(e.date).toISOString().slice(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12) // Last 12 months
    .map(([month, amount]) => ({
      month: formatMonth(month),
      amount: Math.round(amount * 100) / 100,
    }));

  // Daily trend for line chart (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentExpenses = expenses.filter(e => new Date(e.date) >= thirtyDaysAgo);
  
  const byDay = recentExpenses.reduce((acc, e) => {
    const day = new Date(e.date).toISOString().slice(0, 10); // YYYY-MM-DD
    acc[day] = (acc[day] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  // Fill in missing days with 0
  const trendData: { date: string; amount: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    trendData.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: Math.round((byDay[dateStr] || 0) * 100) / 100,
    });
  }

  // Monthly comparison
  const currentMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
  
  const currentMonthTotal = byMonth[currentMonth] || 0;
  const lastMonthTotal = byMonth[lastMonth] || 0;
  const monthlyChange = lastMonthTotal > 0 
    ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
    : 0;

  return {
    categoryData,
    monthlyData,
    trendData,
    summary: {
      totalExpenses: expenses.length,
      totalSpent: expenses.reduce((sum, e) => sum + e.amount, 0),
      currentMonthTotal,
      lastMonthTotal,
      monthlyChange: Math.round(monthlyChange * 10) / 10,
      avgPerDay: Math.round((currentMonthTotal / new Date().getDate()) * 100) / 100,
    },
  };
}

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

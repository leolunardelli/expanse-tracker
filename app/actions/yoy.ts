'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user.id;
}

export async function getYearOverYearData() {
  const userId = await getUserId();
  
  const expenses = await prisma.expense.findMany({
    where: { userId },
    select: { amount: true, date: true },
  });

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const previousYear = currentYear - 1;

  const currentYearData: Record<string, number> = {};
  const previousYearData: Record<string, number> = {};

  expenses.forEach(exp => {
    const date = new Date(exp.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    if (year === currentYear) {
      currentYearData[month] = (currentYearData[month] || 0) + exp.amount;
    } else if (year === previousYear) {
      previousYearData[month] = (previousYearData[month] || 0) + exp.amount;
    }
  });

  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const monthFormatter = new Intl.DateTimeFormat(undefined, { month: 'short' });
  const monthNames = months.map((month) => {
    const numericMonth = Number(month) - 1;
    return monthFormatter.format(new Date(Date.UTC(2020, numericMonth, 1)));
  });
  
  const chartData = months.map((month, idx) => ({
    month: monthNames[idx],
    current: Math.round((currentYearData[month] || 0) * 100) / 100,
    previous: Math.round((previousYearData[month] || 0) * 100) / 100,
  }));

  const currentYearTotal = Object.values(currentYearData).reduce((a, b) => a + b, 0);
  const previousYearTotal = Object.values(previousYearData).reduce((a, b) => a + b, 0);
  const difference = currentYearTotal - previousYearTotal;
  const percentChange = previousYearTotal > 0 
    ? Math.round(((difference / previousYearTotal) * 100) * 100) / 100 
    : 0;

  const currentAverage = currentYearTotal / 12;
  const previousAverage = previousYearTotal / 12;

  return {
    chartData,
    currentYearTotal: Math.round(currentYearTotal * 100) / 100,
    previousYearTotal: Math.round(previousYearTotal * 100) / 100,
    difference: Math.round(difference * 100) / 100,
    percentChange,
    currentAverage: Math.round(currentAverage * 100) / 100,
    previousAverage: Math.round(previousAverage * 100) / 100,
    currentYear,
    previousYear,
  };
}

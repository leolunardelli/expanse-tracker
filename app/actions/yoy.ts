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

  // Get current year and previous year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const previousYear = currentYear - 1;

  // Group by month for both years
  const currentYearData: Record<string, number> = {};
  const previousYearData: Record<string, number> = {};

  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const monthKey = month; // Just month for comparison

    if (year === currentYear) {
      currentYearData[monthKey] = (currentYearData[monthKey] || 0) + expense.amount;
    } else if (year === previousYear) {
      previousYearData[monthKey] = (previousYearData[monthKey] || 0) + expense.amount;
    }
  });

  // Create comparison chart data
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const chartData = months.map((month, idx) => ({
    month: monthNames[idx],
    current: Math.round((currentYearData[month] || 0) * 100) / 100,
    previous: Math.round((previousYearData[month] || 0) * 100) / 100,
  }));

  // Calculate totals
  const currentYearTotal = Object.values(currentYearData).reduce((a, b) => a + b, 0);
  const previousYearTotal = Object.values(previousYearData).reduce((a, b) => a + b, 0);
  const difference = currentYearTotal - previousYearTotal;
  const percentChange = previousYearTotal > 0 
    ? Math.round(((difference / previousYearTotal) * 100) * 100) / 100 
    : 0;

  // Calculate average monthly spending
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

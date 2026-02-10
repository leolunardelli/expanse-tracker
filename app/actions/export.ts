'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function exportExpensesAsCSV() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Get all expenses for the user
  const expenses = await prisma.expense.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
  });

  if (expenses.length === 0) {
    throw new Error('No expenses to export');
  }

  // CSV headers
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Recurring', 'Frequency'];

  // Convert expenses to CSV rows
  const rows = expenses.map(expense => {
    const date = new Date(expense.date).toISOString().split('T')[0];
    const amount = expense.amount.toFixed(2);
    const recurring = expense.isRecurring ? 'Yes' : 'No';
    const frequency = expense.recurrenceType || '-';

    return [
      `"${date}"`,
      `"${expense.description.replace(/"/g, '""')}"`, // Escape quotes in description
      `"${expense.category}"`,
      amount,
      recurring,
      frequency,
    ].join(',');
  });

  // Combine headers and rows
  const csv = [headers.join(','), ...rows].join('\n');

  // Create filename with current date
  const today = new Date().toISOString().split('T')[0];
  const filename = `ExpenseFlow_Export_${today}.csv`;

  return { csv, filename };
}

'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function exportExpensesAsCSV() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  const userId = session.user.id;

  const expenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  if (!expenses.length) throw new Error('No data to export');

  const headers = ['Date', 'Description', 'Category', 'Amount', 'Recurring', 'Frequency'];
  const rows = expenses.map(exp => {
    const date = new Date(exp.date).toISOString().split('T')[0];
    return [
      `"${date}"`,
      `"${exp.description.replace(/"/g, '""')}"`,
      `"${exp.category}"`,
      exp.amount.toFixed(2),
      exp.isRecurring ? 'Yes' : 'No',
      exp.recurrenceType || '-',
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const filename = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
  return { csv, filename };
}

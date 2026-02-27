'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { exportFilterSchema } from '@/lib/validation';

type ExportOptions = {
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  format?: 'csv' | 'json';
};

export async function exportExpensesAsCSV(options: ExportOptions = {}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  const userId = session.user.id;

  const parsed = exportFilterSchema.safeParse(options);
  if (!parsed.success) throw new Error('Invalid export filters');

  const { dateFrom, dateTo, category } = parsed.data;
  const where: {
    userId: string;
    category?: string;
    date?: {
      gte?: Date;
      lte?: Date;
    };
  } = { userId };

  if (category && category !== 'all') {
    where.category = category;
  }

  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = new Date(dateFrom);
    if (dateTo) where.date.lte = new Date(`${dateTo}T23:59:59`);
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' },
  });

  if (!expenses.length) throw new Error('No data to export');

  if (parsed.data.format === 'json') {
    const json = JSON.stringify(expenses, null, 2);
    const filename = `expenses_${new Date().toISOString().split('T')[0]}.json`;
    return { csv: json, filename };
  }

  const headers = [
    'Date',
    'Description',
    'Category',
    'Amount',
    'Recurring',
    'Frequency',
    'Tags',
    'Notes',
  ];
  const rows = expenses.map(exp => {
    const date = new Date(exp.date).toISOString().split('T')[0];
    return [
      `"${date}"`,
      `"${exp.description.replace(/"/g, '""')}"`,
      `"${exp.category}"`,
      exp.amount.toFixed(2),
      exp.isRecurring ? 'Yes' : 'No',
      exp.recurrenceType || '-',
      `"${exp.tags.join('|')}"`,
      `"${(exp.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const filename = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
  return { csv, filename };
}

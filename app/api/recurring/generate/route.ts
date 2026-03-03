import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/recurring/generate
 *
 * Auto-generates new expenses for recurring entries that are due.
 * Protected by CRON_SECRET — call from Vercel Cron or external scheduler.
 *
 * Logic per recurring expense:
 *   - Find the most recent non-recurring expense with same description + amount + category + userId
 *   - If none exists, or enough time has elapsed based on recurrenceType, create a new entry
 */
export async function POST(req: Request) {
  // Auth: require CRON_SECRET header or query param
  const secret = req.headers.get('x-cron-secret') || new URL(req.url).searchParams.get('secret');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  // Fetch all recurring templates across all users
  const templates = await prisma.expense.findMany({
    where: { isRecurring: true },
    select: {
      id: true,
      description: true,
      amount: true,
      category: true,
      recurrenceType: true,
      tags: true,
      notes: true,
      userId: true,
    },
  });

  let created = 0;
  let skipped = 0;

  for (const tpl of templates) {
    // Find the most recent generated expense matching this template
    const lastGenerated = await prisma.expense.findFirst({
      where: {
        userId: tpl.userId,
        description: tpl.description,
        amount: tpl.amount,
        category: tpl.category,
        isRecurring: false,
      },
      orderBy: { date: 'desc' },
      select: { date: true },
    });

    const shouldCreate = isDue(tpl.recurrenceType, lastGenerated?.date ?? null, now);

    if (shouldCreate) {
      await prisma.expense.create({
        data: {
          description: tpl.description,
          amount: tpl.amount,
          category: tpl.category,
          date: now,
          isRecurring: false,
          tags: tpl.tags,
          notes: tpl.notes ? `[Auto] ${tpl.notes}` : '[Auto] Recurring',
          userId: tpl.userId,
        },
      });
      created++;
    } else {
      skipped++;
    }
  }

  return NextResponse.json({
    ok: true,
    timestamp: now.toISOString(),
    templates: templates.length,
    created,
    skipped,
  });
}

/** Determine if enough time has elapsed to generate a new expense. */
function isDue(recurrenceType: string | null, lastDate: Date | null, now: Date): boolean {
  if (!lastDate) return true; // never generated → due

  const diffMs = now.getTime() - lastDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  switch (recurrenceType) {
    case 'daily':
      return diffDays >= 1;
    case 'weekly':
      return diffDays >= 7;
    case 'monthly':
      // Due if we've crossed into a new month since last generation
      return (
        lastDate.getMonth() !== now.getMonth() ||
        lastDate.getFullYear() !== now.getFullYear()
      );
    case 'yearly':
      return lastDate.getFullYear() !== now.getFullYear();
    default:
      // Fallback to monthly
      return (
        lastDate.getMonth() !== now.getMonth() ||
        lastDate.getFullYear() !== now.getFullYear()
      );
  }
}

// One-time script to fix recurring expense categories
// Run: npx tsx scripts/fix-categories.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BILLS_DESCRIPTIONS = [
  'Celular - internet',
  'Condomínio',
  'Luz',
  'Internet - Casa',
  'Gás',
];

async function main() {
  // First, show current state
  const before = await prisma.expense.findMany({
    where: {
      description: { in: BILLS_DESCRIPTIONS },
      isRecurring: true,
    },
    select: { id: true, description: true, category: true, amount: true },
  });

  console.log('Before:');
  before.forEach((e) => console.log(`  ${e.description}: ${e.category} (${e.amount})`));

  // Update to Bills
  const result = await prisma.expense.updateMany({
    where: {
      description: { in: BILLS_DESCRIPTIONS },
    },
    data: { category: 'Bills' },
  });

  console.log(`\nUpdated ${result.count} expenses to "Bills"`);

  // Verify
  const after = await prisma.expense.findMany({
    where: {
      description: { in: BILLS_DESCRIPTIONS },
    },
    select: { id: true, description: true, category: true, amount: true },
  });

  console.log('\nAfter:');
  after.forEach((e) => console.log(`  ${e.description}: ${e.category} (${e.amount})`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

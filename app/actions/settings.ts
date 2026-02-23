'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user.id;
}

export async function getUserSettings() {
  const userId = await getUserId();

  // Upsert: return existing or create default settings
  const settings = await prisma.userSettings.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  return settings;
}

export async function updateCurrency(currency: string) {
  const userId = await getUserId();

  const validCurrencies = ['USD', 'EUR', 'GBP', 'BRL', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];
  if (!validCurrencies.includes(currency)) {
    throw new Error('Invalid currency');
  }

  await prisma.userSettings.upsert({
    where: { userId },
    update: { currency },
    create: { userId, currency },
  });

  revalidatePath('/settings');
  revalidatePath('/');
}

export async function updateLanguage(language: string) {
  const userId = await getUserId();

  const validLanguages = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'];
  if (!validLanguages.includes(language)) {
    throw new Error('Invalid language');
  }

  await prisma.userSettings.upsert({
    where: { userId },
    update: { language },
    create: { userId, language },
  });

  revalidatePath('/settings');
}

export async function updateNotificationPrefs(prefs: {
  budgetAlerts?: boolean;
  weeklyReport?: boolean;
  monthlyReport?: boolean;
  aiInsightsEnabled?: boolean;
}) {
  const userId = await getUserId();

  await prisma.userSettings.upsert({
    where: { userId },
    update: prefs,
    create: { userId, ...prefs },
  });

  revalidatePath('/settings');
}

export async function deleteUserAccount() {
  const userId = await getUserId();

  // Delete everything: cascading deletes handle expenses, budgets, settings, sessions, accounts
  await prisma.user.delete({
    where: { id: userId },
  });

  // The user will be logged out automatically since their session is deleted
  revalidatePath('/');
}

export async function getUserProfile() {
  const userId = await getUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          expenses: true,
          budgets: true,
        },
      },
    },
  });

  return user;
}

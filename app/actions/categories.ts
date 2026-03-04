'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getCustomCategories() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return prisma.customCategory.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' },
  });
}

export async function createCustomCategory(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const name = (formData.get('name') as string)?.trim();
  const color = (formData.get('color') as string) || '#91919F';
  const icon = (formData.get('icon') as string) || 'Tag';

  if (!name || name.length < 1 || name.length > 60) {
    return { error: 'Category name is required (max 60 characters)' };
  }

  try {
    const category = await prisma.customCategory.create({
      data: {
        name,
        color,
        icon,
        userId: session.user.id,
      },
    });

    revalidatePath('/');
    revalidatePath('/budget');
    revalidatePath('/planning');
    return { success: true, category };
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'P2002') {
      return { error: 'A category with this name already exists' };
    }
    return { error: 'Failed to create category' };
  }
}

export async function deleteCustomCategory(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.customCategory.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    revalidatePath('/');
    revalidatePath('/budget');
    revalidatePath('/planning');
    return { success: true };
  } catch {
    return { error: 'Failed to delete category' };
  }
}

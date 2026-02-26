'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'An account with this email already exists' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  await prisma.user.create({
    data: {
      name: name || null,
      email,
      password: hashedPassword,
      settings: {
        create: {
          currency: 'BRL',
          language: 'en',
        },
      },
    },
  });

  return { success: true };
}

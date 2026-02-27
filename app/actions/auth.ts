'use server';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = (formData.get('email') as string).trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: 'insensitive',
      },
    },
  });

  const hashedPassword = await bcrypt.hash(password, 12);

  if (existingUser) {
    if (existingUser.password) {
      return { error: 'An account with this email already exists' };
    }

    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: name || existingUser.name,
        password: hashedPassword,
        settings: {
          upsert: {
            create: {
              currency: 'BRL',
              language: 'en',
            },
            update: {},
          },
        },
      },
    });

    return { success: true };
  }

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

export async function requestPasswordReset(formData: FormData) {
  const email = (formData.get('email') as string).trim().toLowerCase();

  if (!email) {
    return { error: 'Email is required' };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: 'insensitive',
      },
    },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true };
  }

  // Delete any existing tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      token,
      expires,
      userId: user.id,
    },
  });

  // Send email
  try {
    await sendPasswordResetEmail(email, token);
  } catch {
    return { error: 'Failed to send reset email. Please try again.' };
  }

  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;

  if (!token || !password) {
    return { error: 'Token and password are required' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }

  // Find valid token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    return { error: 'Invalid or expired reset link' };
  }

  if (resetToken.expires < new Date()) {
    // Clean up expired token
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    return { error: 'Reset link has expired. Please request a new one.' };
  }

  // Hash new password and update user
  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  // Delete used token
  await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

  return { success: true };
}

'use server';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';
import { emailSchema, passwordSchema, registerSchema } from '@/lib/validation';

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid registration data' };
  }

  const name = parsed.data.name;
  const email = parsed.data.email;
  const password = parsed.data.password;

  const signupLimit = checkRateLimit(`signup:${email}`, 5, 10 * 60 * 1000);
  if (!signupLimit.allowed) {
    return { error: 'Too many signup attempts. Please try again in a few minutes.' };
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
  const parsed = emailSchema.safeParse(formData.get('email') as string);

  if (!parsed.success) {
    return { error: 'Email is required' };
  }

  const email = parsed.data;

  const resetLimit = checkRateLimit(`reset-request:${email}`, 5, 10 * 60 * 1000);
  if (!resetLimit.allowed) {
    return { error: 'Too many reset requests. Please try again later.' };
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
  const parsedPassword = passwordSchema.safeParse(formData.get('password') as string);

  if (!token || !parsedPassword.success) {
    return { error: 'Token and password are required' };
  }

  const resetLimit = checkRateLimit(`reset-password:${token}`, 10, 10 * 60 * 1000);
  if (!resetLimit.allowed) {
    return { error: 'Too many attempts. Please request a new reset link.' };
  }

  const password = parsedPassword.data;

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

export async function getSignInMethodHint(emailInput: string) {
  const parsed = emailSchema.safeParse(emailInput);
  if (!parsed.success) {
    return { message: null as string | null };
  }

  const email = parsed.data;
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: 'insensitive',
      },
    },
    select: {
      password: true,
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  });

  if (!user) {
    return { message: null as string | null };
  }

  if (!user.password && user.accounts.length > 0) {
    const provider = user.accounts[0]?.provider;
    if (provider) {
      return {
        message: `This account is linked to ${provider}. Use ${provider} sign-in or set a password on Sign Up.`,
      };
    }
  }

  return { message: null as string | null };
}

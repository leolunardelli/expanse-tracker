'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { resetPassword } from '@/app/actions/auth';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-expense-100 font-medium mb-4">Invalid reset link</p>
        <Link href="/auth/forgot-password" className="btn-primary inline-flex">
          Request New Link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    formData.set('token', token!);
    const result = await resetPassword(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-income-20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-income-100" />
        </div>
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
          Password Reset!
        </h2>
        <p className="text-muted text-sm mb-6">
          Your password has been updated successfully.
        </p>
        <Link href="/auth/signin" className="btn-primary inline-flex">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-expense-20 text-expense-100 rounded-montra-sm text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            minLength={8}
            placeholder="New password (min 8 chars)"
            className="input pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark-900 dark:hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            required
            minLength={8}
            placeholder="Confirm new password"
            className="input pl-10"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-montra bg-violet-100 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
            Reset Password
          </h1>
          <p className="text-muted mt-1">
            Enter your new password below
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-violet-100 border-t-transparent rounded-full" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

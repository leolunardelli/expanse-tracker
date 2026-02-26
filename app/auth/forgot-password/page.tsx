'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { requestPasswordReset } from '@/app/actions/auth';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await requestPasswordReset(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-montra bg-violet-100 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
            Forgot Password
          </h1>
          <p className="text-muted mt-1 text-center">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-income-20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-income-100" />
            </div>
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
              Check your email
            </h2>
            <p className="text-muted text-sm mb-6">
              If an account exists with that email, we&apos;ve sent a password reset link.
            </p>
            <Link href="/auth/signin" className="btn-primary inline-flex">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-expense-20 text-expense-100 rounded-montra-sm text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email address"
                  className="input pl-10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <Link
              href="/auth/signin"
              className="flex items-center justify-center gap-2 mt-6 text-sm text-muted hover:text-dark-900 dark:hover:text-white transition"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

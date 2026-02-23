'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { deleteUserAccount } from '@/app/actions/settings';
import { AlertTriangle, Trash2, Loader2, ShieldAlert } from 'lucide-react';

export default function DangerZone() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const CONFIRM_PHRASE = 'DELETE';

  async function handleDelete() {
    if (confirmText !== CONFIRM_PHRASE) return;

    setLoading(true);
    try {
      await deleteUserAccount();
      signOut({ callbackUrl: '/auth/signin' });
    } catch {
      alert('Failed to delete account. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border-2 border-red-200 dark:border-red-900/50 p-6">
      <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5" />
        Danger Zone
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Irreversible actions that permanently affect your account.
      </p>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      ) : (
        <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-900/30">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                Are you absolutely sure?
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                This will permanently delete your account, all expenses, budgets,
                settings, and AI insights. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-red-700 dark:text-red-300 mb-1">
              Type <span className="font-bold">{CONFIRM_PHRASE}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-red-300 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={confirmText !== CONFIRM_PHRASE || loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete My Account
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                setConfirmText('');
              }}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

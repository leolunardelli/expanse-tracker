'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { deleteUserAccount } from '@/app/actions/settings';
import { AlertTriangle, Trash2, Loader2, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function DangerZone() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const CONFIRM_PHRASE = 'DELETE';

  async function handleDelete() {
    if (confirmText !== CONFIRM_PHRASE) return;

    setLoading(true);
    try {
      await deleteUserAccount();
      signOut({ callbackUrl: '/auth/signin' });
    } catch {
      toast('Failed to delete account. Please try again.', 'error');
      setLoading(false);
    }
  }

  return (
    <div className="card p-6 border-2 !border-expense-100/20 dark:!border-expense-100/10">
      <h2 className="text-base font-semibold text-expense-100 dark:text-expense-60 mb-2 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5" />
        Danger Zone
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Irreversible actions that permanently affect your account.
      </p>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="btn-outline flex items-center gap-2 !text-expense-100 !border-expense-100/30 hover:!bg-expense-100/5"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      ) : (
        <div className="bg-expense-100/5 dark:bg-expense-100/5 rounded-montra-sm p-4 border border-expense-100/20 dark:border-expense-100/10">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-expense-100 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-expense-100 dark:text-expense-60">
                Are you absolutely sure?
              </p>
              <p className="text-xs text-expense-100/80 dark:text-expense-60/80 mt-1">
                This will permanently delete your account, all expenses, budgets,
                settings, and AI insights. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-expense-100 dark:text-expense-60 mb-1">
              Type <span className="font-bold">{CONFIRM_PHRASE}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              className="input text-sm !border-expense-100/30 !focus:ring-expense-100/50"
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={confirmText !== CONFIRM_PHRASE || loading}
              className="btn-danger flex items-center gap-2"
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
              className="btn-outline px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

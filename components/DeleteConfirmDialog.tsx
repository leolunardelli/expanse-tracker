'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  title = 'Delete Transaction',
  message = 'Are you sure you want to delete this transaction? This action cannot be undone.',
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60]" onClick={onCancel}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-dark-800 rounded-montra-lg shadow-xl max-w-sm w-full p-6 animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-expense-20 dark:bg-expense-100/10 flex items-center justify-center">
              <AlertTriangle size={28} className="text-expense-100" />
            </div>
          </div>

          {/* Content */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground text-center leading-relaxed mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-2.5 rounded-montra-md border border-gray-200 dark:border-dark-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-surface-light dark:hover:bg-dark-700 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-montra-md bg-expense-100 text-white font-medium text-sm hover:bg-expense-80 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

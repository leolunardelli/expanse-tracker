import { useEffect } from 'react';

interface ErrorNotificationProps {
  message: string | null;
  onDismiss: () => void;
}

export default function ErrorNotification({
  message,
  onDismiss,
}: ErrorNotificationProps) {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) {
    return null;
  }

  return (
    <div
      className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-start gap-3 max-w-md animate-fadeIn"
      role="alert"
      aria-live="polite"
    >
      {/* Error Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 flex-shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      {/* Message Content */}
      <div className="flex-1">
        <p className="font-medium">Error</p>
        <p className="text-sm text-red-100">{message}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-red-200 hover:text-white transition-colors"
        aria-label="Close error notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

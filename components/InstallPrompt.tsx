'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

type BeforeInstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const install = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 card p-4 z-50 flex items-center gap-3 shadow-lg">
      <div className="p-2 bg-violet-20 dark:bg-violet-100/10 rounded-montra-sm shrink-0">
        <Download className="w-5 h-5 text-violet-100" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">Install ExpenseFlow</p>
        <p className="text-xs text-muted-foreground">Add to home screen for quick access</p>
      </div>
      <button onClick={install} className="btn-primary px-3 py-1.5 text-sm shrink-0">
        Install
      </button>
      <button onClick={() => setDismissed(true)} className="p-1 text-muted-foreground hover:text-gray-600 dark:hover:text-gray-300">
        <X size={16} />
      </button>
    </div>
  );
}

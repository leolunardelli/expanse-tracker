'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import QuickAddFAB from '@/components/QuickAddFAB';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';

type AppShellProps = {
  children: ReactNode;
  userName?: string | null;
  userImage?: string | null;
};

export default function AppShell({ children, userName, userImage }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      {/* Desktop sidebar */}
      <Sidebar userName={userName} userImage={userImage} />

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-montra-sm bg-violet-100 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-lg font-bold text-dark-900 dark:text-white">ExpenseFlow</span>
          </Link>
        </header>

        <div className="p-4 lg:p-8 pb-36 lg:pb-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />

      {/* Quick add floating action button */}
      <QuickAddFAB />

      {/* Keyboard shortcuts handler */}
      <KeyboardShortcuts />
    </div>
  );
}

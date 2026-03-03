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
        <header className="lg:hidden flex items-center justify-center px-4 py-1 bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark">
          <Link href="/">
            <img src="/logo.png" alt="ExpanseFlow" className="w-32 h-32 object-contain" />
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

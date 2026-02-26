'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, ArrowLeftRight, CreditCard, BarChart3, User,
} from 'lucide-react';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/transactions', label: 'Transaction', icon: ArrowLeftRight },
  { href: '/budget', label: 'Budget', icon: CreditCard },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark shadow-bottom-nav safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href ||
            (tab.href !== '/' && pathname.startsWith(tab.href));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg min-w-[56px] transition-colors ${
                isActive
                  ? 'text-violet-100'
                  : 'text-muted hover:text-dark-900 dark:hover:text-white'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

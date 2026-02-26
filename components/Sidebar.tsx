'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Home, ArrowLeftRight, CreditCard, RefreshCw,
  Calculator, BarChart3, FileText, Brain,
  Settings, LogOut,
} from 'lucide-react';
import { Avatar } from '@/components/ui';
import DarkModeToggle from '@/components/DarkModeToggle';

type SidebarProps = {
  userName?: string | null;
  userImage?: string | null;
};

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/budget', label: 'Budget', icon: CreditCard },
  { href: '/recurring', label: 'Recurring', icon: RefreshCw },
  { href: '/planning', label: 'Planning', icon: Calculator },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/insights', label: 'AI Insights', icon: Brain },
];

export default function Sidebar({ userName, userImage }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-card-dark border-r border-border-light dark:border-border-dark h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border-light dark:border-border-dark">
        <div className="w-9 h-9 rounded-montra-sm bg-violet-100 flex items-center justify-center">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <span className="text-xl font-bold text-dark-900 dark:text-white">ExpenseFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-montra-sm text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-violet-20 text-violet-100'
                  : 'text-muted hover:bg-surface-light dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border-light dark:border-border-dark p-3 space-y-1">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-montra-sm text-sm font-medium transition-colors ${
            pathname === '/settings'
              ? 'bg-violet-20 text-violet-100'
              : 'text-muted hover:bg-surface-light dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white'
          }`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>

        <div className="flex items-center justify-between px-3 py-2">
          <DarkModeToggle />
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-montra-sm bg-surface-light dark:bg-dark-700">
          <Avatar src={userImage} name={userName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-dark-900 dark:text-white truncate">
              {userName || 'User'}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="p-1.5 rounded-lg text-muted hover:text-expense-100 hover:bg-expense-20 transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

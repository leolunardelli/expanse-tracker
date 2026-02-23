'use client';

import { signOut } from 'next-auth/react';
import { LogOut, BarChart3, Home, Brain, Target, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DarkModeToggle from './DarkModeToggle';

type HeaderProps = {
  userName?: string | null;
  userImage?: string | null;
};

export default function Header({ userName, userImage }: HeaderProps) {
  const pathname = usePathname();
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow dark:shadow-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold">💰 Expense Tracker</h1>
          <nav className="hidden sm:flex items-center gap-1">
            <Link 
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                pathname === '/' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/budget"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                pathname === '/budget' 
                  ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Target size={18} />
              <span>Budget</span>
            </Link>
            <Link 
              href="/recurring"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                pathname === '/recurring' 
                  ? 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <RefreshCw size={18} />
              <span>Recurring</span>
            </Link>
            <Link 
              href="/analytics"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                pathname === '/analytics' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </Link>
            <Link 
              href="/insights"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                pathname === '/insights' 
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Brain size={18} />
              <span>AI</span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <div className="flex items-center gap-2">
            {userImage && (
              <img src={userImage} alt="avatar" className="w-8 h-8 rounded-full" />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">{userName}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

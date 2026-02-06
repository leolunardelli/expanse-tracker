'use client';

import { signOut } from 'next-auth/react';
import { LogOut, BarChart3, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  userName?: string | null;
  userImage?: string | null;
}

export default function Header({ userName, userImage }: HeaderProps) {
  const pathname = usePathname();
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold">💰 Expense Tracker</h1>
          <nav className="hidden sm:flex items-center gap-1">
            <Link 
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                pathname === '/' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/analytics"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                pathname === '/analytics' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {userImage && (
              <img src={userImage} alt="avatar" className="w-8 h-8 rounded-full" />
            )}
            <span className="text-sm text-gray-600 hidden sm:inline">{userName}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  userName?: string | null;
  userImage?: string | null;
}

export default function Header({ userName, userImage }: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">💰 Expense Tracker</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {userImage && (
              <img src={userImage} alt="avatar" className="w-8 h-8 rounded-full" />
            )}
            <span className="text-sm text-gray-600">{userName}</span>
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

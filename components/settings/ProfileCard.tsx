'use client';

import { useState } from 'react';
import { User, Mail, Calendar, Receipt, Target } from 'lucide-react';

type ProfileCardProps = {
  profile: {
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt: Date | string;
    _count: {
      expenses: number;
      budgets: number;
    };
  };
};

export default function ProfileCard({ profile }: ProfileCardProps) {
  const joinDate = new Date(profile.createdAt);
  const [now] = useState(() => Date.now());
  const daysSinceJoin = Math.floor(
    (now - joinDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-500" />
        Profile
      </h2>

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profile.image ? (
            <img
              src={profile.image}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
              {profile.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {profile.name || 'Anonymous User'}
          </h3>

          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{profile.email || 'No email'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>
                Joined{' '}
                {joinDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
                {daysSinceJoin > 0 && ` (${daysSinceJoin} days ago)`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Receipt className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {profile._count.expenses}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Expenses</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {profile._count.budgets}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Budgets</p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="card p-6">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-violet-100" />
        Profile
      </h2>

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profile.image ? (
            <img
              src={profile.image}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-light-40 dark:border-dark-600"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-violet-60 flex items-center justify-center text-white text-xl font-bold">
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{profile.email || 'No email'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
      <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-light-40 dark:border-dark-600">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-20 dark:bg-violet-100/10 rounded-montra-sm">
            <Receipt className="w-4 h-4 text-violet-100" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {profile._count.expenses}
            </p>
            <p className="text-xs text-muted-foreground">Expenses</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-20 dark:bg-violet-100/10 rounded-montra-sm">
            <Target className="w-4 h-4 text-violet-60" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {profile._count.budgets}
            </p>
            <p className="text-xs text-muted-foreground">Budgets</p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { getAIInsights } from '@/app/actions/ai';
import AIInsights from '@/components/AIInsights';
import { Skeleton } from '@/components/Skeletons';

export default function AsyncAIInsights() {
  const [insights, setInsights] = useState<string | null>(null);

  useEffect(() => {
    getAIInsights().then(setInsights);
  }, []);

  if (!insights) {
    return (
      <div className="card p-4 space-y-3 animate-pulse">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    );
  }

  return <AIInsights insights={insights} />;
}

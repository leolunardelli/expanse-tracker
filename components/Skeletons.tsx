'use client';

/**
 * Reusable skeleton primitives for loading states.
 * Matches the Montra design system's card/rounded styles.
 */

interface SkeletonProps {
  className?: string;
}

/** Generic pulsing line */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-montra-sm bg-gray-200 dark:bg-dark-700 ${className}`}
    />
  );
}

/** Dashboard BalanceCard skeleton */
export function BalanceCardSkeleton() {
  return (
    <div className="rounded-montra-lg bg-gradient-to-br from-violet-100/60 to-violet-80/60 p-6 animate-pulse">
      <div className="h-4 w-28 bg-white/20 rounded mb-2" />
      <div className="h-9 w-44 bg-white/20 rounded mb-6" />
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-montra-md p-3 space-y-2">
          <div className="h-3 w-16 bg-white/20 rounded" />
          <div className="h-5 w-24 bg-white/20 rounded" />
        </div>
        <div className="bg-white/10 rounded-montra-md p-3 space-y-2">
          <div className="h-3 w-16 bg-white/20 rounded" />
          <div className="h-5 w-24 bg-white/20 rounded" />
        </div>
      </div>
      <div className="mt-4 h-2 bg-white/20 rounded-full" />
    </div>
  );
}

/** Stats cards row skeleton (3 cards) */
export function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="h-3 w-16 bg-gray-200 dark:bg-dark-700 rounded mb-3" />
          <div className="h-7 w-20 bg-gray-200 dark:bg-dark-700 rounded" />
        </div>
      ))}
    </div>
  );
}

/** Two-column cards skeleton */
export function TwoColumnSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div key={i} className="card p-5 animate-pulse">
          <div className="h-4 w-36 bg-gray-200 dark:bg-dark-700 rounded mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-dark-700" />
                <div className="flex-1 h-3 bg-gray-200 dark:bg-dark-700 rounded" />
                <div className="w-16 h-3 bg-gray-200 dark:bg-dark-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Transaction list skeleton */
export function TransactionListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card p-6 animate-pulse">
      <div className="h-6 w-32 bg-gray-200 dark:bg-dark-700 rounded mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 border border-gray-100 dark:border-dark-700 rounded-montra-sm"
          >
            <div className="w-10 h-10 rounded-montra-sm bg-gray-200 dark:bg-dark-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-dark-700 rounded" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-dark-700 rounded" />
            </div>
            <div className="h-5 w-20 bg-gray-200 dark:bg-dark-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Chart skeleton */
export function ChartSkeleton({ title }: { title: string }) {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-4 w-40 bg-gray-200 dark:bg-dark-700 rounded mb-4" />
      <div className="flex items-end gap-2 h-[200px] pt-4">
        {[40, 65, 45, 80, 55, 70, 35, 90, 60, 50, 75, 42].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-200 dark:bg-dark-700 rounded-t-sm"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="sr-only">{title}</p>
    </div>
  );
}

/** Full dashboard page skeleton */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <BalanceCardSkeleton />
      <StatsRowSkeleton />
      <Skeleton className="h-24 w-full" />
      <TwoColumnSkeleton />
      <Skeleton className="h-12 w-full" />
      <TransactionListSkeleton />
    </div>
  );
}

/** Analytics page skeleton */
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-32 bg-gray-200 dark:bg-dark-700 rounded animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-3 w-16 bg-gray-200 dark:bg-dark-700 rounded mb-3" />
            <div className="h-7 w-20 bg-gray-200 dark:bg-dark-700 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton title="Category chart" />
        <ChartSkeleton title="Monthly chart" />
      </div>
      <ChartSkeleton title="Trend chart" />
    </div>
  );
}

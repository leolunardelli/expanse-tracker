export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark p-6">
      <div className="card p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          You are offline
        </h1>
        <p className="text-muted-foreground text-sm">
          ExpenseFlow can still show cached pages. Reconnect to sync your latest transactions and insights.
        </p>
      </div>
    </main>
  );
}

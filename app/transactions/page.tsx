import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getFilteredExpenses, getCategories, getTags } from '@/app/actions/expenses';
import AppShell from '@/components/AppShell';
import FilteredExpenseList from '@/components/filters/FilteredExpenseList';
import { authOptions } from '@/lib/auth';

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const [{ expenses, pagination }, categories, availableTags] = await Promise.all([
    getFilteredExpenses({ page: 1, pageSize: 20 }),
    getCategories(),
    getTags(),
  ]);

  return (
    <AppShell userName={session.user?.name} userImage={session.user?.image}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage all your expenses
        </p>
      </div>

      <FilteredExpenseList
        categories={categories}
        availableTags={availableTags}
        initialExpenses={expenses}
        initialPagination={pagination}
      />
    </AppShell>
  );
}

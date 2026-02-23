import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Header from '@/components/Header';
import { Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header userName={session.user?.name} userImage={session.user?.image} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Components will be added here in subsequent commits */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Settings components loading...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getUserSettings, getUserProfile } from '../actions/settings';
import AppShell from '@/components/AppShell';
import ProfileCard from '@/components/settings/ProfileCard';
import CurrencySelect from '@/components/settings/CurrencySelect';
import NotificationPrefs from '@/components/settings/NotificationPrefs';
import ThemePrefs from '@/components/settings/ThemePrefs';
import DangerZone from '@/components/settings/DangerZone';
import { Settings } from 'lucide-react';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const [settings, profile] = await Promise.all([
    getUserSettings(),
    getUserProfile(),
  ]);

  return (
    <AppShell userName={session.user?.name} userImage={session.user?.image}>
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-violet-100 rounded-montra-sm">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
              Settings
            </h1>
            <p className="text-sm text-muted">
              Manage your account and preferences
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          {profile && <ProfileCard profile={profile} />}

          {/* Appearance */}
          <ThemePrefs />

          {/* Regional */}
          <CurrencySelect
            currentCurrency={settings.currency}
            currentLanguage={settings.language}
          />

          {/* Notifications */}
          <NotificationPrefs
            settings={{
              budgetAlerts: settings.budgetAlerts,
              weeklyReport: settings.weeklyReport,
              monthlyReport: settings.monthlyReport,
              aiInsightsEnabled: settings.aiInsightsEnabled,
            }}
          />

          {/* Danger Zone */}
          <DangerZone />
        </div>
      </div>
    </AppShell>
  );
}

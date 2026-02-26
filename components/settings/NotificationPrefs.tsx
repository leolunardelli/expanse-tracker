'use client';

import { useState } from 'react';
import { updateNotificationPrefs } from '@/app/actions/settings';
import { Bell, Loader2, Check } from 'lucide-react';

type NotificationPrefsProps = {
  settings: {
    budgetAlerts: boolean;
    weeklyReport: boolean;
    monthlyReport: boolean;
    aiInsightsEnabled: boolean;
  };
};

type ToggleKey = 'budgetAlerts' | 'weeklyReport' | 'monthlyReport' | 'aiInsightsEnabled';

const toggleOptions: { key: ToggleKey; label: string; description: string }[] = [
  {
    key: 'budgetAlerts',
    label: 'Budget Alerts',
    description: 'Get notified when approaching or exceeding budget limits',
  },
  {
    key: 'weeklyReport',
    label: 'Weekly Report',
    description: 'Receive a weekly summary of your spending',
  },
  {
    key: 'monthlyReport',
    label: 'Monthly Report',
    description: 'Receive a monthly detailed spending report',
  },
  {
    key: 'aiInsightsEnabled',
    label: 'AI Insights',
    description: 'Enable AI-powered spending analysis and recommendations',
  },
];

export default function NotificationPrefs({ settings }: NotificationPrefsProps) {
  const [prefs, setPrefs] = useState(settings);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function handleToggle(key: ToggleKey) {
    const newValue = !prefs[key];
    setPrefs((prev) => ({ ...prev, [key]: newValue }));
    setSaving(key);
    setSaved(null);

    try {
      await updateNotificationPrefs({ [key]: newValue });
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch {
      setPrefs((prev) => ({ ...prev, [key]: !newValue }));
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5 text-warning-100" />
        Notifications & Features
      </h2>

      <div className="space-y-4">
        {toggleOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between py-3 border-b border-light-40 dark:border-dark-600 last:border-0"
          >
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {option.label}
                </p>
                {saving === option.key && (
                  <Loader2 className="w-3 h-3 animate-spin text-violet-100" />
                )}
                {saved === option.key && (
                  <Check className="w-3 h-3 text-income-100" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {option.description}
              </p>
            </div>

            {/* Toggle switch */}
            <button
              onClick={() => handleToggle(option.key)}
              disabled={saving === option.key}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-100/50 focus:ring-offset-2 dark:focus:ring-offset-dark-surface disabled:opacity-50 ${
                prefs[option.key]
                  ? 'bg-violet-100'
                  : 'bg-light-40 dark:bg-dark-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  prefs[option.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

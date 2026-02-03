import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import type { Expense } from '../../types/index';

interface SettingsProps {
  expenses: Expense[];
  onClearAll: () => void;
}

export default function Settings({ expenses, onClearAll }: SettingsProps) {
  const { theme, setTheme } = useTheme();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [currency] = useState('USD');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  const handleExport = () => {
    if (expenses.length === 0) {
      alert('No expenses to export!');
      return;
    }

    let content: string;
    let filename: string;
    let mimeType: string;

    if (exportFormat === 'csv') {
      // Create CSV content
      const headers = ['Date', 'Description', 'Category', 'Amount'];
      const rows = expenses.map((e) => [
        e.date,
        `"${e.description.replace(/"/g, '""')}"`,
        e.category,
        e.amount.toFixed(2),
      ]);
      content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      filename = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    } else {
      // Create JSON content
      content = JSON.stringify(expenses, null, 2);
      filename = `expenses-${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    }

    // Download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    onClearAll();
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">
          Settings
        </h2>
        <p className="text-dark-500 dark:text-dark-400 mt-1">
          Customize your expense tracking experience
        </p>
      </div>

      {/* Appearance */}
      <div className="glass-card-solid p-6">
        <h3 className="text-lg font-display font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Appearance
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
              Theme
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-dark-200 dark:border-dark-700 hover:border-dark-300 dark:hover:border-dark-600'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="font-medium text-dark-900 dark:text-white">Light</span>
                </div>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-dark-200 dark:border-dark-700 hover:border-dark-300 dark:hover:border-dark-600'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span className="font-medium text-dark-900 dark:text-white">Dark</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Currency */}
      <div className="glass-card-solid p-6">
        <h3 className="text-lg font-display font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Currency
        </h3>

        <div className="flex items-center gap-4">
          <select
            value={currency}
            disabled
            className="select-field max-w-xs opacity-60"
          >
            <option value="USD">$ USD - US Dollar</option>
            <option value="EUR">€ EUR - Euro</option>
            <option value="GBP">£ GBP - British Pound</option>
          </select>
          <span className="badge badge-other">Pro Feature</span>
        </div>
      </div>

      {/* Export Data */}
      <div className="glass-card-solid p-6">
        <h3 className="text-lg font-display font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Data
        </h3>

        <p className="text-dark-500 dark:text-dark-400 text-sm mb-4">
          Download your expense data for backup or analysis
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setExportFormat('csv')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                exportFormat === 'csv'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300'
              }`}
            >
              CSV
            </button>
            <button
              onClick={() => setExportFormat('json')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                exportFormat === 'json'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300'
              }`}
            >
              JSON
            </button>
          </div>
          <button
            onClick={handleExport}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export {expenses.length} Expenses
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card-solid p-6 border-2 border-red-200 dark:border-red-900/50">
        <h3 className="text-lg font-display font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Danger Zone
        </h3>

        <p className="text-dark-500 dark:text-dark-400 text-sm mb-4">
          Once you delete your data, there is no going back. Please be certain.
        </p>

        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-6 py-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
          >
            Delete All Expenses
          </button>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm text-dark-700 dark:text-dark-300">
              Are you sure? This will permanently delete {expenses.length} expenses.
            </span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-dark-600 dark:text-dark-300 font-medium hover:bg-dark-200 dark:hover:bg-dark-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* About */}
      <div className="glass-card-solid p-6">
        <h3 className="text-lg font-display font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          About ExpenseFlow
        </h3>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/30">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-dark-900 dark:text-white">ExpenseFlow v1.0.0</p>
            <p className="text-sm text-dark-500 dark:text-dark-400">
              A modern expense tracking application built with React & TypeScript
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

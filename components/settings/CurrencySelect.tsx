'use client';

import { useState } from 'react';
import { updateCurrency, updateLanguage } from '@/app/actions/settings';
import { DollarSign, Globe, Check, Loader2 } from 'lucide-react';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
];

type CurrencySelectProps = {
  currentCurrency: string;
  currentLanguage: string;
};

export default function CurrencySelect({
  currentCurrency,
  currentLanguage,
}: CurrencySelectProps) {
  const [currency, setCurrency] = useState(currentCurrency);
  const [language, setLanguage] = useState(currentLanguage);
  const [savingCurrency, setSavingCurrency] = useState(false);
  const [savingLanguage, setSavingLanguage] = useState(false);
  const [savedCurrency, setSavedCurrency] = useState(false);
  const [savedLanguage, setSavedLanguage] = useState(false);

  async function handleCurrencyChange(newCurrency: string) {
    setCurrency(newCurrency);
    setSavingCurrency(true);
    setSavedCurrency(false);
    try {
      await updateCurrency(newCurrency);
      setSavedCurrency(true);
      setTimeout(() => setSavedCurrency(false), 2000);
    } catch {
      setCurrency(currentCurrency);
    } finally {
      setSavingCurrency(false);
    }
  }

  async function handleLanguageChange(newLanguage: string) {
    setLanguage(newLanguage);
    setSavingLanguage(true);
    setSavedLanguage(false);
    try {
      await updateLanguage(newLanguage);
      setSavedLanguage(true);
      setTimeout(() => setSavedLanguage(false), 2000);
    } catch {
      setLanguage(currentLanguage);
    } finally {
      setSavingLanguage(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-green-500" />
        Regional Settings
      </h2>

      <div className="space-y-5">
        {/* Currency */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="w-4 h-4" />
            Currency
            {savingCurrency && (
              <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
            )}
            {savedCurrency && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
          </label>
          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            disabled={savingCurrency}
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Globe className="w-4 h-4" />
            Language
            {savingLanguage && (
              <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
            )}
            {savedLanguage && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
          </label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={savingLanguage}
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

import type { Metadata, Viewport } from 'next';
import { AuthProvider } from './providers';
import InstallPrompt from '@/components/InstallPrompt';
import './globals.css';

export const metadata: Metadata = {
  title: 'ExpanseFlow',
  description: 'Track your expenses with AI-powered insights',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ExpanseFlow',
  },
};

export const viewport: Viewport = {
  themeColor: '#0D7390',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <AuthProvider>{children}</AuthProvider>
        <InstallPrompt />
      </body>
    </html>
  );
}

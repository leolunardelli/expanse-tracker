import type { Metadata, Viewport } from 'next';
import { AuthProvider } from './providers';
import InstallPrompt from '@/components/InstallPrompt';
import './globals.css';

export const metadata: Metadata = {
  title: 'ExpenseFlow',
  description: 'Track your expenses with AI-powered insights',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ExpenseFlow',
  },
};

export const viewport: Viewport = {
  themeColor: '#3b82f6',
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
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <InstallPrompt />
      </body>
    </html>
  );
}

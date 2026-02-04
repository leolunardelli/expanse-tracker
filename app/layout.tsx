import type { Metadata } from 'next';
import { AuthProvider } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses with AI-powered insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

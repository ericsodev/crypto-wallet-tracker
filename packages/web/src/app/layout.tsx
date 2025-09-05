import './globals.css';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Crypto Tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <SessionProvider refetchOnWindowFocus>
        <body className={inter.className}>{children}</body>
      </SessionProvider>
    </html>
  );
}

import './global.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning className={inter.className}>
      <body className="flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}

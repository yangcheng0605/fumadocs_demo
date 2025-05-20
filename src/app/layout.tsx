import './global.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  // 注意：语言将由[lang]布局组件处理
  return (
    <html suppressHydrationWarning className={inter.className}>
      <body className="flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
} 
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { i18n } from '@/lib/i18n';

export default function RootPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // 只在客户端执行重定向逻辑
    let targetLang = i18n.defaultLanguage;
    
    try {
      const savedLang = localStorage.getItem('fumadocs-lang-preference');
      if (savedLang && i18n.languages.includes(savedLang)) {
        targetLang = savedLang;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    
    router.push(`/${targetLang}/docs`);
  }, [router]);

  // 在客户端挂载前返回空内容，避免服务端/客户端内容不匹配
  if (!mounted) {
    return null;
  }

  // 只在客户端渲染加载动画
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
  );
} 

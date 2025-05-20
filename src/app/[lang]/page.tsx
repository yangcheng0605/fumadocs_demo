'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; 

export default function LangIndexPage() {
  const params = useParams();
  const lang = params.lang as string;
  const router = useRouter();
  
  useEffect(() => {
    // 直接重定向到文档页面
    router.push(`/${lang}/docs`);
  }, [lang, router]);

  // 显示简单的加载状态
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
  );
} 
'use client';

import { useParams } from 'next/navigation';
import { Card as OriginalCard } from 'fumadocs-ui/components/card';

interface CardProps {
  title: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
}

// 国际化动态跳转卡片组件
export function I18nCard({ title, href, description, icon }: CardProps) {
  const params = useParams();
  const lang = params.lang as string || 'en';
  
  const i18nHref = href.startsWith('/') && !href.startsWith(`/${lang}`) 
    ? `/${lang}${href}` 
    : href;

  return (
    <OriginalCard 
      title={title} 
      href={i18nHref} 
      description={description}
      icon={icon}
    />
  );
} 
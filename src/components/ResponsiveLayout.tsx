'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ResponsiveLayoutProps {
  children: ReactNode;
  mobileContent: ReactNode;
}

export function ResponsiveLayout({ children, mobileContent }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkSize = () => {
      setIsMobile(window.innerWidth < 1090);
    };
    
    // 初始检查
    checkSize();
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', checkSize);
    
    // 清理监听器
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // 服务端渲染或客户端初始化之前，返回 null 避免闪烁
  if (!isClient) return null;

  // 根据屏幕尺寸返回相应的内容
  return isMobile ? <>{mobileContent}</> : <>{children}</>;
} 
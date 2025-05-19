'use client';

import { useEffect, useState } from 'react';
import { i18n } from '@/lib/i18n';

export default function RootPage() {
  // 重定向 从 localStorage 读取语言偏好
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedLang = localStorage.getItem('fumadocs-lang-preference');
      const targetLang = savedLang && i18n.languages.includes(savedLang) 
        ? savedLang 
        : i18n.defaultLanguage;
      console.log('Target language for redirect:', targetLang);
      window.location.href = `/${targetLang}/docs`;
    } catch (error) {
      console.error('Error during redirect:', error);
      window.location.href = `/${i18n.defaultLanguage}/docs`;
    }
  }, []);
} 
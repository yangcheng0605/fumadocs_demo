'use client';

import { useEffect } from 'react';

interface LanguageSwitchHandlerProps {
  currentLang: string;
}

const LANG_STORAGE_KEY = 'fumadocs-lang-preference';

export function LanguageSwitchHandler({ currentLang }: LanguageSwitchHandlerProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // 打印当前语言和之前保存的语言
        const previousLang = localStorage.getItem(LANG_STORAGE_KEY);
        console.log(`Saving language preference: ${currentLang} (previous: ${previousLang})`);
        localStorage.setItem(LANG_STORAGE_KEY, currentLang);
      } catch (e) {
        console.error('保存语言偏好失败:', e);
      }
    }
  }, [currentLang]);

  return null;
}
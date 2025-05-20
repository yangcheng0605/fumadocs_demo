import { RootProvider } from 'fumadocs-ui/provider';
import type { Translations } from 'fumadocs-ui/i18n';
import { LanguageSwitchHandler } from '@/components/LanguageSwitchHandler';
import React from 'react';
import '../global.css';
const cn: Partial<Translations> = {
  search: '搜索',
  searchNoResult: '没有找到结果',
  toc: '目录',
  tocNoHeadings: '没有找到目录',
  lastUpdate: '最后更新',
  chooseLanguage: '选择语言',
  nextPage: '下一页',
  previousPage: '上一页',
  chooseTheme: '选择主题',
  editOnGithub: '在 GitHub 上编辑',
  // other translations
};
 
const en: Partial<Translations> = {
  search: 'Search',
  searchNoResult: 'No results found',
  toc: 'Table of Contents',
  tocNoHeadings: 'No headings found',
  lastUpdate: 'Last Updated',
  chooseLanguage: 'Choose Language',
  nextPage: 'Next Page',
  previousPage: 'Previous Page',
  chooseTheme: 'Choose Theme',
  editOnGithub: 'Edit on GitHub',
  // other translations
};
// available languages that will be displayed on UI
// make sure `locale` is consistent with your i18n config
const locales = [
  {
    name: 'English',
    locale: 'en',
  },
  {
    name: '中文',
    locale: 'cn',
  },
];
 
export default function LangLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = React.use(params);
 
  return (
    <RootProvider
      i18n={{
        locale: lang,
        // available languages
        locales,
        // translations for UI
        translations: { en, cn }[lang] || en,
      }}
    >
      <LanguageSwitchHandler currentLang={lang} />
      {children}
    </RootProvider>
  );
}
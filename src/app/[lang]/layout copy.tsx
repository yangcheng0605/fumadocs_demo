import { RootProvider } from 'fumadocs-ui/provider';
import type { Translations } from 'fumadocs-ui/i18n';
import { LanguageSwitchHandler } from '@/components/LanguageSwitchHandler';

const cn: Partial<Translations> = {
  search: '搜索',
  // other translations
};

const en: Partial<Translations> = {
  search: 'Search',
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

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const lang = (await params).lang;

  return (
    <>
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
    </>
  );
}

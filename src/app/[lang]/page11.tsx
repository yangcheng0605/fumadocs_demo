import Link from 'next/link';
import type { ReactNode } from 'react';
import { HomeIcon } from 'lucide-react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/app/[lang]/layout.config';
export default async function HomePage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  return (
    <>
      <HomeLayout {...baseOptions('')}>
        <main className="flex flex-1 flex-col justify-center text-center">
          <h1 className="mb-4 text-2xl font-bold">NXLINK</h1>
          <p className="text-fd-muted-foreground">
            You can open{' '}
            <Link
              href={`/${lang}/docs`}
              className="text-fd-foreground font-semibold underline"
            >
              /docs
            </Link>{' '}
            and see the documentation.
          </p>
        </main>
      </HomeLayout>
    </>
  );
}



import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
// import { GithubInfo } from 'fumadocs-ui/components/github-info';
export default async function Page(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const MDXContent = page.data.body;
  
  return (
    <DocsPage
    toc={page.data.toc} 
    full={page.data.full}  
    tableOfContent={{
      style: 'clerk',
    }}
    footer={{
      enabled: true,
    }}
  >
    <DocsTitle>{page.data.title}</DocsTitle>
    {page.data.description && (
      <DocsDescription>{page.data.description}</DocsDescription>
    )}
    <DocsBody>
      <MDXContent
        components={getMDXComponents({
          // this allows you to link to other pages with relative file paths
          a: createRelativeLink(source, page),
        })}
      />
    </DocsBody>
  </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  return {
    title: page.data.title + ' | NXLINK API',
    description: page.data.description,
  };
}

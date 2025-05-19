import type { ReactNode } from 'react';
import { source } from '@/lib/source';
// import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { baseOptions } from '@/app/[lang]/layout.config';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  return (
      <DocsLayout 
        {...baseOptions(lang)} 
        tree={source.pageTree[lang]}
        sidebar={{
          tabs: {
            transform(option, node) {
              const meta = source.getNodeMeta(node);
              console.log('Sidebar meta:', meta?.data?.icon);
              if (!meta) return option;
              
              // 使用标题作为图片名称
              const icon = meta.data?.icon || '';
              const color = `var(--${meta.file?.dirname || 'docs'}-color, #00a062)`;
              
              return {
                ...option,
                icon: (
                  <div
                    className="rounded-md p-1 shadow-lg ring-2 [&_img]:size-6.5 md:[&_img]:size-5"
                    style={
                      {
                        color,
                        border: `1px solid color-mix(in oklab, ${color} 50%, transparent)`,
                        '--tw-ring-color': `color-mix(in oklab, ${color} 20%, transparent)`,
                      } as object
                    }
                  >
                    <img 
                      src={`/assets/${icon}.png`} 
                      alt={icon}
                      className="w-6 h-6 object-contain" 
                    />
                  </div>
                ),
              };
            },
          },
        }}
      >
        {children}
      </DocsLayout>
  );
}
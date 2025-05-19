import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { createOpenAPI, attachFile } from 'fumadocs-openapi/server';
import { i18n } from '@/lib/i18n';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  i18n,
  // it assigns a URL to your pages
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  // icon处理
  icon(icon) {
    if (!icon) {
      // You may set a default icon
      return;
    }
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
  // openapi
  pageTree: {
    // adds a badge to each page item in page tree
    attachFile,
  },
});
export const openapi = createOpenAPI({
  proxyUrl: '/api/proxy',
});
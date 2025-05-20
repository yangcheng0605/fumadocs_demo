import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { i18n } from '@/lib/i18n';
/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */

// Fumadocs UI layout options
export function baseOptions(locale: string): BaseLayoutProps {
  return {
      i18n,
      nav: {
        title: (
          <>
            <img src="https://nxlink.nxcloud.com/img/newLogo.3677df24.svg" alt="" />
            {/* NXLINK API */}
            {/* <span className="text-sm text-gray-500">v0.0.1</span> */}
          </>
        ), 
        transparentMode: 'top'
      },
      // githubUrl: 'https://github.com/nxtele/nxcloud-doc-en/wiki',
      links: [
        {
          text: 'NXLINK',
          url: 'https://nxlink.nxcloud.com',
          // secondary items will be displayed differently on navbar
        },
      ],
  }
}

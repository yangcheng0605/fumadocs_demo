// import { source } from '@/lib/source';
// import { createSearchAPI } from 'fumadocs-core/search/server';
// import { createTokenizer } from '@orama/tokenizers/mandarin';
// import { stopwords as mandarinStopwords } from '@orama/stopwords/mandarin';
// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     // 只认 en 和 cn，其他一律 fallback 到 en
//     const localeParam = searchParams.get('locale');
//     const mappedLocale = localeParam === 'cn' ? 'mandarin' : 'en';
//     const getPagesLocale = localeParam === 'cn' ? 'cn' : 'en';

//     // 打印调试
//     console.log('请求参数 locale:', localeParam, 'mappedLocale:', mappedLocale);

//     // 只索引当前语言
//     const indexes = source.getPages(getPagesLocale).map((page) => {
//       // 打印调试
//       // console.log('索引页面:', page.title || page.data?.title, 'locale:', mappedLocale);
//       return {
//         id: page.url,
//         title: page.data.title,
//         description: page.data.description || '',
//         url: page.url,
//         structuredData: page.data.structuredData || {},
//         locale: mappedLocale,
//         language: mappedLocale, // 新增
//       };
//     });

//     console.log(indexes[0]);

//     const oramaOptions =
//     mappedLocale === 'mandarin'
//     ? {
//         localeMap: {
//         // you can customise search configs for specific locales, like:
//         // [locale]: Orama options
    
//         cn: {
//           components: {
//             tokenizer: createTokenizer(),
//           },
//           search: {
//             threshold: 0,
//             tolerance: 0,
//           },
//         },
    
//         // use the English tokenizer
//         'custom-locale': 'english',
//       }
//     }
//     : {};

//     // @ts-expect-error
//     const { GET } = createSearchAPI('advanced', {
//       indexes,
//       oramaOptions,
//     });

//     return GET(req);
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.error('Search API error:', e);
//     return new Response(
//       JSON.stringify({ error: String(e), stack: e?.stack }),
//       { status: 500, headers: { 'content-type': 'application/json' } }
//     );
//   }
// }


import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { createTokenizer } from '@orama/tokenizers/mandarin';
 
export const { GET } = createFromSource(source, {
  localeMap: {
 
    cn: {
      components: {
        tokenizer: createTokenizer(),
      },
      search: {
        threshold: 0,
        tolerance: 0,
      },
    },
 
    'custom-locale': 'english',
  },
});
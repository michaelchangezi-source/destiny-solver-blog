import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import { Analytics } from '@vercel/analytics/next'
import { SITE_URL, PERSON_ID, PUBLISHER, personJsonLd } from '@/lib/site'

// 字型唔再經 next/font/google：佢對 Noto CJK 嘅 subsets 參數無效，兩個字族會塞 536 條
// @font-face 落渲染阻塞 CSS（89 KB 壓縮後）＋首載 2.17 MB woff2，係手機效能 55 分嘅主因。
// 現行做法：內文用系統 CJK 字（零下載），標題用 scripts/build_font_subset.py 切出嚟嘅
// 自託管 woff2（見 src/app/fonts.css）。字型堆疊定義喺 globals.css。

export const metadata: Metadata = {
  metadataBase: new URL('https://destinysolver.com'),
  title: {
    default: '命運解決師 陳卓賢｜八字命理深度解析',
    template: '%s｜命運解決師 陳卓賢',
  },
  description:
    '用命理讀懂你這個人：不是預測命運，是認識自己。香港八字命理師陳卓賢，深度解析八字、十神、大運流年，讓命理成為你的自我認識工具。',
  keywords: ['八字命理', '八字', '十神', '大運流年', '命理', '香港命理師', '自我認識'],
  // rel="author" 全站統一指向 /about（作者實體頁），唔好指返首頁：
  // 文章頁本身已指 /about，非文章頁指首頁會令同一作者出兩個作者網址。
  authors: [{ name: '陳卓賢', url: `${SITE_URL}/about` }],
  creator: '陳卓賢',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://destinysolver.com',
    siteName: '命運解決師｜陳卓賢',
    title: '命運解決師｜八字命理深度解析',
    description: '用命理讀懂你這個人：不是預測命運，是認識自己。',
  },
  twitter: {
    card: 'summary_large_image',
    title: '命運解決師｜八字命理深度解析',
    description: '用命理讀懂你這個人：不是預測命運，是認識自己。',
  },
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': `${SITE_URL}/feed.xml` },
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
}

// 瀏覽器頂欄 / iOS 狀態列品牌色
export const viewport: Viewport = {
  themeColor: '#B23E26',
}

// WebSite 實體：作者與出版者一律引用 lib/site 的單一實體，三處 Schema 完全一致。
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: '命運解決師 陳卓賢',
  alternateName: ['命運解決師', 'Destiny Solver', '陳卓賢 命運解決師', '陳卓賢 八字命理'],
  url: SITE_URL,
  description: '用命理讀懂你這個人：不是預測命運，是認識自己。香港八字命理師陳卓賢的命理知識平台。',
  inLanguage: 'zh-TW',
  author: { '@id': PERSON_ID },
  publisher: PUBLISHER,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/articles?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preload" href="/fonts.css" as="style" />
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-component */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='/fonts.css';document.head.appendChild(l);}())`,
          }}
        />
        <noscript dangerouslySetInnerHTML={{ __html: '<link rel="stylesheet" href="/fonts.css">' }} />
        <link rel="alternate" type="text/plain" href="/llms.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="bg-[#F4EEE1] font-sans antialiased min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-[#B23E26] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#FBF7EE] focus:outline-none focus:ring-2 focus:ring-[#FBF7EE]"
        >
          跳至主要內容
        </a>
        <Header />
        <main id="main-content" className="pt-16">{children}</main>
        <Footer />
        <Analytics />
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}

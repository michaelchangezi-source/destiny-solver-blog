import type { Metadata, Viewport } from 'next'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Analytics } from '@vercel/analytics/next'
import { SITE_URL, PERSON, PUBLISHER, personJsonLd } from '@/lib/site'

// 字重收斂到實際大量使用嗰幾級（正文 400／粗體 700／黑體 900）。
// font-medium(500) 僅 8 處次要標籤、font-semibold(600) 一向靠合成（站已如此運作且觀感良好），
// 維持合成可少載一個 CJK 字重切片組。next/font 本身已按 unicode-range 切片＋display:swap，
// 首屏文字即時以系統字頂上、唔等字體（已過「webfont load 期間文字可見」）。
const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-noto',
  display: 'swap',
})

const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-noto-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://destiny-solver-blog.vercel.app'),
  title: {
    default: '命運解決師 陳卓賢｜八字命理深度解析',
    template: '%s｜命運解決師 陳卓賢',
  },
  description:
    '用命理讀懂你這個人：不是預測命運，是認識自己。香港八字命理師陳卓賢，深度解析八字、十神、大運流年，讓命理成為你的自我認識工具。',
  keywords: ['八字命理', '八字', '十神', '大運流年', '命理', '香港命理師', '自我認識'],
  authors: [{ name: '陳卓賢', url: 'https://destiny-solver-blog.vercel.app' }],
  creator: '陳卓賢',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://destiny-solver-blog.vercel.app',
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
  author: PERSON,
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
    <html lang="zh-TW" className={`${notoSansTC.variable} ${notoSerifTC.variable}`}>
      <head>
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
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}

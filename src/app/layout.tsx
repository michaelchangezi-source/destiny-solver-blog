import type { Metadata } from 'next'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Analytics } from '@vercel/analytics/next'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
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
  title: {
    default: '命運解決師｜八字命理深度解析',
    template: '%s｜命運解決師',
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
  robots: { index: true, follow: true },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '命運解決師｜陳卓賢',
  alternateName: ['命運解決師', 'Destiny Solver', 'destinysolver'],
  url: 'https://destiny-solver-blog.vercel.app',
  description: '用命理讀懂你這個人：不是預測命運，是認識自己。香港八字命理師陳卓賢的命理知識平台。',
  inLanguage: 'zh-TW',
  author: {
    '@type': 'Person',
    name: '陳卓賢',
    image: 'https://destiny-solver-blog.vercel.app/images/avatar.png',
    url: 'https://destiny-solver-blog.vercel.app/about',
    sameAs: [
      'https://www.threads.com/@destiny.solver',
      'https://www.instagram.com/destiny.solver',
    ],
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://destiny-solver-blog.vercel.app/articles?q={search_term_string}',
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

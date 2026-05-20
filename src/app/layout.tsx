import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto',
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
  authors: [{ name: '陳卓賢', url: 'https://destinysolver.com' }],
  creator: '陳卓賢',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://destinysolver.com',
    siteName: '命運解決師',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={notoSansTC.variable}>
      <body className="bg-[#0F0F2D] font-sans antialiased min-h-screen">
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

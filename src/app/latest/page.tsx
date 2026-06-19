import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getLatestArticles } from '@/lib/articles'
import LatestCard from '@/components/blog/LatestCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '最新文章',
  description: '每週更新的命理新文章，涵蓋兩性、職場與八字基礎，附原創配圖。',
  alternates: { canonical: 'https://destiny-solver-blog.vercel.app/latest' },
}

export default function LatestPage() {
  const articles = getLatestArticles()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[#B23E26] text-xs font-semibold tracking-[0.3em] uppercase mb-2">LATEST</p>
        <h1 className="font-serif text-[#2B241C] text-3xl sm:text-4xl font-black mb-3">最新文章</h1>
        <p className="text-[#5A5247] text-sm leading-relaxed max-w-xl">
          每週更新的命理短文，從兩性、職場到八字基礎，附原創配圖。想看系統教學，可前往
          <Link href="/categories" className="text-[#B23E26] hover:underline mx-1">學習路徑</Link>。
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <LatestCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="border border-[#2B241C]/10 rounded-md p-12 text-center bg-[#FBF7EE]">
          <p className="text-[#6B6155] mb-5">新文章準備中，每週更新。先從系統學習路徑開始。</p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-[#B23E26] hover:bg-[#96321E] text-[#F7F1E5] font-bold px-6 py-3 rounded transition-colors text-sm"
          >
            前往學習路徑 <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  )
}

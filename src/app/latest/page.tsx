import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getLatestArticles } from '@/lib/articles'
import LatestCard from '@/components/blog/LatestCard'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '最新文章',
  description: '每週更新的命理新文章，涵蓋兩性、職場與八字基礎，附原創配圖。',
  alternates: { canonical: 'https://www.destinysolver.com/latest' },
}

export default function LatestPage() {
  const articles = getLatestArticles()

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '最新文章',
    url: `${SITE_URL}/latest`,
    description: '每週更新的命理新文章，涵蓋兩性、職場與八字基礎，附原創配圖。',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/articles/${a.slug}`,
        name: a.title,
      })),
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '最新文章', item: `${SITE_URL}/latest` },
    ],
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
        <>
          <h2 className="sr-only">最新文章列表</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <LatestCard key={article.slug} article={article} priority={i < 2} />
            ))}
          </div>
        </>
      ) : (
        <div className="border border-[color:var(--border-card)] shadow-[var(--shadow-card)] rounded-md p-12 text-center bg-[#FBF7EE]">
          <p className="text-[#6B6155] mb-5">新文章準備中，每週更新。先從系統學習路徑開始。</p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-[#E0552C] hover:bg-[#C9461F] text-[#F7F1E5] font-bold px-6 py-3 rounded transition-colors text-sm"
          >
            前往學習路徑 <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  )
}

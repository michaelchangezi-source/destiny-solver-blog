import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getLatestArticles, getTopicArticles } from '@/lib/articles'
import LatestCard from '@/components/blog/LatestCard'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const revalidate = false

export const metadata = buildMetadata({
  title: '最新文章',
  description: '每週更新的命理新文章，涵蓋兩性、職場與八字基礎，附原創配圖。另設命理教學系列，從十天干到大運格局系統學八字。',
  path: '/latest',
})

export default function LatestPage() {
  const articles = getLatestArticles()
  const topics = getTopicArticles()

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '最新文章',
    url: `${SITE_URL}/latest`,
    description: '每週更新的命理新文章，涵蓋兩性、職場與八字基礎，附原創配圖。另設命理教學系列，從十天干到大運格局系統學八字。',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        ...topics.map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/articles/${a.slug}`,
          name: a.title,
        })),
        ...articles.map((a, i) => ({
          '@type': 'ListItem',
          position: topics.length + i + 1,
          url: `${SITE_URL}/articles/${a.slug}`,
          name: a.title,
        })),
      ],
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
          每週更新的命理短文，從兩性、職場到八字基礎，附原創配圖。<br />
          想看系統教學，可前往
          <Link href="/categories" className="text-[#B23E26] hover:underline mx-1">學習路徑</Link>。
        </p>
      </div>

      {/* ── 命理教學總覽 ── */}
      {topics.length > 0 && (
        <section id="教學" className="mb-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-1">LEARN</p>
              <h2 className="font-serif text-[#2B241C] text-2xl font-bold">命理教學總覽</h2>
            </div>
            <span className="text-[#8A8071] text-sm">{topics.length} 篇</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic, index) => {
              const num = String(index + 1).padStart(2, '0')
              return (
                <Link
                  key={topic.slug}
                  href={`/articles/${topic.slug}`}
                  className="group flex gap-4 rounded-lg border border-[color:var(--border-card)] bg-[#FBF7EE] hover:border-[#B23E26]/40 hover:shadow-[0_2px_12px_rgba(178,62,38,0.08)] p-4 transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#B23E26]/[0.08] flex items-center justify-center">
                    <span className="text-[#B23E26] text-xs font-bold font-serif">{num}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#B23E26] font-semibold tracking-widest mb-1">{topic.category}</p>
                    <p className="text-[#2B241C] text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[#B23E26] transition-colors">
                      {topic.title}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── 最新文章列表 ── */}
      {articles.length > 0 ? (
        <>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-1">ARTICLES</p>
              <h2 className="font-serif text-[#2B241C] text-2xl font-bold">每週新文</h2>
            </div>
          </div>
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

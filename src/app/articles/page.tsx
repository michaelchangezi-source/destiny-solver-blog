import type { Metadata } from 'next'
import { getAllArticles, getAllCategories } from '@/lib/articles'
import ArticleCard from '@/components/blog/ArticleCard'
import CategoryBadge from '@/components/ui/CategoryBadge'

export const metadata: Metadata = {
  title: '所有文章',
  description: '八字命理深度文章：干支、十神、大運流年、格局分析，系統性學習八字命理。',
}

export default function ArticlesPage() {
  const articles = getAllArticles()
  const categories = getAllCategories()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.35em] uppercase mb-3">ARTICLES</p>
        <h1 className="font-serif text-white text-4xl font-black mb-4">所有文章</h1>
        <p className="text-white/45 text-lg">
          共 {articles.length} 篇深度命理文章，從基礎到進階系統學習。
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <CategoryBadge key={cat} category={cat} linkable />
          ))}
        </div>
      )}

      {/* Article grid */}
      {articles.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-lg">文章準備中，敬請期待。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article, i) => (
            <ArticleCard key={article.slug} article={article} featured index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

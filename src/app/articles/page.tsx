import type { Metadata } from 'next'
import { getAllArticles, getAllCategories } from '@/lib/articles'
import ArticleFilter from '@/components/blog/ArticleFilter'

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
      <div className="mb-10">
        <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.35em] uppercase mb-3">ARTICLES</p>
        <h1 className="font-serif text-white text-4xl font-black mb-3">所有文章</h1>
        <p className="text-white/45">共 {articles.length} 篇深度命理文章，從基礎到進階系統學習。</p>
      </div>

      <ArticleFilter articles={articles} categories={categories} />
    </div>
  )
}

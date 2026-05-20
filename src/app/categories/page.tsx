import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles, getAllCategories } from '@/lib/articles'
import { CATEGORY_COLORS, CATEGORY_SLUGS } from '@/types'

export const metadata: Metadata = {
  title: '文章分類',
  description: '按主題瀏覽八字命理文章：干支、十神、大運流年、感情事業等。',
}

export default function CategoriesPage() {
  const articles = getAllArticles()
  const categories = getAllCategories()

  const stats = categories.map((cat) => ({
    name: cat,
    count: articles.filter((a) => a.category === cat).length,
    color: CATEGORY_COLORS[cat] ?? 'bg-gray-100 text-gray-800',
  }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <p className="text-[#C9A84C] text-sm font-semibold tracking-widest mb-3">CATEGORIES</p>
        <h1 className="text-white text-4xl font-black mb-4">文章分類</h1>
        <p className="text-white/50">按主題選擇你感興趣的命理方向</p>
      </div>

      {stats.length === 0 ? (
        <p className="text-white/30 text-center py-20">文章準備中，敬請期待。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((cat) => (
            <Link
              key={cat.name}
              href={`/categories/${CATEGORY_SLUGS[cat.name] ?? cat.name}`}
              className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#C9A84C]/40 rounded-2xl p-6 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${cat.color}`}>
                  {cat.name}
                </span>
                <span className="text-white/30 text-sm">{cat.count} 篇</span>
              </div>
              <p className="text-white/50 text-sm group-hover:text-white/70 transition-colors">
                瀏覽所有「{cat.name}」文章 →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

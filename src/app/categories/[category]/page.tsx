import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getArticlesByCategory, getAllCategories } from '@/lib/articles'
import ArticleCard from '@/components/blog/ArticleCard'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({ category: encodeURIComponent(category) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const decoded = decodeURIComponent(category)
  return {
    title: decoded,
    description: `所有關於「${decoded}」的八字命理深度文章。`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const decoded = decodeURIComponent(category)
  const articles = getArticlesByCategory(decoded)

  if (articles.length === 0) notFound()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-white/40 hover:text-[#C9A84C] text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> 返回分類列表
      </Link>

      <div className="mb-10">
        <p className="text-[#C9A84C] text-sm font-semibold tracking-widest mb-3">分類</p>
        <h1 className="text-white text-4xl font-black mb-3">{decoded}</h1>
        <p className="text-white/40">共 {articles.length} 篇文章</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} featured />
        ))}
      </div>
    </div>
  )
}

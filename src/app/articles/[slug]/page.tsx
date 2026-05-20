import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import { getArticleBySlug, getArticleSlugs, getRelatedArticles } from '@/lib/articles'
import { formatDate } from '@/lib/utils'
import { CATEGORY_COLORS } from '@/types'
import ArticleBody from '@/components/blog/ArticleBody'
import ArticleCard from '@/components/blog/ArticleCard'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage }],
    },
  }
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(markdown)
  return result.toString()
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const html = await markdownToHtml(article.content)
  const related = getRelatedArticles(slug, article.category, 3)
  const categoryColor = CATEGORY_COLORS[article.category] ?? 'bg-gray-100 text-gray-800'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-white/40 hover:text-[#C9A84C] text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> 返回文章列表
      </Link>

      {/* Cover */}
      {article.coverImage && (
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F2D]/80 to-transparent" />
        </div>
      )}

      {/* Meta */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${categoryColor}`}>
          {article.category}
        </span>
        <span className="flex items-center gap-1 text-white/40 text-sm">
          <Clock size={13} /> {article.readingTime}
        </span>
        <span className="flex items-center gap-1 text-white/40 text-sm">
          <Calendar size={13} /> {formatDate(article.publishedAt)}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-white text-3xl sm:text-4xl font-black leading-tight mb-4">
        {article.title}
      </h1>
      {article.excerpt && (
        <p className="text-white/50 text-lg leading-relaxed mb-8 pb-8 border-b border-white/10">
          {article.excerpt}
        </p>
      )}

      {/* Body */}
      <ArticleBody html={html} />

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/10">
          <Tag size={14} className="text-white/30 self-center" />
          {article.tags.map((tag) => (
            <span key={tag} className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Consultation CTA */}
      <div className="mt-12 bg-gradient-to-br from-[#C9A84C]/15 to-transparent border border-[#C9A84C]/25 rounded-2xl p-6 text-center">
        <p className="text-white font-bold mb-2">想深入了解你的命盤？</p>
        <p className="text-white/50 text-sm mb-4">預約一對一命理諮詢，解讀你的八字格局與人生時機。</p>
        <Link
          href="/consultation"
          className="inline-block bg-[#C9A84C] hover:bg-[#B8963B] text-[#0F0F2D] font-bold px-6 py-3 rounded-full transition-colors text-sm"
        >
          預約諮詢
        </Link>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-white text-xl font-bold mb-6">相關文章</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} featured />
            ))}
          </div>
        </div>
      )}
    </article>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight } from 'lucide-react'
import { getArticleBySlug, getArticleSlugs, getRelatedArticles } from '@/lib/articles'
import { formatDate } from '@/lib/utils'
import { CATEGORY_COLORS, CATEGORY_SLUGS } from '@/types'
import ArticleBody from '@/components/blog/ArticleBody'
import ArticleCard from '@/components/blog/ArticleCard'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

const BASE_URL = 'https://destiny-solver-blog.vercel.app'

/** 從 Markdown 子標題自動提取 Q&A 配對，供 FAQPage Schema 使用 */
function extractFaqPairs(markdown: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = []
  const lines = markdown.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // 只取 ###、####、##### 層級（小節標題）
    const headingMatch = line.match(/^#{3,6}\s+(.+)$/)
    if (!headingMatch) continue

    // 清除中文序號（一、二、）和數字序號（1. 2.）
    let question = headingMatch[1]
      .replace(/^[一二三四五六七八九十百]+[、．.]\s*/, '')
      .replace(/^\d+[、．.]\s*/, '')
      .replace(/##+\s*/, '')
      .trim()

    if (!question.endsWith('？') && !question.endsWith('?')) {
      question += '？'
    }

    // 收集緊跟的段落文字作為答案（跳過表格和空行）
    let answer = ''
    let j = i + 1
    while (j < lines.length && !lines[j].match(/^#{2,6}\s/)) {
      const t = lines[j].trim()
      if (t && !t.startsWith('|') && !t.startsWith('-') && !t.startsWith('#')) {
        answer += t + ' '
        if (answer.length > 280) break
      }
      j++
    }

    answer = answer.trim().replace(/\s+/g, ' ')
    if (question.length > 4 && answer.length > 20) {
      faqs.push({ question, answer: answer.slice(0, 350) })
    }
  }

  return faqs.slice(0, 5) // 每篇最多 5 個 FAQ
}

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
  const faqPairs = extractFaqPairs(article.content)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: '文章', item: `${BASE_URL}/articles` },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.category,
        item: `${BASE_URL}/categories/${CATEGORY_SLUGS[article.category] ?? article.category}`,
      },
      { '@type': 'ListItem', position: 4, name: article.title, item: `${BASE_URL}/articles/${article.slug}` },
    ],
  }

  const faqJsonLd =
    faqPairs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqPairs.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        }
      : null

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage
      ? [`https://destiny-solver-blog.vercel.app${article.coverImage}`]
      : ['https://destiny-solver-blog.vercel.app/images/og-default.png'],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    url: `https://destiny-solver-blog.vercel.app/articles/${article.slug}`,
    inLanguage: 'zh-TW',
    author: {
      '@type': 'Person',
      name: '陳卓賢',
      url: 'https://destiny-solver-blog.vercel.app/about',
    },
    publisher: {
      '@type': 'Person',
      name: '陳卓賢',
      url: 'https://destiny-solver-blog.vercel.app',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://destiny-solver-blog.vercel.app/articles/${article.slug}`,
    },
    keywords: article.tags.join(', '),
    articleSection: article.category,
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-white/35 mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#C9A84C] transition-colors">首頁</Link>
        <ChevronRight size={12} />
        <Link href="/articles" className="hover:text-[#C9A84C] transition-colors">文章</Link>
        <ChevronRight size={12} />
        <Link
          href={`/categories/${CATEGORY_SLUGS[article.category] ?? article.category}`}
          className="hover:text-[#C9A84C] transition-colors"
        >
          {article.category}
        </Link>
        <ChevronRight size={12} />
        <span className="text-white/55 truncate max-w-[180px] sm:max-w-xs">{article.title}</span>
      </nav>

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

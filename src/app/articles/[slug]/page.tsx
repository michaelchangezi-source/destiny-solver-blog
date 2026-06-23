import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Calendar, Tag, ChevronRight } from 'lucide-react'
import { getArticleBySlug, getArticleSlugs, getRelatedArticles } from '@/lib/articles'
import { formatDate } from '@/lib/utils'
import { CATEGORY_SLUGS } from '@/types'
import ArticleBody from '@/components/blog/ArticleBody'
import ArticleCard from '@/components/blog/ArticleCard'
import CopyAttribution from '@/components/blog/CopyAttribution'
import AuthorBio from '@/components/blog/AuthorBio'
import ReadingProgress from '@/components/blog/ReadingProgress'
import TableOfContents from '@/components/blog/TableOfContents'
import SubscribeForm from '@/components/SubscribeForm'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { PERSON, PUBLISHER } from '@/lib/site'

const BASE_URL = 'https://destiny-solver-blog.vercel.app'

/** 清除 Markdown 行內格式，還原為純文字 */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')   // 粗體
    .replace(/\*(.*?)\*/g, '$1')        // 斜體
    .replace(/`(.*?)`/g, '$1')          // 行內程式碼
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 連結
    .replace(/~~(.*?)~~/g, '$1')        // 刪除線
    .trim()
}

/**
 * 從 Markdown 子標題自動提取 Q&A 配對
 * 同時供 FAQPage Schema（JSON-LD）與頁面可見 FAQ 區塊使用
 * 策略：取 ###～###### 層級標題為問題，緊跟的段落文字為答案
 */
function extractFaqPairs(markdown: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = []
  const lines = markdown.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const headingMatch = line.match(/^#{3,6}\s+(.+)$/)
    if (!headingMatch) continue

    // 清除中文序號（一、二、）、數字序號（1. 2.）、多餘 # 符號
    let question = headingMatch[1]
      .replace(/^[一二三四五六七八九十百千]+[、．.]\s*/, '')
      .replace(/^\d+[、．.]\s*/, '')
      .replace(/##+\s*/, '')
      .replace(/\*\*/g, '')  // 移除粗體標記
      .trim()

    // 太短或只剩標點符號的跳過
    if (question.length < 5) continue

    // 補上問號
    if (!question.endsWith('？') && !question.endsWith('?')) {
      question += '？'
    }

    // 收集緊跟的段落文字作為答案
    // 包含普通段落與 markdown 列表項（- 開頭），跳過表格行（| 開頭）
    let answer = ''
    let j = i + 1
    while (j < lines.length && !lines[j].match(/^#{2,6}\s/)) {
      const raw = lines[j].trim()
      if (!raw || raw.startsWith('|') || raw.startsWith('#')) {
        j++
        continue
      }
      // 列表項去除前綴「- 」或「* 」
      const t = stripMarkdown(raw.replace(/^[-*]\s+/, ''))
      if (t) {
        answer += t + ' '
        if (answer.length > 320) break
      }
      j++
    }

    answer = answer.trim().replace(/\s+/g, ' ')
    if (answer.length > 20) {
      faqs.push({ question, answer: answer.slice(0, 420) })
    }
  }

  return faqs.slice(0, 6) // 每篇最多 6 個 FAQ
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
  const url = `/articles/${article.slug}`
  const metaDescription = article.description || article.excerpt
  return {
    title: article.title,
    description: metaDescription,
    keywords: article.tags,
    authors: [{ name: '陳卓賢', url: `${BASE_URL}/about` }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: metaDescription,
      siteName: '命運解決師｜陳卓賢',
      locale: 'zh_TW',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [`${BASE_URL}/about`],
      section: article.category,
      tags: article.tags,
      images: [{ url: article.coverImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: metaDescription,
      images: [article.coverImage],
    },
  }
}

/**
 * 標題層級正規化（D3 無障礙 + A4 語意結構）。
 * 部分教學文正文最高只用 #### / ##### / ######（甚至先出深層 #### 才出 ###），
 * 頁面 H1（標題）之後直接跳 h3/h4，觸發 Lighthouse
 * 「Heading elements are not in a sequentially-descending order」。
 * 用「相對深度」棧式重映射：按文件次序逐個標題，依巢狀深度重新編級，
 * 正文一律由 h2 起、逐級只降一階，無論原文層級點亂都保證唔跳級；
 * 同時把教學文變成有真子標題的結構，順帶啟用 sticky 目錄。
 */
function normalizeHeadings(html: string): string {
  const stack: number[] = []
  return html.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (_m, lvl: string, attrs: string, inner: string) => {
    const L = Number(lvl)
    while (stack.length && stack[stack.length - 1] >= L) stack.pop()
    const assigned = Math.min(6, stack.length + 2)
    stack.push(L)
    return `<h${assigned}${attrs}>${inner}</h${assigned}>`
  })
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(markdown)
  return normalizeHeadings(result.toString())
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const html = await markdownToHtml(article.content)
  const related = getRelatedArticles(slug, article.category, 3)
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
    description: article.description || article.excerpt,
    image: article.coverImage
      ? [`https://destiny-solver-blog.vercel.app${article.coverImage}`]
      : ['https://destiny-solver-blog.vercel.app/images/og-default.png'],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    url: `https://destiny-solver-blog.vercel.app/articles/${article.slug}`,
    inLanguage: 'zh-TW',
    author: PERSON,
    publisher: PUBLISHER,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://destiny-solver-blog.vercel.app/articles/${article.slug}`,
    },
    keywords: article.tags.join(', '),
    articleSection: article.category,
  }

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-4xl xl:max-w-6xl xl:flex xl:justify-center xl:gap-12 px-4 sm:px-6">
        <article className="w-full max-w-4xl py-12">
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

      <CopyAttribution title={article.title} path={`/articles/${article.slug}`} />

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-[#6B6155] mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#B23E26] transition-colors">首頁</Link>
        <ChevronRight size={12} />
        <Link href="/articles" className="hover:text-[#B23E26] transition-colors">文章</Link>
        <ChevronRight size={12} />
        <Link
          href={`/categories/${CATEGORY_SLUGS[article.category] ?? article.category}`}
          className="hover:text-[#B23E26] transition-colors"
        >
          {article.category}
        </Link>
        <ChevronRight size={12} />
        <span className="text-[#6B6155] truncate max-w-[180px] sm:max-w-xs">{article.title}</span>
      </nav>

      {/* Cover — 每週帖文顯示真實配圖，教學系列顯示字形 banner */}
      {(() => {
        const hasRealCover = article.slug.startsWith('post-') && !!article.coverImage && !article.coverImage.includes('default')
        if (hasRealCover) {
          return (
            <div className="relative w-full aspect-[2/1] rounded-md overflow-hidden mb-8 bg-[#1E1A15] border border-[#2B241C]/10">
              {/* aspect-[2/1] 對齊 IG 封面的中央文字安全區，object-center 確保不切字 */}
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover object-center"
              />
            </div>
          )
        }
        const glyph = ({ '八字基礎':'甲','干支詳解':'子','十神應用':'祿','命盤格局':'局','實戰斷命':'斷','大運流年':'運','感情格局':'情','事業財運':'財','健康命理':'壽','風水地理':'風' } as Record<string,string>)[article.category] ?? '命'
        const seq = article.slug.match(/^topic-(\d+)/)?.[1]?.padStart(2,'0')
        return (
          <div className="relative w-full h-40 sm:h-52 rounded-md overflow-hidden mb-8 bg-[#FBF7EE] border border-[#2B241C]/10 flex items-center justify-center">
            <span className="absolute text-[200px] font-black text-[#2B241C]/[0.03] leading-none select-none">{glyph}</span>
            <span className="text-[100px] sm:text-[130px] font-black text-[#B23E26]/70 leading-none select-none">{glyph}</span>
            {seq && <span className="absolute top-4 left-5 text-[#6B6155] text-xs font-mono tracking-widest">{seq}</span>}
            <span className="absolute bottom-4 right-5 text-[#6B6155] text-xs tracking-wider">{article.category}</span>
          </div>
        )
      })()}

      {/* Meta */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-xs px-2.5 py-1 rounded border border-[#2B241C]/15 text-[#6B6155]">
          {article.category}
        </span>
        <span className="flex items-center gap-1 text-[#6B6155] text-sm">
          <Clock size={13} /> {article.readingTime}
        </span>
        <span className="flex items-center gap-1 text-[#6B6155] text-sm">
          <Calendar size={13} /> {formatDate(article.publishedAt)}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-[#2B241C] text-3xl sm:text-4xl font-black leading-tight mb-4">
        {article.title}
      </h1>
      {article.excerpt && (
        <p className="text-[#6B6155] text-lg leading-relaxed mb-8 pb-8 border-b border-[#2B241C]/10">
          {article.excerpt}
        </p>
      )}

      {/* Body */}
      <div id="article-content">
        <ArticleBody html={html} />
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-[#2B241C]/10">
          <Tag size={14} className="text-[#6B6155] self-center" />
          {article.tags.map((tag) => (
            <span key={tag} className="text-xs text-[#6B6155] bg-[#2B241C]/[0.05] px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* FAQ Section — visible Q&A aligned with FAQPage Schema */}
      {faqPairs.length > 0 && (
        <section aria-label="本文重點解答" className="mt-12 pt-10 border-t border-[#2B241C]/10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <span className="w-1 h-7 rounded-full bg-[#B23E26] shrink-0" aria-hidden="true" />
            <h2 className="text-[#2B241C] text-xl font-bold">本文重點解答</h2>
            <span className="text-[#6B6155] text-sm font-normal tracking-wide">FAQ</span>
          </div>

          {/* Q&A Cards */}
          <div className="space-y-3">
            {faqPairs.map(({ question, answer }, idx) => (
              <div
                key={idx}
                className="rounded border border-[#2B241C]/10 bg-[#FBF7EE]/[0.03] hover:bg-[#FBF7EE]/[0.05] transition-colors duration-200 p-5"
              >
                {/* Question */}
                <p className="flex items-start gap-3 mb-3">
                  <span
                    className="shrink-0 mt-0.5 w-5 h-5 rounded bg-[#B23E26]/20 text-[#B23E26] text-[10px] font-black flex items-center justify-center leading-none select-none"
                    aria-label="問題"
                  >
                    Q
                  </span>
                  <span className="text-[#2B241C] font-semibold text-sm leading-snug">{question}</span>
                </p>
                {/* Answer */}
                <p className="flex items-start gap-3">
                  <span
                    className="shrink-0 mt-0.5 w-5 h-5 rounded bg-[#FBF7EE]/[0.06] text-[#8A8071] text-[10px] font-bold flex items-center justify-center leading-none select-none"
                    aria-label="答案"
                  >
                    A
                  </span>
                  <span className="text-[#5A5247] text-sm leading-relaxed">{answer}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 關於作者（B1 / E-E-A-T） */}
      <AuthorBio />

      {/* Consultation CTA */}
      <div className="mt-12 bg-gradient-to-br from-[#B23E26]/15 to-transparent border border-[#B23E26]/25 rounded p-6 text-center">
        <p className="text-[#2B241C] font-bold mb-2">想深入了解你的命盤？</p>
        <p className="text-[#6B6155] text-sm mb-4">預約一對一命理諮詢，解讀你的八字格局與人生時機。</p>
        <Link
          href="/consultation"
          className="inline-block bg-[#B23E26] hover:bg-[#96321E] text-[#F7F1E5] font-bold px-6 py-3 rounded transition-all hover:shadow-[0_10px_24px_-10px_rgba(178,62,38,0.55)] active:scale-[0.97] text-sm"
        >
          預約諮詢
        </Link>
      </div>

      {/* 電郵訂閱 */}
      <div className="mt-12 bg-[#FBF7EE] border border-[#2B241C]/10 rounded p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <div className="sm:flex-1">
            <p className="text-[#2B241C] font-bold mb-1">訂閱命理電子報</p>
            <p className="text-[#6B6155] text-sm leading-relaxed">
              新文章與每日能量直送信箱，不發廣告，隨時可退訂。
            </p>
          </div>
          <div className="sm:w-[360px]">
            <SubscribeForm variant="compact" />
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-[#2B241C] text-xl font-bold mb-6">相關文章</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} featured />
            ))}
          </div>
        </div>
      )}
        </article>

        {/* 長文 sticky 目錄（C3）：有子標題先顯示，xl 闊屏限定 */}
        <TableOfContents />
      </div>
    </>
  )
}

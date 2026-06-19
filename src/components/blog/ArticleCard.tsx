import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { CATEGORY_GLYPHS } from '@/types'
import type { ArticleMeta } from '@/types'

interface Props {
  article: ArticleMeta
  featured?: boolean
  index?: number
}

/** Extract numeric sequence from slug e.g. "topic-07-..." → "07" */
function getSeqNo(slug: string): string {
  const m = slug.match(/^topic-(\d+)/)
  return m ? m[1].padStart(2, '0') : ''
}

export default function ArticleCard({ article, featured = false, index }: Props) {
  const glyph = CATEGORY_GLYPHS[article.category] ?? '命'
  const seq = getSeqNo(article.slug)
  const hasRealCover =
    article.slug.startsWith('post-') &&
    !!article.coverImage &&
    !article.coverImage.includes('default')

  if (featured) {
    return (
      <Link href={`/articles/${article.slug}`} className="group block">
        <div className="relative rounded-md overflow-hidden bg-[#2B241C]/[0.05] border border-[#2B241C]/10 hover:border-[#B23E26]/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgba(178,62,38,0.25)]">
          {/* Visual cover: 真實封面優先，教學系列 fallback 字形 banner */}
          <div className="relative h-48 w-full overflow-hidden bg-[#1E1A15]">
            {hasRealCover ? (
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-[#FBF7EE] flex items-center justify-center">
                <span className="absolute text-[140px] font-black text-[#2B241C]/[0.04] leading-none select-none pointer-events-none">
                  {glyph}
                </span>
                <span className="relative font-serif text-[80px] font-black text-[#B23E26]/80 leading-none select-none tracking-tight">
                  {seq || glyph}
                </span>
              </div>
            )}
            {/* Category label bottom-right */}
            <span
              className={
                hasRealCover
                  ? 'absolute bottom-2 right-3 text-[11px] tracking-widest text-[#F7F1E5] bg-[#2B241C]/55 px-2 py-0.5 rounded backdrop-blur-sm'
                  : 'absolute bottom-3 right-4 text-[#9C9282] text-[11px] tracking-widest'
              }
            >
              {article.category}
            </span>
          </div>

          <div className="p-5">
            <h3 className="text-[#2B241C] font-bold text-base leading-snug mb-2 group-hover:text-[#B23E26] transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-[#6B6155] text-sm leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>
            <div className="flex items-center gap-4 text-[#9C9282] text-xs">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {article.readingTime}
              </span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex gap-4 py-5 border-b border-[#2B241C]/10 hover:border-[#2B241C]/20 transition-colors"
    >
      {/* Small block: number as primary, glyph as faint watermark */}
      <div className="w-16 h-16 flex-shrink-0 rounded bg-[#FBF7EE] border border-[#2B241C]/10 flex items-center justify-center overflow-hidden relative">
        <span className="absolute text-[48px] font-black text-[#2B241C]/[0.05] leading-none select-none pointer-events-none">
          {glyph}
        </span>
        <span className="relative font-serif text-xl font-black text-[#B23E26]/80 leading-none select-none">
          {seq || glyph}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-[#3A332A] font-semibold text-sm leading-snug group-hover:text-[#B23E26] transition-colors line-clamp-2 mb-1">
          {article.title}
        </h3>
        <div className="flex items-center gap-3 text-[#9C9282] text-xs">
          <span className="flex items-center gap-1"><Clock size={10} />{article.readingTime}</span>
          <span>{article.category}</span>
        </div>
      </div>
    </Link>
  )
}

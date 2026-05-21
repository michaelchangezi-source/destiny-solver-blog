import Link from 'next/link'
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

  if (featured) {
    return (
      <Link href={`/articles/${article.slug}`} className="group block">
        <div className="relative rounded-md overflow-hidden bg-white/5 border border-white/10 hover:border-[#C9A84C]/50 transition-all duration-300 hover:-translate-y-0.5">
          {/* Glyph cover */}
          <div className="relative h-48 w-full bg-[#0A0A20] flex items-center justify-center overflow-hidden">
            <span className="absolute text-[120px] font-black text-white/5 leading-none select-none pointer-events-none">
              {glyph}
            </span>
            <span className="relative text-[72px] font-black text-[#C9A84C]/80 leading-none select-none">
              {glyph}
            </span>
            {seq && (
              <span className="absolute top-3 left-4 text-white/25 text-xs font-mono tracking-widest">
                {seq}
              </span>
            )}
            <span className="absolute bottom-3 right-4 text-white/20 text-xs tracking-widest">
              {article.category}
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-white font-bold text-base leading-snug mb-2 group-hover:text-[#C9A84C] transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-white/45 text-sm leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>
            <div className="flex items-center gap-4 text-white/25 text-xs">
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
      className="group flex gap-4 py-5 border-b border-white/8 hover:border-white/20 transition-colors"
    >
      {/* Small glyph block */}
      <div className="w-16 h-16 flex-shrink-0 rounded bg-[#0A0A20] border border-white/10 flex items-center justify-center overflow-hidden">
        <span className="text-3xl font-black text-[#C9A84C]/70 leading-none select-none">
          {glyph}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        {seq && (
          <span className="text-white/25 text-[11px] font-mono tracking-widest">{seq}</span>
        )}
        <h3 className="text-white/90 font-semibold text-sm leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2 mb-1">
          {article.title}
        </h3>
        <div className="flex items-center gap-3 text-white/25 text-xs">
          <span className="flex items-center gap-1"><Clock size={10} />{article.readingTime}</span>
          <span>{article.category}</span>
        </div>
      </div>
    </Link>
  )
}

import Link from 'next/link'
import { Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { ArticleMeta } from '@/types'

/** 最新文章卡片：顯示真實封面圖（每週帖文的第一張 IG 圖） */
export default function LatestCard({ article }: { article: ArticleMeta }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="rounded-md overflow-hidden bg-[#FBF7EE] border border-[#2B241C]/10 hover:border-[#B23E26]/50 transition-all duration-300 hover:-translate-y-0.5">
        <div className="relative aspect-[2/1] w-full overflow-hidden bg-[#0a0a0a]">
          {/* aspect-[2/1] 對齊 IG 封面中央安全區，不切字 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
          />
          <span className="absolute bottom-2 right-3 text-[11px] tracking-widest text-[#F7F1E5] bg-[#2B241C]/55 px-2 py-0.5 rounded backdrop-blur-sm">
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

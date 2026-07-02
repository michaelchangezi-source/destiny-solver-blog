import Link from 'next/link'
import { Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getCategoryAccent } from '@/types'
import ArticleCover from './ArticleCover'
import type { ArticleMeta } from '@/types'

/** 最新文章卡片：程式生成封面（分類＋標題＋印章漢字），避免搬用帶浮水印的原圖 */
export default function LatestCard({ article }: { article: ArticleMeta; priority?: boolean }) {
  const accent = getCategoryAccent(article.category)
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-[#FFFFFF] border border-[#2B241C]/10 hover:border-[#B23E26]/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgba(178,62,38,0.25)]">
        {/* 分類五行強調色條（C1 快速掃讀辨識） */}
        <div className="h-[3px] w-full" style={{ backgroundColor: accent }} aria-hidden="true" />
        <div className="relative aspect-[2/1] w-full overflow-hidden">
          <ArticleCover title={article.title} category={article.category} coverImage={article.coverImage} />
        </div>
        <div className="p-5">
          <h3 className="text-[#2B241C] font-bold text-base leading-snug mb-2 group-hover:text-[#B23E26] transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-[#6B6155] text-sm leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>
          <div className="flex items-center gap-4 text-[#6B6155] text-xs">
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

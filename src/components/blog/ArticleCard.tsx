import Link from 'next/link'
import Image from 'next/image'
import { Clock, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { CATEGORY_COLORS } from '@/types'
import type { ArticleMeta } from '@/types'

interface Props {
  article: ArticleMeta
  featured?: boolean
}

export default function ArticleCard({ article, featured = false }: Props) {
  const categoryColor = CATEGORY_COLORS[article.category] ?? 'bg-gray-100 text-gray-800'

  if (featured) {
    return (
      <Link href={`/articles/${article.slug}`} className="group block">
        <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#C9A84C]/40 transition-all duration-300 hover:-translate-y-1">
          <div className="relative h-56 w-full">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F2D] via-[#0F0F2D]/40 to-transparent" />
            <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${categoryColor}`}>
              {article.category}
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-white font-bold text-lg leading-snug mb-2 group-hover:text-[#C9A84C] transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>
            <div className="flex items-center gap-4 text-white/30 text-xs">
              <span className="flex items-center gap-1">
                <Clock size={12} />
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
    <Link href={`/articles/${article.slug}`} className="group flex gap-4 py-5 border-b border-white/10 hover:border-white/20 transition-colors">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor}`}>
            {article.category}
          </span>
        </div>
        <h3 className="text-white/90 font-semibold text-sm leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2 mb-1">
          {article.title}
        </h3>
        <div className="flex items-center gap-3 text-white/30 text-xs">
          <span className="flex items-center gap-1"><Clock size={11} />{article.readingTime}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  )
}

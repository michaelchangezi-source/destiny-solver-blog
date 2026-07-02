import Image from 'next/image'
import { CATEGORY_GLYPHS, getCategoryAccent } from '@/types'

/**
 * 文章封面（§4 方案 B）：有原圖就用原圖，裁走 Threads carousel 頂/底的「1/5」與
 * © 水印帶（object-position 偏中，配合 2:1／短高卡片天然裁走首尾窄帶），
 * 疊一層由深至透明嘅 gradient 取代死黑 overlay。冇原圖先 fallback 做程式生成封面（純 CSS/SVG）。
 */
export default function ArticleCover({
  title,
  category,
  coverImage,
  className = '',
  compact = false,
}: {
  title: string
  category: string
  coverImage?: string
  className?: string
  compact?: boolean
}) {
  const glyph = CATEGORY_GLYPHS[category] ?? '命'
  const accent = getCategoryAccent(category)

  if (coverImage) {
    return (
      <div className={`relative h-full w-full overflow-hidden bg-[#161310] ${className}`}>
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
          style={{ objectPosition: 'center 38%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161310]/75 via-[#161310]/10 to-transparent" />
        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#E8A86E] border border-[#E8A86E]/50 px-2 py-1 rounded bg-[#161310]/40 backdrop-blur-sm">
          {category}
        </span>
        <span
          className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded font-serif font-black text-base sm:text-lg leading-none"
          style={{ background: accent, color: '#FBF7EE' }}
        >
          {glyph}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[#161310] flex flex-col justify-end ${
        compact ? 'p-4' : 'p-5'
      } ${className}`}
    >
      {/* 分類標籤 */}
      <span
        className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#E8A86E] border border-[#E8A86E]/50 px-2 py-1 rounded"
      >
        {category}
      </span>

      {/* 印章字 */}
      <span
        className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded font-serif font-black text-base sm:text-lg leading-none"
        style={{ background: accent, color: '#FBF7EE' }}
      >
        {glyph}
      </span>

      {/* 標題大字 */}
      <h4
        className={`relative font-serif font-bold text-[#F4EEE1] leading-[1.45] max-w-[82%] ${
          compact ? 'text-sm' : 'text-base sm:text-lg'
        } line-clamp-3`}
      >
        {title}
      </h4>
    </div>
  )
}

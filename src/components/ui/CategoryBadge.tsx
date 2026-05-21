import Link from 'next/link'
import { CATEGORY_SLUGS, CATEGORY_ORDER } from '@/types'

interface Props {
  category: string
  linkable?: boolean
  size?: 'sm' | 'md'
  showNumber?: boolean
}

export default function CategoryBadge({
  category,
  linkable = false,
  size = 'md',
  showNumber = true,
}: Props) {
  const idx = CATEGORY_ORDER.indexOf(category)
  const num = idx >= 0 ? String(idx + 1).padStart(2, '0') : null

  const cls =
    size === 'sm'
      ? 'inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-white/15 text-white/55 hover:text-[#C9A84C] hover:border-[#C9A84C]/40 transition-colors'
      : 'inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded border border-white/15 text-white/55 hover:text-[#C9A84C] hover:border-[#C9A84C]/40 transition-colors'

  const content = (
    <>
      {showNumber && num && (
        <span className="font-mono text-[#C9A84C]/60">{num}</span>
      )}
      <span>{category}</span>
    </>
  )

  if (linkable) {
    return (
      <Link href={`/categories/${CATEGORY_SLUGS[category] ?? category}`} className={cls}>
        {content}
      </Link>
    )
  }
  return <span className={cls}>{content}</span>
}

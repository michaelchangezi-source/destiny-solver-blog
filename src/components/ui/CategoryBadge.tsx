import Link from 'next/link'
import { CATEGORY_COLORS, CATEGORY_SLUGS } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  category: string
  linkable?: boolean
  size?: 'sm' | 'md'
}

export default function CategoryBadge({ category, linkable = false, size = 'md' }: Props) {
  const color = CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-800'
  const cls = cn(
    'inline-block font-semibold rounded-full transition-opacity hover:opacity-80',
    color,
    size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
  )

  if (linkable) {
    return (
      <Link href={`/categories/${CATEGORY_SLUGS[category] ?? category}`} className={cls}>
        {category}
      </Link>
    )
  }
  return <span className={cls}>{category}</span>
}

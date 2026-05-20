export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  coverImage: string
  publishedAt: string
  readingTime: string
  order?: number
  isPaid?: boolean
}

export interface ArticleMeta {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  coverImage: string
  publishedAt: string
  readingTime: string
  order?: number
  isPaid?: boolean
}

export type Category =
  | '八字基礎'
  | '干支詳解'
  | '十神應用'
  | '命盤格局'
  | '實戰斷命'
  | '大運流年'
  | '感情格局'
  | '事業財運'
  | '健康命理'
  | '風水地理'

export const CATEGORY_COLORS: Record<string, string> = {
  '八字基礎': 'bg-indigo-100 text-indigo-800',
  '干支詳解': 'bg-amber-100 text-amber-800',
  '十神應用': 'bg-purple-100 text-purple-800',
  '命盤格局': 'bg-blue-100 text-blue-800',
  '實戰斷命': 'bg-orange-100 text-orange-800',
  '大運流年': 'bg-yellow-100 text-yellow-800',
  '感情格局': 'bg-rose-100 text-rose-800',
  '事業財運': 'bg-emerald-100 text-emerald-800',
  '健康命理': 'bg-teal-100 text-teal-800',
  '風水地理': 'bg-green-100 text-green-800',
}

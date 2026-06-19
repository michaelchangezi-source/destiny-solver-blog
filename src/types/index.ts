export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  coverImage: string
  publishedAt: string
  updatedAt: string
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
  updatedAt: string
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

// 中文分類 → ASCII slug（用於 URL，避免中文字符造成 404）
export const CATEGORY_SLUGS: Record<string, string> = {
  '八字基礎': 'basics',
  '干支詳解': 'ganzhi',
  '十神應用': 'shishen',
  '命盤格局': 'patterns',
  '實戰斷命': 'readings',
  '大運流年': 'dayun',
  '感情格局': 'relationships',
  '事業財運': 'career',
  '健康命理': 'health',
  '風水地理': 'fengshui',
}

// ASCII slug → 中文分類（用於頁面顯示）
export const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([name, slug]) => [slug, name])
)

// Minimal dark-mode badge colours — no more candy palette
export const CATEGORY_COLORS: Record<string, string> = {
  '八字基礎': 'bg-white/10 text-white/80 border border-white/20',
  '干支詳解': 'bg-white/10 text-white/80 border border-white/20',
  '十神應用': 'bg-white/10 text-white/80 border border-white/20',
  '命盤格局': 'bg-white/10 text-white/80 border border-white/20',
  '實戰斷命': 'bg-white/10 text-white/80 border border-white/20',
  '大運流年': 'bg-white/10 text-white/80 border border-white/20',
  '感情格局': 'bg-white/10 text-white/80 border border-white/20',
  '事業財運': 'bg-white/10 text-white/80 border border-white/20',
  '健康命理': 'bg-white/10 text-white/80 border border-white/20',
  '風水地理': 'bg-white/10 text-white/80 border border-white/20',
}

// Category → representative Chinese character (used in article cards)
export const CATEGORY_GLYPHS: Record<string, string> = {
  '八字基礎': '甲',
  '干支詳解': '子',
  '十神應用': '祿',
  '命盤格局': '局',
  '實戰斷命': '斷',
  '大運流年': '運',
  '感情格局': '情',
  '事業財運': '財',
  '健康命理': '壽',
  '風水地理': '風',
}

// Category display order (01-10)
export const CATEGORY_ORDER: string[] = [
  '八字基礎',
  '干支詳解',
  '十神應用',
  '命盤格局',
  '實戰斷命',
  '大運流年',
  '感情格局',
  '事業財運',
  '健康命理',
  '風水地理',
]

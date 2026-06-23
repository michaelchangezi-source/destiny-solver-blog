export interface Article {
  slug: string
  title: string
  excerpt: string
  description: string
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
  description: string
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
  // 非教學系列分類（每週帖文用），同樣需 ASCII slug 避免中文 URL 404
  '職場現象': 'workplace',
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

// 分類 → 五行屬性 → 收斂過嘅大地色系強調色（C1 分類視覺線索）。
// 全部刻意調暗、低飽和，坐喺米色宣紙底上唔搶戲，只做快速掃讀辨識。
// 火＝品牌朱砂本色，其餘四行用同色溫嘅啞色，與整體風格一致。
export const ELEMENT_ACCENT: Record<string, string> = {
  '木': '#5E7355', // 木 沉穩苔綠
  '火': '#B23E26', // 火 品牌朱砂
  '土': '#B5862F', // 土 赭黃
  '金': '#80776A', // 金 啞鉛灰
  '水': '#3F5A6B', // 水 黛藍
}

// 每個分類歸一個五行，盡量令相鄰分類顏色分明，便於一眼分辨。
export const CATEGORY_ELEMENT: Record<string, string> = {
  '八字基礎': '木',
  '干支詳解': '水',
  '十神應用': '金',
  '命盤格局': '土',
  '實戰斷命': '火',
  '大運流年': '水',
  '感情格局': '火',
  '事業財運': '金',
  '健康命理': '木',
  '風水地理': '土',
  '職場現象': '金',
}

// 取分類強調色（HEX）；未知分類回退品牌朱砂。
export function getCategoryAccent(category: string): string {
  return ELEMENT_ACCENT[CATEGORY_ELEMENT[category]] ?? '#B23E26'
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

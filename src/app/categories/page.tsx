import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getAllArticles, getAllCategories } from '@/lib/articles'
import { CATEGORY_SLUGS, CATEGORY_GLYPHS, CATEGORY_ORDER } from '@/types'

export const metadata: Metadata = {
  title: '學習路徑',
  description: '從零開始系統學習八字命理：天干地支→十神體系→格局判斷→大運流年，循序漸進。',
  alternates: { canonical: '/categories' },
}

const CATEGORY_DESC: Record<string, string> = {
  '八字基礎': '十天干、十二地支的陰陽五行與文化類象，理解八字的基本字母表。',
  '干支詳解': '刑、沖、合、害——地支之間的動態關係，決定命局的張力與變化。',
  '十神應用': '比劫、食傷、財星、官殺、印綬，命理的語言骨架與人事類象。',
  '命盤格局': '命局結構的清純與複雜度，決定人生模式的層次與格局高低。',
  '實戰斷命': '從命局到現實的橋接——如何在具體情境中做出精準判斷。',
  '大運流年': '人生時序的運作機制：十年大運與年度流年的交互作用。',
  '感情格局': '從命盤看感情模式、緣分深淺與關係中的能量動態。',
  '事業財運': '事業方向、財星結構與創業或打工時機的命理解析。',
  '健康命理': '五行與臟腑的對應，從命局看體質傾向與健康警示。',
  '風水地理': '空間能量與人的命局如何產生互動，場域選擇的命理依據。',
}

export default function CategoriesPage() {
  const articles = getAllArticles()
  const categories = getAllCategories()

  // Sort by CATEGORY_ORDER
  const sorted = CATEGORY_ORDER.filter((c) => categories.includes(c))
  const others = categories.filter((c) => !CATEGORY_ORDER.includes(c))
  const allCats = [...sorted, ...others]

  const stats = allCats.map((cat) => ({
    name: cat,
    count: articles.filter((a) => a.category === cat).length,
    glyph: CATEGORY_GLYPHS[cat] ?? '命',
    desc: CATEGORY_DESC[cat] ?? '',
    idx: CATEGORY_ORDER.indexOf(cat),
  }))

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-14">
        <p className="text-[#B23E26] text-xs font-semibold tracking-[0.35em] uppercase mb-3">LEARNING PATH</p>
        <h1 className="font-serif text-[#2B241C] text-4xl sm:text-5xl font-black mb-4">系統學習路徑</h1>
        <p className="text-[#6B6155] text-lg max-w-xl leading-relaxed">
          八字命理不是碎片化的知識點，而是一套完整的思維體系。選擇你的起點，開始系統學習。
        </p>
      </div>

      {stats.length === 0 ? (
        <p className="text-[#8A8071] text-center py-20">文章準備中，敬請期待。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((cat) => {
            const num = cat.idx >= 0 ? String(cat.idx + 1).padStart(2, '0') : null
            return (
              <Link
                key={cat.name}
                href={`/categories/${CATEGORY_SLUGS[cat.name] ?? cat.name}`}
                className="group relative bg-[#FBF7EE] border border-[#2B241C]/10 hover:border-[#B23E26]/50 rounded-md p-6 transition-all overflow-hidden"
              >
                {/* Background glyph */}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[80px] font-black text-[#2B241C]/5 group-hover:text-[#B23E26]/5 leading-none select-none pointer-events-none transition-colors">
                  {cat.glyph}
                </span>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    {num && (
                      <span className="font-mono text-[#B23E26]/50 text-xs">{num}</span>
                    )}
                    <span className="text-[#2B241C] font-bold text-base group-hover:text-[#B23E26] transition-colors">
                      {cat.name}
                    </span>
                    <span className="ml-auto text-[#6B6155] text-xs">{cat.count} 篇</span>
                  </div>
                  {cat.desc && (
                    <p className="text-[#6B6155] text-sm leading-relaxed group-hover:text-[#5A5247] transition-colors">
                      {cat.desc}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-4 text-[#B23E26]/0 group-hover:text-[#B23E26]/60 transition-colors text-xs">
                    開始閱讀 <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

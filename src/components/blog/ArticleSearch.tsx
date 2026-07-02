'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import ArticleCard from './ArticleCard'
import CategoryBadge from '@/components/ui/CategoryBadge'
import type { ArticleMeta } from '@/types'

interface Props {
  articles: ArticleMeta[]
  categories: string[]
  initialQuery?: string
}

/** 對單篇文章按關鍵詞算分；分數越高越相關，0 代表完全不符。 */
function scoreArticle(a: ArticleMeta, q: string, terms: string[]): number {
  const title = a.title.toLowerCase()
  const cat = a.category.toLowerCase()
  const tags = a.tags.map((t) => t.toLowerCase())
  const summary = `${a.excerpt} ${a.description}`.toLowerCase()

  let score = 0
  // 整串查詢命中（中文連續字最常見）
  if (title.includes(q)) score += 12
  if (cat.includes(q)) score += 6
  if (tags.some((t) => t.includes(q))) score += 7
  if (summary.includes(q)) score += 3
  // 逐詞命中（英文 / 多關鍵詞）
  for (const t of terms) {
    if (!t) continue
    if (title.includes(t)) score += 4
    if (cat.includes(t)) score += 2
    if (tags.some((tag) => tag.includes(t))) score += 3
    if (summary.includes(t)) score += 1
  }
  return score
}

export default function ArticleSearch({ articles, categories, initialQuery = '' }: Props) {
  const [query, setQuery] = useState(initialQuery)

  // 同步查詢到網址（可分享、對齊 SearchAction），不觸發整頁導航
  useEffect(() => {
    const id = setTimeout(() => {
      const url = new URL(window.location.href)
      if (query.trim()) url.searchParams.set('q', query.trim())
      else url.searchParams.delete('q')
      window.history.replaceState(null, '', url.toString())
    }, 300)
    return () => clearTimeout(id)
  }, [query])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return articles
    const terms = q.split(/\s+/).filter(Boolean)
    return articles
      .map((a) => ({ a, s: scoreArticle(a, q, terms) }))
      .filter((x) => x.s > 0)
      .sort((x, y) => y.s - x.s)
      .map((x) => x.a)
  }, [articles, query])

  const isSearching = query.trim().length > 0

  return (
    <>
      {/* 搜尋框 */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6155] pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="搜尋文章：甲木、桃花、大運、十神…"
          aria-label="搜尋文章"
          className="w-full rounded-md border border-[#2B241C]/15 bg-[#FBF7EE] py-3.5 pl-12 pr-11 text-[#2B241C] placeholder:text-[#6B6155] focus:border-[#B23E26]/50 focus:outline-none focus:ring-2 focus:ring-[#B23E26]/15 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="清除搜尋"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6155] hover:text-[#B23E26] transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* 熱門關鍵詞 / 分類快捷（未搜尋時顯示） */}
      {!isSearching && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <CategoryBadge key={cat} category={cat} linkable size="sm" />
          ))}
        </div>
      )}

      {/* 結果計數 */}
      <div className="flex items-center justify-between mb-6 text-sm">
        <p className="text-[#6B6155]">
          {isSearching ? (
            <>
              「<span className="text-[#B23E26] font-semibold">{query.trim()}</span>」找到{' '}
              <span className="font-semibold">{results.length}</span> 篇
            </>
          ) : (
            <>共 <span className="font-semibold">{results.length}</span> 篇文章</>
          )}
        </p>
      </div>

      {/* 結果 */}
      {results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#8A8071] mb-2">找不到「{query.trim()}」相關的文章</p>
          <p className="text-[#6B6155] text-sm">試試其他關鍵詞，或瀏覽下方分類。</p>
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {categories.map((cat) => (
              <CategoryBadge key={cat} category={cat} linkable size="sm" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <h2 className="sr-only">{isSearching ? '搜尋結果' : '全部文章'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((article, i) => (
              <ArticleCard key={article.slug} article={article} featured index={i} />
            ))}
          </div>
        </>
      )}
    </>
  )
}

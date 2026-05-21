'use client'

import { useState } from 'react'
import ArticleCard from './ArticleCard'
import CategoryBadge from '@/components/ui/CategoryBadge'
import type { ArticleMeta } from '@/types'

const CORE = ['八字基礎', '干支詳解', '十神應用', '命盤格局', '實戰斷命']
const APPLIED = ['大運流年', '感情格局', '事業財運', '健康命理', '風水地理']

type Tab = '全部' | '核心教程' | '主題應用'

interface Props {
  articles: ArticleMeta[]
  categories: string[]
}

export default function ArticleFilter({ articles, categories }: Props) {
  const [tab, setTab] = useState<Tab>('全部')

  const filtered =
    tab === '核心教程'
      ? articles.filter((a) => CORE.includes(a.category))
      : tab === '主題應用'
      ? articles.filter((a) => APPLIED.includes(a.category))
      : articles

  const tabs: Tab[] = ['全部', '核心教程', '主題應用']

  return (
    <>
      {/* Tab switcher */}
      <div className="flex items-center gap-1 mb-8 border-b border-white/8 pb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-[#C9A84C] text-[#0F0F2D]'
                : 'text-white/45 hover:text-white/70'
            }`}
          >
            {t}
            {t !== '全部' && (
              <span className="ml-1.5 text-[10px] opacity-60">
                ({t === '核心教程' ? articles.filter((a) => CORE.includes(a.category)).length : articles.filter((a) => APPLIED.includes(a.category)).length})
              </span>
            )}
          </button>
        ))}
        <span className="ml-auto text-white/25 text-xs">{filtered.length} 篇</span>
      </div>

      {/* Category chips — only shown in 全部 tab */}
      {tab === '全部' && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <CategoryBadge key={cat} category={cat} linkable size="sm" />
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">暫無文章</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((article, i) => (
            <ArticleCard key={article.slug} article={article} featured index={i} />
          ))}
        </div>
      )}
    </>
  )
}

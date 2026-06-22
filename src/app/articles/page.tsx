import type { Metadata } from 'next'
import { getAllArticles, getAllCategories } from '@/lib/articles'
import ArticleSearch from '@/components/blog/ArticleSearch'

export const metadata: Metadata = {
  title: '搜尋文章',
  description: '搜尋命運解決師的八字命理文章：十神、大運流年、格局、感情與事業財運，輸入關鍵詞即時找到相關文章。',
  alternates: { canonical: '/articles' },
}

export const revalidate = 3600

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function ArticlesPage({ searchParams }: Props) {
  const { q } = await searchParams
  const articles = getAllArticles()
  const categories = getAllCategories()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-8">
        <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-1">SEARCH</p>
        <h1 className="font-serif text-[#2B241C] text-3xl font-black">搜尋文章</h1>
        <p className="text-[#6B6155] text-sm mt-2">
          {articles.length} 篇命理文章，輸入關鍵詞即時搜尋；或從分類進入。
        </p>
      </header>

      <ArticleSearch articles={articles} categories={categories} initialQuery={q ?? ''} />
    </div>
  )
}

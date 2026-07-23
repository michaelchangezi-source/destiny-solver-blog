'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ArticleItem {
  slug: string
  title: string
  category: string
  publishedAt: string
  tags: string[]
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/articles')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setArticles(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/new"
            className="px-4 py-2 bg-[#B23E26] hover:bg-[#8B2E1D] rounded-lg text-sm font-medium transition-colors"
          >
            新增文章
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            登出
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋文章標題、分類…"
          className="w-full max-w-md px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#B23E26] text-white placeholder-white/30"
        />
      </div>

      {loading ? (
        <p className="text-white/50">載入中…</p>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_150px_120px_80px] gap-4 px-4 py-2 text-sm text-white/40 border-b border-white/10">
            <span>標題</span>
            <span>分類</span>
            <span>發布日期</span>
            <span>操作</span>
          </div>
          {filtered.map((article) => (
            <div
              key={article.slug}
              className="grid grid-cols-[1fr_150px_120px_80px] gap-4 px-4 py-3 rounded-lg hover:bg-white/5 items-center"
            >
              <span className="truncate text-sm">{article.title}</span>
              <span className="text-sm text-white/60">{article.category}</span>
              <span className="text-sm text-white/40">
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('zh-TW') : ''}
              </span>
              <Link
                href={`/admin/edit/${article.slug}`}
                className="text-sm text-[#B23E26] hover:text-[#D4503A]"
              >
                編輯
              </Link>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-white/30 py-8">沒有找到文章</p>
          )}
        </div>
      )}

      <div className="mt-6 text-sm text-white/30">共 {articles.length} 篇文章</div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CATEGORIES = [
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

export default function NewArticle() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function generateFilename() {
    const now = new Date()
    const date = now.toISOString().slice(0, 10).replace(/-/g, '')
    const existing = 1
    return `post-${date}-${String(existing).padStart(2, '0')}-${title.slice(0, 20)}.md`
  }

  function buildMarkdown() {
    const frontmatter = [
      '---',
      `title: "${title}"`,
      `excerpt: "${excerpt}"`,
      `category: "${category}"`,
      `tags: [${tags
        .split(',')
        .map((t) => `"${t.trim()}"`)
        .filter((t) => t !== '""')
        .join(', ')}]`,
      `publishedAt: "${new Date().toISOString()}"`,
      `updatedAt: "${new Date().toISOString()}"`,
      '---',
      '',
    ].join('\n')
    return frontmatter + content
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('標題和內容不能為空')
      return
    }

    setSaving(true)
    setError('')

    try {
      const filename = generateFilename()
      const markdown = buildMarkdown()

      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content: markdown }),
      })

      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        const data = await res.json()
        setError(data.error || '儲存失敗')
      }
    } catch {
      setError('網絡錯誤')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">新增文章</h1>
        <Link
          href="/admin/dashboard"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
        >
          返回
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-white/60 mb-2">標題</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#B23E26] text-white"
            placeholder="文章標題"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">摘要</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#B23E26] text-white"
            placeholder="一句話摘要"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">分類</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#B23E26] text-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#1a1a1a]">
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">標籤（逗號分隔）</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#B23E26] text-white"
              placeholder="八字, 十神, 財運"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">內容（Markdown）</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#B23E26] text-white font-mono text-sm leading-relaxed resize-y"
            placeholder="用 Markdown 撰寫文章內容..."
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#B23E26] hover:bg-[#8B2E1D] disabled:opacity-50 rounded-lg font-medium transition-colors"
          >
            {saving ? '發布中...' : '發布文章'}
          </button>
        </div>
      </form>
    </div>
  )
}

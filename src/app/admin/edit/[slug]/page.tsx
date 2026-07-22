'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

function parseFrontmatter(raw: string) {
  const normalized = raw.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { data: {} as Record<string, string | string[]>, body: raw }
  const fm: Record<string, string | string[]> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
    if (val.startsWith('[') && val.endsWith(']')) {
      fm[key] = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^"|"$/g, ''))
        .filter(Boolean)
    } else {
      fm[key] = val
    }
  }
  return { data: fm, body: match[2] }
}

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

export default function EditArticle() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/admin/articles/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          setLoading(false)
          return
        }
        const { data: fm, body } = parseFrontmatter(data.content)
        setTitle((fm.title as string) || '')
        setExcerpt((fm.excerpt as string) || '')
        setCategory((fm.category as string) || CATEGORIES[0])
        setTags(Array.isArray(fm.tags) ? fm.tags.join(', ') : (fm.tags as string) || '')
        setPublishedAt((fm.publishedAt as string) || '')
        setContent(body.trim())
        setLoading(false)
      })
      .catch(() => {
        setError('載入失敗')
        setLoading(false)
      })
  }, [slug])

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
      publishedAt ? `publishedAt: "${publishedAt}"` : `publishedAt: "${new Date().toISOString()}"`,
      `updatedAt: "${new Date().toISOString()}"`,
      '---',
      '',
    ].join('\n')
    return frontmatter + content
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('標題和內容不能為空')
      return
    }

    setSaving(true)
    setError('')

    try {
      const markdown = buildMarkdown()
      const res = await fetch(`/api/admin/articles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdown }),
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

  async function handleDelete() {
    if (!confirm('確定要刪除這篇文章嗎？此操作不可撤銷。')) return

    setDeleting(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/articles/${slug}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        const data = await res.json()
        setError(data.error || '刪除失敗')
      }
    } catch {
      setError('網絡錯誤')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-white/50">載入中...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">編輯文章</h1>
        <Link
          href="/admin/dashboard"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
        >
          返回
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm text-white/60 mb-2">標題</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#B23E26] text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">摘要</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#B23E26] text-white"
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
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 justify-between">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#B23E26] hover:bg-[#8B2E1D] disabled:opacity-50 rounded-lg font-medium transition-colors"
            >
              {saving ? '儲存中...' : '儲存更改'}
            </button>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-6 py-3 bg-red-900/50 hover:bg-red-800/50 disabled:opacity-50 rounded-lg text-sm text-red-300 transition-colors"
          >
            {deleting ? '刪除中...' : '刪除文章'}
          </button>
        </div>
      </form>
    </div>
  )
}

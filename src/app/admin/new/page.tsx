'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CATEGORIES = [
  '八字基礎', '干支詳解', '十神應用', '命盤格局', '實戰斷命',
  '大運流年', '感情格局', '事業財運', '健康命理', '風水地理',
]

function nowHKT(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function localToIso(local: string): string {
  return local ? `${local}:00+08:00` : new Date().toISOString()
}

export default function NewArticle() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [tags, setTags] = useState('')
  const [publishedAt, setPublishedAt] = useState(nowHKT)
  const [coverImage, setCoverImage] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const [showInsert, setShowInsert] = useState(false)
  const [insertPath, setInsertPath] = useState('')
  const [insertWidth, setInsertWidth] = useState('')
  const [insertUploading, setInsertUploading] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  function generateFilename() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    return `post-${date}-01-${title.slice(0, 20).trim()}.md`
  }

  function buildMarkdown() {
    const lines = [
      '---',
      `title: "${title}"`,
      `excerpt: "${excerpt}"`,
      `category: "${category}"`,
      `tags: [${tags.split(',').map(t => `"${t.trim()}"`).filter(t => t !== '""').join(', ')}]`,
      `publishedAt: "${localToIso(publishedAt)}"`,
      `updatedAt: "${new Date().toISOString()}"`,
    ]
    if (coverImage) lines.push(`coverImage: "${coverImage}"`)
    lines.push('---', '', content)
    return lines.join('\n')
  }

  async function uploadFile(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/upload-image', { method: 'POST', body: form })
    const data = await res.json()
    if (!data.url) throw new Error(data.error || '上傳失敗')
    return data.url
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    setError('')
    try {
      setCoverImage(await uploadFile(file))
    } catch (err) {
      setError(err instanceof Error ? err.message : '上傳失敗')
    } finally {
      setCoverUploading(false)
      e.target.value = ''
    }
  }

  async function handleBodyImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setInsertUploading(true)
    setError('')
    try {
      setInsertPath(await uploadFile(file))
    } catch (err) {
      setError(err instanceof Error ? err.message : '上傳失敗')
    } finally {
      setInsertUploading(false)
      e.target.value = ''
    }
  }

  function handleInsertImage() {
    if (!insertPath) return
    const ta = textareaRef.current
    const pos = ta?.selectionStart ?? content.length
    const md = insertWidth
      ? `\n<img src="${insertPath}" width="${insertWidth}" alt="圖片" style="display:block;margin:1.5rem auto;" />\n`
      : `\n![圖片](${insertPath})\n`
    setContent(content.slice(0, pos) + md + content.slice(pos))
    setInsertPath('')
    setInsertWidth('')
    setShowInsert(false)
    setTimeout(() => {
      if (ta) { ta.selectionStart = ta.selectionEnd = pos + md.length; ta.focus() }
    }, 0)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) { setError('標題和內容不能為空'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: generateFilename(), content: buildMarkdown() }),
      })
      if (res.ok) { router.push('/admin/dashboard') }
      else { const d = await res.json(); setError(d.error || '儲存失敗') }
    } catch { setError('網絡錯誤') }
    finally { setSaving(false) }
  }

  const inputCls = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#B23E26] text-white'

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">新增文章</h1>
        <Link href="/admin/dashboard" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">返回</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-white/60 mb-2">標題</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="文章標題" />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">摘要</label>
          <input type="text" value={excerpt} onChange={e => setExcerpt(e.target.value)} className={inputCls} placeholder="一句話摘要" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">分類</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">標籤（逗號分隔）</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} className={inputCls} placeholder="八字, 十神, 財運" />
          </div>
        </div>

        {/* 發布時間 + 封面圖 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">發布時間（HKT）</label>
            <input type="datetime-local" value={publishedAt} onChange={e => setPublishedAt(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">封面圖片</label>
            <div className="flex gap-2">
              <input type="text" value={coverImage} onChange={e => setCoverImage(e.target.value)} className={`${inputCls} flex-1 min-w-0 text-sm`} placeholder="/images/covers/filename.png" />
              <label className={`flex-shrink-0 flex items-center gap-1 px-3 rounded-lg text-sm cursor-pointer transition-colors ${coverUploading ? 'bg-white/5 text-white/30' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                {coverUploading ? '上傳中…' : '📷 上傳'}
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={coverUploading} />
              </label>
            </div>
            {coverImage && (
              <img src={coverImage} alt="封面預覽" className="mt-2 h-20 w-full object-cover rounded-lg opacity-80" />
            )}
          </div>
        </div>

        {/* 內容 + 插入圖片工具 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-white/60">內容（Markdown）</label>
            <button type="button" onClick={() => setShowInsert(v => !v)}
              className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white/70 transition-colors">
              🖼 插入圖片
            </button>
          </div>

          {showInsert && (
            <div className="mb-3 p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/50 mb-1">圖片路徑</label>
                  <input type="text" value={insertPath} onChange={e => setInsertPath(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#B23E26]"
                    placeholder="/images/covers/xxx.png" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">寬度（像素，留空為全寬）</label>
                  <input type="number" value={insertWidth} onChange={e => setInsertWidth(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#B23E26]"
                    placeholder="800" />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <label className={`flex items-center gap-1 px-3 py-2 rounded text-sm cursor-pointer transition-colors ${insertUploading ? 'bg-white/5 text-white/30' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                  {insertUploading ? '上傳中…' : '📂 上傳圖片'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleBodyImageUpload} disabled={insertUploading} />
                </label>
                <button type="button" onClick={handleInsertImage} disabled={!insertPath}
                  className="px-4 py-2 bg-[#B23E26] hover:bg-[#8B2E1D] disabled:opacity-40 rounded text-sm transition-colors">
                  插入
                </button>
                <button type="button" onClick={() => { setShowInsert(false); setInsertPath(''); setInsertWidth('') }}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded text-sm text-white/50 transition-colors">
                  取消
                </button>
              </div>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={20}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#B23E26] text-white font-mono text-sm leading-relaxed resize-y"
            placeholder="用 Markdown 撰寫文章內容..."
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="px-6 py-3 bg-[#B23E26] hover:bg-[#8B2E1D] disabled:opacity-50 rounded-lg font-medium transition-colors">
            {saving ? '發布中...' : '發布文章'}
          </button>
        </div>
      </form>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

/**
 * 長文 sticky 目錄（C3，配合 A4 子標題）。
 * 客戶端讀取 #article-content 內嘅 h2/h3，缺 id 自動補 id，建立可跳轉目錄。
 * 若文章未有子標題（headings 為空）則唔渲染，零副作用；A4 加咗子標題即自動生效。
 */
function slugify(text: string, i: number): string {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
  return base ? `toc-${base}` : `toc-h-${i}`
}

export default function TableOfContents({ targetId = 'article-content' }: { targetId?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const root = document.getElementById(targetId)
    if (!root) return
    const nodes = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[]
    const items: Heading[] = nodes.map((node, i) => {
      if (!node.id) node.id = slugify(node.textContent ?? '', i)
      return { id: node.id, text: node.textContent ?? '', level: node.tagName === 'H2' ? 2 : 3 }
    })
    setHeadings(items)

    if (items.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [targetId])

  if (headings.length < 2) return null

  return (
    <nav aria-label="本文目錄" className="hidden xl:block sticky top-24 self-start w-56 flex-shrink-0">
      <p className="text-[#6B6155] text-[11px] font-semibold tracking-[0.25em] uppercase mb-3">目錄</p>
      <ul className="space-y-2 border-l border-[#2B241C]/10">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? '1.25rem' : '0.75rem' }}>
            <a
              href={`#${h.id}`}
              className={`block text-sm leading-snug -ml-px border-l-2 pl-3 transition-colors ${
                activeId === h.id
                  ? 'border-[#B23E26] text-[#B23E26] font-medium'
                  : 'border-transparent text-[#6B6155] hover:text-[#B23E26]'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

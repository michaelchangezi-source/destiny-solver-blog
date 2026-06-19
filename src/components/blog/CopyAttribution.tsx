'use client'

import { useEffect } from 'react'

interface Props {
  title: string
  /** 文章 canonical 路徑，例如 /articles/topic-01 */
  path: string
}

const BASE_URL = 'https://destiny-solver-blog.vercel.app'

/**
 * 複製帶出處：當訪客複製文章內文，自動在剪貼簿尾端附上作者署名與原文連結。
 * 純錦上添花——擋唔到刻意刪走嘅人，但替順手轉載者自動帶回 backlink 與署名。
 * 不影響 SEO/AEO：爬蟲讀 HTML，唔行 copy 事件。
 */
export default function CopyAttribution({ title, path }: Props) {
  useEffect(() => {
    function onCopy(e: ClipboardEvent) {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed) return

      const text = selection.toString()
      // 只在「實質段落」被複製時加出處，避免騷擾選一兩個字的人
      if (text.trim().length < 40) return

      // 確認選取範圍落在文章內文之內
      const container = document.getElementById('article-content')
      if (!container) return
      const anchor = selection.anchorNode
      if (!anchor || !container.contains(anchor)) return

      const url = `${BASE_URL}${path}`
      const notice = `\n\n— 本文出自《${title}》，作者：陳卓賢（命運解決師）\n原文：${url}\n© 命運解決師 destiny.solver，轉載請註明出處。`

      e.clipboardData?.setData('text/plain', text + notice)
      e.clipboardData?.setData(
        'text/html',
        `${text.replace(/\n/g, '<br>')}<br><br>— 本文出自《${title}》，作者：陳卓賢（命運解決師）<br>原文：<a href="${url}">${url}</a><br>© 命運解決師 destiny.solver，轉載請註明出處。`
      )
      e.preventDefault()
    }

    document.addEventListener('copy', onCopy)
    return () => document.removeEventListener('copy', onCopy)
  }, [title, path])

  return null
}

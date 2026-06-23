'use client'

import { useEffect, useState } from 'react'

/**
 * 長文閱讀進度條（C3）：固定喺 header 底，按文章正文捲動進度填朱砂色。
 * 提升完讀率與停留時間，間接利 SEO。
 */
export default function ReadingProgress({ targetId = 'article-content' }: { targetId?: string }) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById(targetId)
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0
      setPct(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [targetId])

  return (
    <div
      className="fixed top-16 left-0 right-0 z-40 h-[2px] pointer-events-none"
      role="progressbar"
      aria-label="閱讀進度"
      aria-valuenow={Math.round(pct * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-[#B23E26]"
        style={{ width: `${pct * 100}%`, transition: 'width 80ms linear' }}
      />
    </div>
  )
}

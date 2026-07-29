'use client'

import { useState } from 'react'

interface Props {
  url: string
  title: string
}

/**
 * 文章分享掣：Threads、Facebook、複製連結。
 * 樣式沿用 /bazi 排盤工具「複製命盤文字」掣的圓角外框按鈕系統，唔加新 icon library，全用 inline SVG。
 */
export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 剪貼簿權限不足時靜默失敗，不打擾閱讀
    }
  }

  const threadsUrl = `https://www.threads.com/intent/post?text=${encodeURIComponent(`${title} ${url}`)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`

  const baseBtn =
    'flex items-center justify-center w-11 h-11 rounded-full border transition-all duration-200 border-[#B23E26]/40 text-[#B23E26] hover:bg-[#B23E26]/10'

  return (
    <div className="flex flex-wrap items-center gap-2.5" aria-label="分享文章">
      <span className="text-[#6B6155] text-sm mr-1">分享文章</span>

      <a
        href={threadsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="分享到 Threads"
        className={baseBtn}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.181 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.63 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.088-4.798-.31-.705-.875-1.29-1.605-1.68-.192 1.352-.622 2.446-1.284 3.272-.892 1.11-2.156 1.72-3.763 1.81-1.223.07-2.396-.221-3.301-.815-1.072-.705-1.703-1.786-1.778-3.045-.146-2.457 1.727-4.226 4.65-4.399.996-.06 1.926-.017 2.786.13-.114-.687-.35-1.229-.706-1.61-.487-.522-1.236-.79-2.226-.795h-.028c-.804 0-1.898.223-2.593 1.253l-1.744-1.184c.932-1.374 2.443-2.132 4.263-2.132h.038c3.033.02 4.837 1.878 5.02 5.107.106.045.213.093.318.145 1.48.735 2.567 1.851 3.144 3.229.804 1.92.878 5.058-1.679 7.56-1.9 1.858-4.213 2.673-7.5 2.697z" />
        </svg>
      </a>

      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="分享到 Facebook"
        className={baseBtn}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
        </svg>
      </a>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? '連結已複製' : '複製連結'}
        className={
          copied
            ? 'flex items-center justify-center w-11 h-11 rounded-full border transition-all duration-200 border-green-500/60 text-green-400 bg-green-500/10'
            : baseBtn
        }
      >
        {copied ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 17H7a5 5 0 0 1 0-10h2" />
            <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
            <path d="M8 12h8" />
          </svg>
        )}
      </button>
    </div>
  )
}

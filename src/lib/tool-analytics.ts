'use client'

import { track } from '@vercel/analytics'

export function setupToolAnalytics(toolName: string): () => void {
  if (typeof window === 'undefined') return () => {}

  // permalink_open: URL has query params on mount
  if (window.location.search.length > 1) {
    track('permalink_open', { tool: toolName })
  }

  // click delegation: cast, copy, consult
  const handler = (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest('button, a[href]')
    if (!btn) return

    const id = (btn as HTMLElement).id
    const text = btn.textContent?.trim() ?? ''

    // tool_cast: main cast/draw buttons
    if (
      id.includes('cast') ||
      id.includes('Cast') ||
      id.includes('draw') ||
      text.includes('排盤') ||
      text.includes('起局') ||
      text.includes('裝卦') ||
      text.includes('抽牌')
    ) {
      // fire after brief delay to confirm result rendered
      setTimeout(() => {
        const hasResult =
          document.querySelector('.chart') ||
          document.querySelector('.hex') ||
          document.querySelector('.spread') ||
          document.querySelector('.drawn')
        if (hasResult) track('tool_cast', { tool: toolName })
      }, 800)
    }

    // pack_copy: copy buttons
    if (id === 'copyAll' || id === 'copyPack') {
      const preset = (() => {
        const activeChip = document.querySelector('.chip.on')
        return activeChip?.textContent?.trim() ?? 'overview'
      })()
      track('pack_copy', {
        tool: toolName,
        type: id === 'copyAll' ? 'full' : 'pack',
        preset,
      })
    }

    // consult_click: links to /consultation
    if (btn instanceof HTMLAnchorElement && btn.href?.includes('/consultation')) {
      track('consult_click', { source: toolName })
    }
  }

  document.addEventListener('click', handler, true)
  return () => document.removeEventListener('click', handler, true)
}

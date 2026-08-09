'use client'

import dynamic from 'next/dynamic'

// ssr: false 必須在 Client Component 內使用（不能直接在 Server Component page.tsx 宣告）
const HomeMotion = dynamic(() => import('./HomeMotion'), { ssr: false })
const InkFlowHeroAnim = dynamic(() => import('./InkFlowHeroAnim'), { ssr: false })

/**
 * 首頁動畫層統一入口（Client Component wrapper）。
 * 延遲載入所有 GSAP 相關代碼，mobile 不會下載 GSAP bundle。
 */
export default function HomeAnimations() {
  return (
    <>
      <HomeMotion />
      <InkFlowHeroAnim />
    </>
  )
}

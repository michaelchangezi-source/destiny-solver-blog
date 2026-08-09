'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, SplitText)

/**
 * Hero 進場動畫層（pure null，動態 import）。
 * 從 InkFlowHero 抽出，讓 GSAP 從初始 bundle 移除。
 * mobile／reduced-motion 下直接 return，不執行任何動畫。
 */
export default function InkFlowHeroAnim() {
  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    if (reduce || isMobile) return

    const scope = document.querySelector<HTMLElement>('.ink-flow-hero')
    if (!scope) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    const eyebrow = scope.querySelector('.hero-d-eyebrow')
    const h1 = scope.querySelector<HTMLElement>('.hero-d-h1')
    const rest = scope.querySelectorAll('.hero-d-sub, .hero-d-stats, .hero-d-cta')
    const card = scope.querySelector('.hero-d-card')

    let split: SplitText | null = null

    if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 14, duration: 0.6 })
    if (h1) {
      split = new SplitText(h1, { type: 'chars' })
      tl.from(split.chars, { opacity: 0, yPercent: 60, duration: 0.6, stagger: 0.03 }, eyebrow ? '-=0.25' : 0)
    }
    if (rest.length) tl.from(rest, { opacity: 0, y: 18, duration: 0.7, stagger: 0.12 }, '-=0.2')
    if (card) tl.from(card, { opacity: 0, x: 40, duration: 0.9 }, 0.35)

    return () => split?.revert()
  }, [])

  return null
}

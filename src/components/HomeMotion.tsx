'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/**
 * 首頁動效層（純客戶端，渲染 null）。
 *
 * 取代原本的 CSS scroll-driven 動畫（animation-timeline: view()），
 * 嗰個只喺 Chromium 系生效，Safari / Firefox / iPhone 用戶完全睇唔到。
 * 改用 GSAP ScrollTrigger，全瀏覽器一致。
 *
 * 進場狀態一律由 JS 設定（gsap.set / from），所以無 JS 時內容照樣可見。
 * 完整尊重 prefers-reduced-motion。
 */
export default function HomeMotion() {
  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // 不縮減動效：保持內容原狀可見，不做任何動畫

    // ── 1. Hero 入場（取代 .hero-in；標題用 SplitText 逐字浮現）──
    const heroLeft = document.querySelector<HTMLElement>('.hero-left')
    const heroAvatar = document.querySelector<HTMLElement>('.hero-avatar')
    const h1 = document.querySelector<HTMLElement>('.hero-h1')

    let split: SplitText | null = null
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    if (heroLeft) {
      const eyebrow = heroLeft.querySelector('.hero-eyebrow')
      const rest = heroLeft.querySelectorAll('.hero-sub, .hero-stats, .hero-cta')

      if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 14, duration: 0.6 })

      if (h1) {
        split = new SplitText(h1, { type: 'chars' })
        tl.from(
          split.chars,
          { opacity: 0, yPercent: 60, duration: 0.55, stagger: 0.025 },
          eyebrow ? '-=0.25' : 0
        )
      }

      tl.from(rest, { opacity: 0, y: 18, duration: 0.7, stagger: 0.12 }, '-=0.2')
    }

    if (heroAvatar) {
      tl.from(heroAvatar, { opacity: 0, scale: 0.92, duration: 0.9 }, 0.25)
    }

    // ── 2. 區塊 scroll 進場（.reveal）──
    const reveals = gsap.utils.toArray<HTMLElement>('.reveal')
    if (reveals.length) {
      gsap.set(reveals, { opacity: 0, y: 28 })
      ScrollTrigger.batch(reveals, {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.08,
            overwrite: true,
          }),
      })
    }

    // ── 3. 卡片網格逐張級聯（.reveal-stagger）──
    document.querySelectorAll<HTMLElement>('.reveal-stagger').forEach((grid) => {
      const items = gsap.utils.toArray<HTMLElement>(grid.children)
      if (!items.length) return
      gsap.set(items, { opacity: 0, y: 24 })
      ScrollTrigger.create({
        trigger: grid,
        start: 'top 85%',
        once: true,
        onEnter: () =>
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.09,
            overwrite: true,
          }),
      })
    })

    // ── 4. 日柱印章「蓋章」式彈入（.seal-stamp）──
    const seal = document.querySelector<HTMLElement>('.seal-stamp')
    if (seal) {
      gsap.set(seal, { scale: 1.45, opacity: 0, rotate: -7 })
      ScrollTrigger.create({
        trigger: seal,
        start: 'top 85%',
        once: true,
        onEnter: () =>
          gsap.to(seal, {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.7,
            ease: 'back.out(1.7)',
          }),
      })
    }

    // ── 5. 數字 count-up（[data-count-to]）──
    document.querySelectorAll<HTMLElement>('[data-count-to]').forEach((el) => {
      const to = parseFloat(el.dataset.countTo || '0')
      const suffix = el.dataset.countSuffix || ''
      if (!to) return
      const counter = { v: 0 }
      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () =>
          gsap.to(counter, {
            v: to,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.round(counter.v) + suffix
            },
          }),
      })
    })

    // 中文字型 swap 後版面會位移，刷新 ScrollTrigger 觸發點
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }

    // cleanup：SplitText 還原（tween/ScrollTrigger 由 useGSAP 自動 revert）
    return () => {
      split?.revert()
    }
  }, [])

  return null
}

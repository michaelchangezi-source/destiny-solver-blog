'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * 漣漪動態背景（純裝飾，aria-hidden）。SVG + GSAP，無 Canvas。
 *
 * 淺色 hero 底上用硃砂／橙描邊漣漪，每組三個同心環相隔約 380ms 發出，
 * 造成水波擴散感，約 1.6 秒一組背景自動觸發；另外支援 click 座標觸發（見 burstAt）。
 *
 * 完整尊重 prefers-reduced-motion（完全不生成，留空）。
 * 分頁隱藏／捲出視窗時自動暫停，慳電慳 CPU。
 */
export default function InkRippleMotif({
  onReady,
}: {
  /** 掛載完成後回傳一個可呼叫的 burst 函式，畀外層 hero click handler 用 */
  onReady?: (burstAt: (xPct: number, yPct: number) => void) => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ns = 'http://www.w3.org/2000/svg'
    const COLORS = ['rgba(178,62,38,.55)', 'rgba(224,85,44,.45)', 'rgba(156,122,63,.5)']
    const activeTimeouts = new Set<ReturnType<typeof setTimeout>>()
    const activeTweens = new Set<gsap.core.Tween>()

    function ring(cx: number, cy: number, size: number, color: string, delay: number) {
      const t = setTimeout(() => {
        activeTimeouts.delete(t)
        if (!svg) return
        const circle = document.createElementNS(ns, 'circle')
        circle.setAttribute('cx', String(cx))
        circle.setAttribute('cy', String(cy))
        circle.setAttribute('r', String(size * 0.05))
        circle.setAttribute('fill', 'none')
        circle.setAttribute('stroke', color)
        circle.setAttribute('stroke-width', '2')
        circle.setAttribute('opacity', '0')
        svg.appendChild(circle)

        const tween = gsap.to(circle, {
          attr: { r: size / 2 },
          opacity: 0,
          duration: 4.5,
          ease: 'power1.out',
          onStart: () => {
            gsap.to(circle, { opacity: 1, duration: 4.5 * 0.15, ease: 'power1.out' })
          },
          onComplete: () => {
            circle.remove()
            activeTweens.delete(tween)
          },
        })
        activeTweens.add(tween)
      }, delay)
      activeTimeouts.add(t)
    }

    function burst(x?: number, y?: number) {
      const w = svg!.viewBox.baseVal.width || 1200
      const h = svg!.viewBox.baseVal.height || 640
      const cx = x ?? Math.random() * w
      const cy = y ?? Math.random() * h
      const size = 120 + Math.random() * 240
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      ring(cx, cy, size, color, 0)
      ring(cx, cy, size, color, 380)
      ring(cx, cy, size, color, 760)
    }

    // 對外暴露：click 座標（百分比 0-1）轉 viewBox 座標後觸發
    function burstAtPct(xPct: number, yPct: number) {
      const w = svg!.viewBox.baseVal.width || 1200
      const h = svg!.viewBox.baseVal.height || 640
      burst(xPct * w, yPct * h)
    }
    onReady?.(burstAtPct)

    if (reduce) return

    let interval: ReturnType<typeof setInterval> | null = null
    let running = false

    function start() {
      if (running) return
      running = true
      burst()
      const t = setTimeout(() => burst(), 700)
      activeTimeouts.add(t)
      interval = setInterval(() => burst(), 1600)
    }

    function stop() {
      running = false
      if (interval) clearInterval(interval)
      interval = null
      activeTimeouts.forEach((t) => clearTimeout(t))
      activeTimeouts.clear()
      activeTweens.forEach((t) => t.kill())
      activeTweens.clear()
      while (svg!.firstChild) svg!.removeChild(svg!.firstChild)
    }

    start()

    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    const io = new IntersectionObserver(
      (entries) => (entries[0]?.isIntersecting ? start() : stop()),
      { threshold: 0 }
    )
    io.observe(svg)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVis)
      io.disconnect()
    }
  }, [onReady])

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    />
  )
}

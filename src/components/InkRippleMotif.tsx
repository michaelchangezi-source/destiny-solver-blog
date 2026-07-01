'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * 呼吸漣漪背景（純裝飾，aria-hidden）。SVG + GSAP，無 Canvas。
 *
 * 隨機在畫面不同座標、以不同大小生成漣漪圓圈，向外擴散淡出後移除，
 * 同時間最多幾個，疏落緩慢，如月映水面。
 *
 * 完整尊重 prefers-reduced-motion（完全不生成，留空）。
 * 分頁隱藏／捲出視窗時自動暫停，慳電慳 CPU。
 */
export default function InkRippleMotif() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const ns = 'http://www.w3.org/2000/svg'
    const MAX_CONCURRENT = 8
    const activeTweens = new Set<gsap.core.Tween>()
    let scheduled: gsap.core.Tween | null = null
    let running = false

    function spawnRipple() {
      if (!svg || svg.childElementCount >= MAX_CONCURRENT) return

      const cx = 60 + Math.random() * 1080
      const cy = 60 + Math.random() * 520
      const maxR = 40 + Math.random() * 200
      const warm = Math.random() > 0.4
      const stroke = warm ? '#E8A86E' : '#F4EEE1'
      const startOpacity = warm ? 0.4 : 0.22
      const duration = 7 + Math.random() * 4

      const circle = document.createElementNS(ns, 'circle')
      circle.setAttribute('cx', String(cx))
      circle.setAttribute('cy', String(cy))
      circle.setAttribute('r', '4')
      circle.setAttribute('fill', 'none')
      circle.setAttribute('stroke', stroke)
      circle.setAttribute('stroke-width', warm ? '1.4' : '1')
      circle.setAttribute('opacity', String(startOpacity))
      svg.appendChild(circle)

      const tween = gsap.to(circle, {
        attr: { r: maxR },
        opacity: 0,
        duration,
        ease: 'power1.out',
        onComplete: () => {
          circle.remove()
          activeTweens.delete(tween)
        },
      })
      activeTweens.add(tween)
    }

    function loop() {
      if (!running) return
      spawnRipple()
      scheduled = gsap.delayedCall(0.7 + Math.random() * 1.3, loop)
    }

    function start() {
      if (running) return
      running = true
      loop()
    }

    function stop() {
      running = false
      scheduled?.kill()
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
  }, [])

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

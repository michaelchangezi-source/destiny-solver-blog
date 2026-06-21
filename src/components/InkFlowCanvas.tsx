'use client'

import { useEffect, useRef } from 'react'

/**
 * 水墨流光背景（純裝飾，aria-hidden）。
 *
 * 兩層 Canvas 2D 疊加，無第三方庫，全瀏覽器一致：
 *  - 底層「墨」：深墨漸層 + 數團緩慢呼吸／飄移的水墨雲（低解析度渲染，省效能）。
 *  - 面層「流光」：粒子順流場走動，用 destination-out 淡出做拖尾、lighter 疊加做輝光，
 *    形成絲帶狀的暖色流光。
 *
 * 完整尊重 prefers-reduced-motion（畫一張靜態幀，不啟動 rAF）。
 * 分頁隱藏 / 捲出視窗時自動暫停，慳電慳 CPU。
 */
export default function InkFlowCanvas() {
  const inkRef = useRef<HTMLCanvasElement>(null)
  const lightRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // 巢狀函式（resize / draw…）內 TS 唔保留 null 窄化，故喺宣告即斷言非空。
    // useEffect 只在掛載後客戶端執行，ref 必已附上，2d context 對正常 canvas 亦不會為 null。
    const ink = inkRef.current!
    const light = lightRef.current!
    if (!ink || !light) return
    const ictx = ink.getContext('2d')!
    const lctx = light.getContext('2d')!

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    const S_INK = 0.5 // 墨層用半解析度（雲是糊的，肉眼睇唔出）
    const DPR_LIGHT = Math.min(window.devicePixelRatio || 1, 1.5)

    // 暖色票：朱紅 / 朱墨 / 暖金 / 米
    const warm: Array<[number, number, number]> = [
      [204, 92, 63],
      [178, 62, 38],
      [224, 170, 110],
      [240, 226, 200],
    ]

    type Plume = { x: number; y: number; r: number; dx: number; dy: number; phase: number; tint: string }
    let plumes: Plume[] = []

    type Particle = { x: number; y: number; life: number; maxLife: number; speed: number; col: [number, number, number] }
    let parts: Particle[] = []

    function spawn(fresh = false): Particle {
      const maxLife = 140 + Math.random() * 200
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        life: fresh ? 0 : Math.random() * maxLife,
        maxLife,
        speed: 0.35 + Math.random() * 1.0,
        col: warm[(Math.random() * warm.length) | 0],
      }
    }

    function initPlumes() {
      plumes = []
      const tints = ['rgba(120,55,35,', 'rgba(70,58,48,', 'rgba(38,32,26,']
      for (let i = 0; i < 6; i++) {
        plumes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.min(w, h) * (0.35 + Math.random() * 0.4),
          dx: (Math.random() - 0.5) * 0.1,
          dy: (Math.random() - 0.5) * 0.08,
          phase: Math.random() * Math.PI * 2,
          tint: tints[i % tints.length],
        })
      }
    }

    function initParts() {
      const n = Math.round(Math.min(170, Math.max(70, w / 11)))
      parts = []
      for (let i = 0; i < n; i++) parts.push(spawn())
    }

    function resize() {
      const rect = ink.getBoundingClientRect()
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      ink.width = Math.round(w * S_INK)
      ink.height = Math.round(h * S_INK)
      light.width = Math.round(w * DPR_LIGHT)
      light.height = Math.round(h * DPR_LIGHT)
      ictx.setTransform(S_INK, 0, 0, S_INK, 0, 0)
      lctx.setTransform(DPR_LIGHT, 0, 0, DPR_LIGHT, 0, 0)
      initPlumes()
      initParts()
    }

    function field(x: number, y: number, t: number) {
      return (
        Math.sin(x * 0.0016 + t * 0.00022) +
        Math.cos(y * 0.0019 - t * 0.00026) +
        Math.sin((x + y) * 0.0011 + t * 0.00031)
      ) * Math.PI
    }

    function drawInk(t: number) {
      ictx.clearRect(0, 0, w, h)
      const g = ictx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, '#3A332B')
      g.addColorStop(0.55, '#453C32')
      g.addColorStop(1, '#4F4538')
      ictx.fillStyle = g
      ictx.fillRect(0, 0, w, h)

      for (const p of plumes) {
        const breathe = 0.85 + Math.sin(t * 0.0004 + p.phase) * 0.15
        const px = p.x + Math.sin(t * 0.0002 + p.phase) * 40
        const py = p.y + Math.cos(t * 0.00017 + p.phase) * 30
        const r = p.r * breathe
        const rg = ictx.createRadialGradient(px, py, 0, px, py, r)
        rg.addColorStop(0, p.tint + '0.30)')
        rg.addColorStop(0.5, p.tint + '0.12)')
        rg.addColorStop(1, p.tint + '0)')
        ictx.fillStyle = rg
        ictx.fillRect(0, 0, w, h)
        p.x += p.dx
        p.y += p.dy
        if (p.x < -p.r) p.x = w + p.r
        if (p.x > w + p.r) p.x = -p.r
        if (p.y < -p.r) p.y = h + p.r
        if (p.y > h + p.r) p.y = -p.r
      }

      // 頂部朱紅暈光
      const tg = ictx.createRadialGradient(w * 0.5, -h * 0.1, 0, w * 0.5, -h * 0.1, h * 0.9)
      tg.addColorStop(0, 'rgba(178,62,38,0.12)')
      tg.addColorStop(1, 'rgba(178,62,38,0)')
      ictx.fillStyle = tg
      ictx.fillRect(0, 0, w, h)
    }

    function drawLight(t: number) {
      lctx.globalCompositeOperation = 'destination-out'
      lctx.fillStyle = 'rgba(0,0,0,0.045)'
      lctx.fillRect(0, 0, w, h)

      lctx.globalCompositeOperation = 'lighter'
      for (const p of parts) {
        const a = field(p.x, p.y, t)
        p.x += Math.cos(a) * p.speed
        p.y += Math.sin(a) * p.speed
        p.life++
        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.45
        const [r, gg, b] = p.col
        lctx.fillStyle = `rgba(${r},${gg},${b},${alpha})`
        lctx.beginPath()
        lctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2)
        lctx.fill()
        if (p.life >= p.maxLife || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
          Object.assign(p, spawn(true))
        }
      }
      lctx.globalCompositeOperation = 'source-over'
    }

    let raf = 0
    let running = false

    function frame(now: number) {
      if (!running) return
      drawInk(now)
      drawLight(now)
      raf = requestAnimationFrame(frame)
    }

    function start() {
      if (running || reduce) return
      running = true
      raf = requestAnimationFrame(frame)
    }
    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    resize()

    if (reduce) {
      // 靜態幀：墨層 + 預跑流場累積出絲帶，唔啟動動畫
      drawInk(0)
      for (let i = 0; i < 260; i++) drawLight(i * 16)
    } else {
      start()
    }

    const onResize = () => resize()
    const onVis = () => (document.hidden ? stop() : start())
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVis)

    const io = new IntersectionObserver(
      (entries) => (entries[0]?.isIntersecting ? start() : stop()),
      { threshold: 0 }
    )
    io.observe(ink)

    return () => {
      stop()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
      io.disconnect()
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <canvas ref={inkRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={lightRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}

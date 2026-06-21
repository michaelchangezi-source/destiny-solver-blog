'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import InkFlowCanvas from './InkFlowCanvas'

gsap.registerPlugin(useGSAP, SplitText)

export type HeroToday = {
  stem: string
  branch: string
  energyTitle: string
  dateLabel: string
  weekday: string
  yi: string[]
  buYi: string[]
}

// /hero-demo 等無伺服器資料的情境用的後備樣本。
const FALLBACK: HeroToday = {
  stem: '丙',
  branch: '午',
  energyTitle: '火旺通明',
  dateLabel: '六月廿一',
  weekday: '週六',
  yi: ['面談', '簽約', '表態', '創作'],
  buYi: ['爭執', '遠行'],
}

/**
 * 水墨流光 Hero。
 * 暖墨 cinematic 背景 + 玻璃命盤卡，文字逐字浮現。
 * 進場狀態一律由 GSAP from() 設定，無 JS / reduced-motion 下內容照樣可見。
 */
export default function InkFlowHero({ today = FALLBACK }: { today?: HeroToday }) {
  const root = useRef<HTMLElement>(null)
  const yi = (today.yi || []).slice(0, 3)
  const buYi = (today.buYi || []).slice(0, 2)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const scope = root.current
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
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      className="relative w-full overflow-hidden bg-[#3A332B] text-[#F4EEE1] min-h-[calc(100vh-4rem)]"
    >
      <InkFlowCanvas />

      {/* 浮水印大字：炁（樞衡真詮），淡墨筆觸 */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <span className="font-serif font-black leading-none text-[#1E1813] opacity-[0.12] text-[44vw] lg:text-[34vw]">
          炁
        </span>
      </div>

      {/* 內容 */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-4 py-20 sm:px-6">
        <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* 左：文字 */}
          <div className="flex-1">
            <p className="hero-d-eyebrow mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#E8A86E]">
              命運解決師 · DESTINY SOLVER · 陳卓賢
            </p>

            <h1 className="hero-d-h1 mb-6 font-serif text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              用命理
              <br />
              <span className="text-[#CC5C3F]" style={{ textShadow: '0 0 42px rgba(204,92,63,0.35)' }}>
                讀懂你
              </span>
              <br />
              這個人
            </h1>

            <p className="hero-d-sub mb-10 max-w-lg text-lg leading-relaxed text-[#F4EEE1]/80">
              不是預測命運，是認識自己。透過八字命理的框架，看見你的能量結構、人生格局與時勢流動。
            </p>

            <div className="hero-d-stats mb-10 flex flex-wrap items-center gap-7 text-sm text-[#F4EEE1]/60">
              <div>
                <span className="mr-1.5 text-2xl font-black text-[#F4EEE1]">每周更新</span>命理文章
              </div>
              <div className="h-5 w-px bg-[#F4EEE1]/20" />
              <div>
                <span className="mr-1.5 text-2xl font-black text-[#F4EEE1]">100萬+</span>每月 Threads 瀏覽量
              </div>
              <div className="h-5 w-px bg-[#F4EEE1]/20" />
              <div>
                <span className="mr-1.5 text-2xl font-black text-[#F4EEE1]">免費</span>開放閱讀
              </div>
            </div>

            <div className="hero-d-cta flex flex-wrap gap-4">
              <Link
                href="/latest"
                className="flex items-center gap-2 rounded bg-[#B23E26] px-7 py-3.5 font-bold text-[#F7F1E5] transition-all hover:bg-[#96321E] hover:shadow-[0_14px_30px_-10px_rgba(178,62,38,0.7)] active:scale-[0.97]"
              >
                從這裡開始 <ArrowRight size={18} />
              </Link>
              <Link
                href="/consultation"
                className="flex items-center gap-2 rounded border border-[#F4EEE1]/30 px-7 py-3.5 font-medium text-[#F4EEE1]/90 transition-all hover:border-[#E8A86E]/80 hover:text-[#F4EEE1] active:scale-[0.97]"
              >
                預約諮詢
              </Link>
            </div>
          </div>

          {/* 右：玻璃命盤卡（真實今日命盤） */}
          <div className="hero-d-card flex flex-shrink-0 justify-center lg:justify-end">
            <div className="relative w-full max-w-[380px] rounded-[28px] border border-white/30 bg-white/[0.14] p-7 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/[0.2] to-white/[0.03]" />

              <div className="relative">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F4EEE1]/50">
                    Today · 今日命盤
                  </span>
                  <span className="text-[11px] text-[#F4EEE1]/50">
                    {today.dateLabel} · {today.weekday}
                  </span>
                </div>

                <div className="mb-6 flex items-center gap-5">
                  <div className="flex h-24 w-20 flex-shrink-0 flex-col items-center justify-center rounded-lg border border-[#CC5C3F]/45 bg-[#CC5C3F]/[0.1]">
                    <span className="font-serif text-5xl font-black leading-none text-[#CC5C3F]">{today.stem}</span>
                    <span className="font-serif text-4xl font-bold leading-none text-[#F4EEE1]">{today.branch}</span>
                  </div>
                  <div>
                    <p className="font-serif text-xl font-black leading-snug text-[#E8A86E]">{today.energyTitle}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#F4EEE1]/65">每日命盤更新，按下方看完整流年。</p>
                  </div>
                </div>

                <div className="mb-5 space-y-3">
                  {yi.length > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] font-semibold tracking-widest text-[#7FB69A]">今日宜</p>
                      <div className="flex flex-wrap gap-2">
                        {yi.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-[#F4EEE1]/20 px-3 py-1 text-xs text-[#F4EEE1]/85"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {buYi.length > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] font-semibold tracking-widest text-[#E08A6E]">今日不宜</p>
                      <div className="flex flex-wrap gap-2">
                        {buYi.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-[#F4EEE1]/20 px-3 py-1 text-xs text-[#F4EEE1]/75"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/daily"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#F4EEE1] font-bold text-[#241B14] transition-all hover:bg-white active:scale-[0.98]"
                >
                  完整分析 <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部過渡到紙色頁面 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#F4EEE1]" />
    </section>
  )
}

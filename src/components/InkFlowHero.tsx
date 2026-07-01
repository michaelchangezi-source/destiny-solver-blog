'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import InkRippleMotif from './InkRippleMotif'

gsap.registerPlugin(useGSAP, SplitText)

export type HeroToday = {
  stem: string
  branch: string
  energyTitle: string
  dateLabel: string
  weekday: string
  accent: string // 日柱五行色（隨日變：木綠火紅土啡金藍水靛）
  yi: string[]
  buYi: string[]
}

// /hero-demo 等無伺服器資料的情境用的後備樣本。
const FALLBACK: HeroToday = {
  stem: '丙',
  branch: '寅',
  energyTitle: '火氣獨旺，光明之日',
  dateLabel: '2026年6月21日',
  weekday: '週日',
  accent: '#C24A2E',
  yi: ['公開演講、簡報、提案', '品牌推廣、社群發帖', '社交應酬、拓展人際'],
  buYi: ['激動爭論、口舌是非', '倉促簽署複雜合約'],
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
      <InkRippleMotif />

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
              <span className="text-[#F47B4A]" style={{ textShadow: '0 0 40px rgba(244,123,74,0.55)' }}>
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
                className="flex items-center gap-2 rounded bg-[#E0552C] px-7 py-3.5 font-bold text-[#FBF7EE] shadow-[0_12px_30px_-8px_rgba(224,85,44,0.7)] transition-all hover:bg-[#C9461F] hover:shadow-[0_16px_36px_-10px_rgba(224,85,44,0.85)] active:scale-[0.97]"
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

          {/* 右：淺色霜面命盤卡（真實今日命盤；日柱隨五行變色）。
             淺奶油底浮於深色 hero 之上，反差強；五行色（綠/紅/啡/藍/靛）在淺底上一律清晰。 */}
          <div className="hero-d-card flex flex-shrink-0 justify-center lg:justify-end">
            <div className="relative w-full max-w-[380px] rounded-[28px] border border-[#2B241C]/10 bg-[#FBF7EE]/90 p-7 text-[#2B241C] shadow-[0_44px_100px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9C9282]">
                  Today · 今日命盤
                </span>
                <span className="text-[11px] text-[#9C9282]">
                  {today.dateLabel} · {today.weekday}
                </span>
              </div>

              <div className="mb-6 flex items-center gap-5">
                <div
                  className="flex h-24 w-20 flex-shrink-0 flex-col items-center justify-center rounded-lg border"
                  style={{ borderColor: `${today.accent}66`, background: `${today.accent}12` }}
                >
                  <span className="font-serif text-5xl font-black leading-none" style={{ color: today.accent }}>
                    {today.stem}
                  </span>
                  <span className="font-serif text-4xl font-bold leading-none text-[#2B241C]">{today.branch}</span>
                </div>
                <div>
                  <p className="font-serif text-xl font-black leading-snug" style={{ color: today.accent }}>
                    {today.energyTitle}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#6B6155]">每日命盤更新，按下方看完整流年。</p>
                </div>
              </div>

              <div className="mb-5 space-y-3">
                {yi.length > 0 && (
                  <div>
                    <p className="mb-2 text-[10px] font-semibold tracking-widest text-[#2E7D52]">今日宜</p>
                    <div className="flex flex-wrap gap-2">
                      {yi.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[#2B241C]/12 px-3 py-1 text-xs text-[#5A5247]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {buYi.length > 0 && (
                  <div>
                    <p className="mb-2 text-[10px] font-semibold tracking-widest text-[#C24A2E]">今日不宜</p>
                    <div className="flex flex-wrap gap-2">
                      {buYi.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[#2B241C]/12 px-3 py-1 text-xs text-[#6B6155]"
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
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#B23E26] font-bold text-[#F7F1E5] transition-all hover:bg-[#96321E] active:scale-[0.98]"
              >
                完整分析 <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 底部過渡到紙色頁面 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#F4EEE1]" />
    </section>
  )
}

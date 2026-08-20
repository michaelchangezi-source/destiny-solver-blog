'use client'

import { useCallback, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import InkRippleMotif from './InkRippleMotif'

export type HeroToday = {
  stem: string
  branch: string
  energyTitle: string
  dateLabel: string
  weekday: string
  accent: string // 日柱五行色（隨日變：木綠火紅土啡金藍水靛）
  yi: string[]
  buYi: string[]
  solarTerm?: string | null
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
 * Hero：淺色底 + 漣漪動態 + click 互動。
 * 進場狀態一律由 GSAP from() 設定，無 JS / reduced-motion 下內容照樣可見。
 */
export default function InkFlowHero({ today = FALLBACK }: { today?: HeroToday }) {
  const burstRef = useRef<((xPct: number, yPct: number) => void) | null>(null)
  const yi = (today.yi || []).slice(0, 3)
  const buYi = (today.buYi || []).slice(0, 2)

  const handleRippleReady = useCallback((burstAt: (xPct: number, yPct: number) => void) => {
    burstRef.current = burstAt
  }, [])

  const handleHeroClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const xPct = (e.clientX - rect.left) / rect.width
    const yPct = (e.clientY - rect.top) / rect.height
    burstRef.current?.(xPct, yPct)
    // 唔 preventDefault：連結／按鈕照常導航
  }, [])

  return (
    <section
      onClick={handleHeroClick}
      className="ink-flow-hero relative w-full overflow-hidden bg-[#F7F5EE] text-[#2B241C] border-b border-[#2B241C]/10"
    >
      <InkRippleMotif onReady={handleRippleReady} />

      {/* 右下角小型描邊裝飾（取代舊 44vw 巨型水印） */}
      <div className="pointer-events-none absolute -right-6 -bottom-10 select-none">
        <span
          className="font-serif font-black leading-none text-transparent text-[220px] sm:text-[260px]"
          style={{ WebkitTextStroke: '1.5px rgba(178,62,38,0.1)' }}
        >
          炁
        </span>
      </div>

      {/* 內容 */}
      <div className="relative z-10 mx-auto flex max-w-6xl items-center px-4 py-16 sm:py-20 lg:py-24 sm:px-6 lg:min-h-[680px]">
        <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          {/* 左：文字 */}
          <div className="flex-1 min-w-0">
            <p className="hero-d-eyebrow mb-6 text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.35em] text-[#B23E26]">
              命運解決師 · DESTINY SOLVER · 陳卓賢
            </p>

            <h1 className="hero-d-h1 mb-6 font-serif text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl text-[#2B241C]">
              用命理
              <br />
              <span className="text-[#E0552C]">讀懂你</span>
              <br />
              這個人
            </h1>

            <p className="hero-d-sub mb-8 max-w-lg text-base sm:text-lg leading-relaxed text-[#6B6155]">
              不是預測命運，是認識自己。
              <br />
              透過八字框架，看見你的能量結構、格局與時勢。
            </p>

            <div className="hero-d-stats mb-8 grid grid-cols-3 sm:flex sm:flex-wrap sm:items-center sm:gap-7 gap-2 text-sm text-[#6B6155]">
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-2xl font-bold text-[#2B241C]">每周更新</div>
                <div className="text-[11px] sm:inline sm:text-sm sm:ml-0">命理文章</div>
              </div>
              <div className="hidden sm:block h-5 w-px bg-[#2B241C]/15" />
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-2xl font-bold text-[#2B241C]">100萬+</div>
                <div className="text-[11px] sm:inline sm:text-sm">每月 Threads 觸及</div>
              </div>
              <div className="hidden sm:block h-5 w-px bg-[#2B241C]/15" />
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-2xl font-bold text-[#2B241C]">免費</div>
                <div className="text-[11px] sm:inline sm:text-sm">開放閱讀</div>
              </div>
            </div>

            <div className="hero-d-cta flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/bazi"
                className="flex items-center justify-center gap-2 rounded-lg bg-[#E0552C] px-7 py-4 sm:py-3.5 font-bold text-[#FBF7EE] shadow-[0_10px_24px_-10px_rgba(224,85,44,0.45)] transition-[background-color,transform] duration-200 hover:bg-[#C9461F] active:scale-[0.97]"
              >
                免費排盤，讀你的命局 <ArrowRight size={18} />
              </Link>
              <Link
                href="/consultation"
                className="flex items-center justify-center gap-2 rounded-lg border border-[#2B241C]/20 px-7 py-4 sm:py-3.5 font-medium text-[#2B241C] transition-[color,border-color,transform] duration-200 hover:border-[#B23E26] hover:text-[#B23E26] active:scale-[0.97]"
              >
                預約諮詢
              </Link>
            </div>
          </div>

          {/* 右：今日命盤卡 */}
          <div className="hero-d-card flex flex-shrink-0 justify-center lg:justify-end">
            <div className="relative w-full max-w-[380px] rounded-lg border border-[color:var(--border-card)] bg-[#FFFFFF] p-7 text-[#2B241C] shadow-[0_24px_60px_-28px_rgba(43,36,28,0.28)]">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B23E26] flex items-center gap-2">
                  TODAY · 今日能量
                  {today.solarTerm && (
                    <span className="inline-flex items-center rounded-full bg-[#B23E26]/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-[#B23E26]">
                      {today.solarTerm}
                    </span>
                  )}
                </span>
                <span className="text-[13px] text-[#6B6155]">
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
                    <p className="mb-2 text-[10px] font-semibold tracking-widest text-[#5E7355]">今日宜</p>
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
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#B23E26] font-bold text-[#F7F1E5] transition-[background-color,transform] duration-200 hover:bg-[#96321E] active:scale-[0.98]"
              >
                完整分析 <ArrowRight size={16} />
              </Link>

              {/* 上面嗰張係大環境能量，人人一樣；呢條連去對照個人日柱嗰個版本 */}
              <Link
                href="/daily/me"
                className="mt-2.5 flex items-center justify-center gap-1 text-[13px] text-[#6B6155] transition-colors duration-200 hover:text-[#B23E26]"
              >
                今日對你自己又點？ <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

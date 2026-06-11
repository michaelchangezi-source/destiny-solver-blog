import type { Metadata } from 'next'
import { analyzeDays, ELEMENT_COLOR } from '@/lib/bazi-daily'
import type { DayAnalysis, Element } from '@/lib/bazi-daily'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '日運能量｜今日及未來一週八字流日分析',
  description: '根據流年、流月、流日三柱六字五行計分，分析每日大環境能量，提供宜忌參考。非個人命盤，適用所有人。',
}

// ── 元件：柱顯示 ─────────────────────────────────────────

function PillarBadge({ label, stem, branch, element, size = 'sm' }: {
  label: string
  stem: string
  branch: string
  element: Element
  size?: 'sm' | 'lg'
}) {
  const color = ELEMENT_COLOR[element]
  const stemSize = size === 'lg' ? 'text-4xl' : 'text-xl'
  const branchSize = size === 'lg' ? 'text-3xl' : 'text-lg'

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[#8A8071] text-[10px] tracking-widest">{label}</span>
      <div
        className="flex flex-col items-center justify-center rounded border px-3 py-2 gap-0.5"
        style={{ borderColor: `${color}40`, background: `${color}10` }}
      >
        <span className={`font-serif font-black leading-none ${stemSize}`} style={{ color }}>
          {stem}
        </span>
        <span className={`font-serif font-bold leading-none ${branchSize} text-[#3A332A]`}>
          {branch}
        </span>
      </div>
      <span className="text-[10px]" style={{ color }}>{element}</span>
    </div>
  )
}

// ── 元件：五行能量條 ──────────────────────────────────────

function ElementBar({ scores }: { scores: Record<Element, number> }) {
  const elements: Element[] = ['木', '火', '土', '金', '水']
  const max = Math.max(...Object.values(scores))

  return (
    <div className="space-y-2">
      {elements.map(el => {
        const val = scores[el]
        const pct = max > 0 ? (val / max) * 100 : 0
        return (
          <div key={el} className="flex items-center gap-3">
            <span className="text-xs w-4 text-center font-bold" style={{ color: ELEMENT_COLOR[el] }}>{el}</span>
            <div className="flex-1 h-1.5 bg-[#2B241C]/[0.07] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: ELEMENT_COLOR[el] }}
              />
            </div>
            <span className="text-[#8A8071] text-[10px] w-6 text-right">{val.toFixed(1)}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── 元件：互動標籤 ───────────────────────────────────────

function InteractionTag({ type }: { type: '合' | '沖' | '刑' | '害' }) {
  const styles = {
    合: 'bg-[#2E7D52]/15 text-[#2E7D52] border-[#2E7D52]/30',
    沖: 'bg-[#C24A2E]/15 text-[#C24A2E] border-[#C24A2E]/30',
    刑: 'bg-[#B23E26]/15 text-[#B23E26] border-[#B23E26]/30',
    害: 'bg-[#4A7A96]/15 text-[#4A7A96] border-[#4A7A96]/30',
  }
  return (
    <span className={`inline-flex items-center border rounded-full px-2 py-0.5 text-[11px] font-bold ${styles[type]}`}>
      {type}
    </span>
  )
}

// ── 元件：今日完整分析 ───────────────────────────────────

function TodayCard({ day }: { day: DayAnalysis }) {
  const mainColor = ELEMENT_COLOR[day.dominantElements[0]]

  return (
    <div className="rounded-sm border border-[#2B241C]/10 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#2B241C]/10" style={{ background: `${mainColor}08` }}>
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          {/* 三柱 */}
          <div className="flex items-end gap-4">
            <PillarBadge label="流年" stem={day.yearPillar.stem} branch={day.yearPillar.branch} element={day.yearPillar.element} />
            <PillarBadge label="流月" stem={day.monthPillar.stem} branch={day.monthPillar.branch} element={day.monthPillar.element} />
            <PillarBadge label="流日" stem={day.dayPillar.stem} branch={day.dayPillar.branch} element={day.dayPillar.element} size="lg" />
          </div>

          {/* 能量標題 + 互動 */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-semibold tracking-widest text-[#8A8071] uppercase">TODAY</span>
              <span className="text-[#9C9282]">·</span>
              <span className="text-[#8A8071] text-[11px]">{day.dateLabel} {day.weekday}</span>
            </div>
            <h2 className="font-serif text-2xl font-black mb-3" style={{ color: mainColor }}>
              {day.energyTitle}
            </h2>
            {day.dominantElements.length > 1 && (
              <div className="flex gap-2 mb-3">
                {day.dominantElements.map(el => (
                  <span key={el} className="text-xs border rounded-full px-2 py-0.5 font-bold"
                    style={{ color: ELEMENT_COLOR[el], borderColor: `${ELEMENT_COLOR[el]}40` }}>
                    {el}旺
                  </span>
                ))}
              </div>
            )}
            {day.interactions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {day.interactions.map((ix, i) => (
                  <InteractionTag key={i} type={ix.type} />
                ))}
              </div>
            )}
          </div>

          {/* 五行能量條 */}
          <div className="sm:w-44 w-full">
            <p className="text-[#8A8071] text-[10px] tracking-widest mb-2">五行強弱</p>
            <ElementBar scores={day.elementScores} />
          </div>
        </div>
      </div>

      {/* 能量描述 */}
      <div className="px-6 py-5 border-b border-[#2B241C]/10">
        <p className="text-[#5A5247] leading-relaxed text-sm">{day.energyDesc}</p>
      </div>

      {/* 干支互動 */}
      {day.interactions.length > 0 && (
        <div className="px-6 py-5 border-b border-[#2B241C]/10">
          <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-3">干支互動</p>
          <div className="space-y-3">
            {day.interactions.map((ix, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <InteractionTag type={ix.type} />
                </div>
                <div>
                  <p className="text-[#5A5247] text-xs mb-0.5">{ix.description}</p>
                  <p className="text-[#6B6155] text-xs leading-relaxed">{ix.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 宜 / 不宜 */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#2B241C]/10">
        <div className="px-6 py-5">
          <p className="text-[#2E7D52] text-xs font-semibold tracking-widest mb-4">宜</p>
          <ul className="space-y-3">
            {day.yi.map((y, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[#2E7D52] text-xs mt-0.5 flex-shrink-0">◆</span>
                <div>
                  <span className="text-[#2B241C] text-sm font-semibold">{y.item}</span>
                  <p className="text-[#6B6155] text-xs mt-0.5 leading-relaxed">{y.reason}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-6 py-5">
          <p className="text-[#C24A2E] text-xs font-semibold tracking-widest mb-4">不宜</p>
          <ul className="space-y-3">
            {day.buYi.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[#C24A2E] text-xs mt-0.5 flex-shrink-0">◆</span>
                <div>
                  <span className="text-[#2B241C] text-sm font-semibold">{b.item}</span>
                  <p className="text-[#6B6155] text-xs mt-0.5 leading-relaxed">{b.reason}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 三柱綜合 */}
      <div className="px-6 py-5 border-t border-[#2B241C]/10 bg-[#FBF7EE]/[0.02]">
        <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-2">三柱綜合</p>
        <p className="text-[#6B6155] text-sm leading-relaxed">{day.summary}</p>
      </div>
    </div>
  )
}

// ── 元件：一週簡覽卡 ─────────────────────────────────────

function WeekCard({ day }: { day: DayAnalysis }) {
  const mainColor = ELEMENT_COLOR[day.dominantElements[0]]
  const hasChong = day.interactions.some(i => i.type === '沖')
  const hasHe = day.interactions.some(i => i.type === '合')

  return (
    <div className="rounded border border-[#2B241C]/10 hover:border-[#2B241C]/20 p-4 flex flex-col gap-3 transition-colors">
      {/* 日期 */}
      <div>
        <p className="text-[#8A8071] text-[10px]">{day.dateLabel}</p>
        <p className="text-[#5A5247] text-xs font-semibold">{day.weekday}</p>
      </div>

      {/* 日柱 + 標題 */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center w-9 h-10 justify-center rounded border flex-shrink-0"
          style={{ borderColor: `${mainColor}40`, background: `${mainColor}10` }}>
          <span className="font-serif font-black text-lg leading-none" style={{ color: mainColor }}>
            {day.dayPillar.stem}
          </span>
          <span className="font-serif font-bold text-sm leading-none text-[#5A5247]">
            {day.dayPillar.branch}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#2B241C] text-xs font-semibold leading-snug line-clamp-2">{day.energyTitle}</p>
          <div className="flex gap-1 mt-1 flex-wrap">
            {day.dominantElements.map(el => (
              <span key={el} className="text-[10px]" style={{ color: ELEMENT_COLOR[el] }}>{el}</span>
            ))}
            {hasChong && <span className="text-[10px] text-[#C24A2E]">· 沖</span>}
            {hasHe && <span className="text-[10px] text-[#2E7D52]">· 合</span>}
          </div>
        </div>
      </div>

      {/* 宜（前3） */}
      <div>
        <p className="text-[#2E7D52] text-[10px] font-semibold tracking-widest mb-1">宜</p>
        <ul className="space-y-0.5">
          {day.yi.slice(0, 3).map((y, i) => (
            <li key={i} className="text-[#6B6155] text-[11px] truncate">· {y.item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ── 主頁面 ───────────────────────────────────────────────

export default function DailyPage() {
  const days = analyzeDays(8)
  const today = days[0]
  const week = days.slice(1)

  return (
    <div className="pb-1">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <p className="text-[#B23E26] text-xs font-semibold tracking-[0.35em] uppercase mb-2">DAILY ENERGY</p>
        <h1 className="font-serif text-[#2B241C] text-4xl font-black mb-3">日運能量</h1>
        <p className="text-[#6B6155] text-sm max-w-2xl leading-relaxed">
          根據流年、流月、流日三柱六字五行強弱計分，分析每日大環境的能量格局，提供宜忌參考。此分析為大環境通用，非個人命盤，所有人適用。
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <TodayCard day={today} />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-center gap-3 mb-5">
          <p className="text-[#B23E26] text-xs font-semibold tracking-[0.3em] uppercase">未來一週</p>
          <div className="flex-1 h-px bg-[#2B241C]/[0.06]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {week.map((d, i) => (
            <WeekCard key={i} day={d} />
          ))}
        </div>
      </section>
    </div>
  )
}

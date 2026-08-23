'use client'

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { calculate, stemColor, branchColor, BRANCHES, hourBranchOf, tenGodOf } from '@/lib/bazi-calc'
import type { BaziResult, Pillar, DaYun } from '@/lib/bazi-calc'
import type { ArticleMeta } from '@/types'
import { twelveStage, emptyBranches, xunName, nayin, computeShenSha } from '@/lib/bazi-shensha'
import type { ShenShaHit } from '@/lib/bazi-shensha'
import { monthCells, dayCells, hourCells, yearGanZhi, branchInteractions, lifeTable } from '@/lib/bazi-timeline'
import { useChartLibrary } from './useChartLibrary'
import ChartLibrary from './ChartLibrary'
import type html2canvasType from 'html2canvas'

// 常用出生地經度與時區標準經線（真太陽時校正用）
const PLACES = [
  { key: 'HK', label: '香港',   lon: 114.17, meridian: 120 },
  { key: 'MO', label: '澳門',   lon: 113.55, meridian: 120 },
  { key: 'TP', label: '台北',   lon: 121.52, meridian: 120 },
  { key: 'GZ', label: '廣州',   lon: 113.26, meridian: 120 },
  { key: 'SZ', label: '深圳',   lon: 114.06, meridian: 120 },
  { key: 'SG', label: '新加坡', lon: 103.82, meridian: 120 },
  { key: 'KL', label: '吉隆坡', lon: 101.69, meridian: 120 },
  { key: 'TO', label: '多倫多', lon: -79.38, meridian: -75 },
  { key: 'VA', label: '溫哥華', lon: -123.12, meridian: -120 },
  { key: 'LD', label: '倫敦',   lon: -0.13,  meridian: 0 },
  { key: 'SY', label: '悉尼',   lon: 151.21, meridian: 150 },
  { key: 'CUSTOM', label: '自訂經度', lon: 114.17, meridian: 120 },
]

type DetailLevel = 'simple' | 'standard' | 'full'
const DETAIL_OPTIONS: { value: DetailLevel; label: string }[] = [
  { value: 'simple',   label: '精簡' },
  { value: 'standard', label: '標準' },
  { value: 'full',     label: '完整' },
]

const HOUR_OPTIONS = [
  { value: -1, label: '不確定時辰' },
  { value: 0,  label: '子時 23:00–01:00' },
  { value: 1,  label: '丑時 01:00–03:00' },
  { value: 2,  label: '寅時 03:00–05:00' },
  { value: 3,  label: '卯時 05:00–07:00' },
  { value: 4,  label: '辰時 07:00–09:00' },
  { value: 5,  label: '巳時 09:00–11:00' },
  { value: 6,  label: '午時 11:00–13:00' },
  { value: 7,  label: '未時 13:00–15:00' },
  { value: 8,  label: '申時 15:00–17:00' },
  { value: 9,  label: '酉時 17:00–19:00' },
  { value: 10, label: '戌時 19:00–21:00' },
  { value: 11, label: '亥時 21:00–23:00' },
]

function PillarCard({ pillar, label, isDay, detail, dayStem, kong }: {
  pillar: Pillar; label: string; isDay: boolean
  detail: DetailLevel; dayStem: number; kong: number[]
}) {
  const sc = stemColor(pillar.stem)
  const bc = branchColor(pillar.branch)
  const showMore = detail !== 'simple'
  const isKong = kong.includes(pillar.branch)

  return (
    <div className={`flex flex-col items-center gap-2 rounded-lg border p-3 sm:p-4 shadow-[var(--shadow-card)] ${
      isDay ? 'border-[#B23E26]/60 bg-[#B23E26]/[0.06]' : 'border-[color:var(--border-card)] bg-[#FBF7EE]/[0.02]'
    }`}>
      <p className="text-[#8A8071] text-[9px] tracking-[0.2em]">{label}</p>

      {/* 天干 */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-4xl sm:text-5xl font-black font-serif leading-none" style={{ color: sc }}>
          {pillar.stemChar}
        </span>
        <span
          className="text-[10px] px-2 py-0.5 rounded border"
          style={isDay
            ? { color: '#B23E26', borderColor: '#B23E2650', background: '#B23E2612' }
            : { color: sc, borderColor: `${sc}50`, background: `${sc}12` }
          }
        >
          {isDay ? '日主' : (pillar.tenGod ?? '')}
        </span>
      </div>

      {/* 地支 */}
      <span className="text-3xl sm:text-4xl font-bold font-serif leading-none" style={{ color: bc, opacity: 0.85 }}>
        {pillar.branchChar}
      </span>

      {/* 十二長生、納音、空亡（標準與完整模式） */}
      {showMore && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] px-2 py-0.5 rounded border border-[#2B241C]/15 text-[#5A5247] bg-[#2B241C]/[0.04]">
            {twelveStage(dayStem, pillar.branch)}
          </span>
          <span className="text-[9px] text-[#8A8071]">{nayin(pillar.stem, pillar.branch)}</span>
          {isKong && (
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-[#B23E26]/40 text-[#B23E26]">空亡</span>
          )}
        </div>
      )}

      {/* 藏干 */}
      <div className="w-full mt-1 pt-2 border-t border-[#2B241C]/30/[0.06] space-y-1 min-h-[3rem]">
        {pillar.hiddenStems.map((hs, i) => (
          <div key={i} className="flex items-center justify-between gap-1">
            <span className="text-sm font-bold font-serif" style={{ color: stemColor(hs.stemIdx) }}>
              {hs.char}
            </span>
            <span className="text-[10px] text-[#6B6155]">{hs.tenGod}</span>
            <span className="text-[9px] text-[#6B6155]">{hs.tier}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DaYunCard({ dy, isCurrent, isSelected, tenGod, stage, onSelect }: {
  dy: DaYun; isCurrent: boolean; isSelected: boolean
  tenGod: string; stage: string; onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`flex flex-col items-center gap-1 rounded-lg border p-2 shadow-[var(--shadow-card)] transition-colors ${
        isSelected
          ? 'border-[#E0552C] bg-[#B23E26]/[0.12]'
          : isCurrent
            ? 'border-[#B23E26]/60 bg-[#B23E26]/[0.07]'
            : 'border-[color:var(--border-card)] bg-[#FBF7EE]/[0.02] hover:border-[#B23E26]/40'
      }`}
    >
      <span className="text-[9px] text-[#8A8071] leading-none">{tenGod}</span>
      <span className="text-xl font-black font-serif leading-none" style={{ color: stemColor(dy.stem) }}>
        {dy.stemChar}
      </span>
      <span className="text-lg font-bold font-serif leading-none" style={{ color: branchColor(dy.branch), opacity: 0.85 }}>
        {dy.branchChar}
      </span>
      <span className="text-[9px] text-[#6B6155] leading-none">{stage}</span>
      <div className="mt-0.5 text-center">
        <p className="text-[11px] text-[#B23E26] font-medium">{dy.startAge}歲</p>
        <p className="text-[9px] text-[#8A8071]">{dy.startYear}</p>
      </div>
    </button>
  )
}

// 神煞面板：標準模式只列吉神凶煞各前五，完整模式全列並附計算基準
function ShenShaPanel({ hits, detail, kongLabel }: {
  hits: ShenShaHit[]; detail: DetailLevel; kongLabel: string
}) {
  const good = hits.filter(h => h.category === '吉神')
  const bad  = hits.filter(h => h.category === '凶煞')
  const full = detail === 'full'
  const shown = full
    ? [...good, ...bad]
    : [...good.slice(0, 5), ...bad.slice(0, 5)]

  return (
    <section>
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="text-[10px] text-[#B23E26] tracking-[0.25em]">神 煞 與 空 亡</h2>
        <span className="text-[11px] text-[#8A8071]">{kongLabel}</span>
      </div>
      {shown.length === 0 ? (
        <p className="text-[#6B6155] text-sm">此命盤未見所列核心神煞。</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {shown.map((h, i) => (
            <div
              key={i}
              title={h.basis}
              className={`rounded-lg border p-3 ${
                h.category === '吉神'
                  ? 'border-[#5da832]/40 bg-[#5da832]/[0.06]'
                  : 'border-[#B23E26]/40 bg-[#B23E26]/[0.05]'
              }`}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-[#2B241C]">{h.name}</span>
                <span className="text-[10px] text-[#8A8071]">{h.category}</span>
                <span className="text-[11px] text-[#5A5247]">見於{h.pillars.join('、')}柱</span>
              </div>
              {full && <p className="mt-1 text-[10px] text-[#6B6155] leading-relaxed">計算基準：{h.basis}</p>}
            </div>
          ))}
        </div>
      )}
      {!full && hits.length > shown.length && (
        <p className="mt-3 text-[10px] text-[#8A8071]">切換至「完整」可看齊全部 {hits.length} 項神煞及計算基準。</p>
      )}
      {full && (
        <p className="mt-3 text-[10px] text-[#8A8071] leading-relaxed">
          門派說明：三合局類神煞以日支為主基準、年支為輔基準，每項均標示起算柱位。羊刃採「陰干取冠帶位」一派，故乙、丁、己、辛、癸日主亦立刃。
        </p>
      )}
    </section>
  )
}

function GzCell({ top, stem, branch, bottom, active, onClick }: {
  top: string; stem: string; branch: string; bottom: string
  active?: boolean; onClick?: () => void
}) {
  const si = '甲乙丙丁戊己庚辛壬癸'.indexOf(stem)
  const bx = BRANCHES.indexOf(branch)
  const inner = (
    <>
      <span className="text-[9px] text-[#8A8071] leading-none">{top}</span>
      <span className="text-base font-black font-serif leading-none" style={{ color: si >= 0 ? stemColor(si) : undefined }}>{stem}</span>
      <span className="text-base font-bold font-serif leading-none" style={{ color: bx >= 0 ? branchColor(bx) : undefined, opacity: 0.85 }}>{branch}</span>
      <span className="text-[9px] text-[#6B6155] leading-none">{bottom}</span>
    </>
  )
  const cls = `flex flex-col items-center gap-1 rounded-lg border p-2 transition-colors ${
    active ? 'border-[#E0552C] bg-[#B23E26]/[0.12]' : 'border-[color:var(--border-card)] bg-[#FBF7EE]/[0.02]'
  }${onClick ? ' hover:border-[#B23E26]/40' : ''}`
  return onClick
    ? <button type="button" onClick={onClick} aria-pressed={!!active} className={cls}>{inner}</button>
    : <div className={cls}>{inner}</div>
}

// 五層時間軸的流年、流月、流日、流時與一生運程總表
function TimelinePanel({ result, birthYear, daYun, currentYear }: {
  result: BaziResult; birthYear: number; daYun: DaYun | null; currentYear: number
}) {
  const TABS = ['流年', '流月', '流日', '流時', '一生運程總表'] as const
  const [tab, setTab] = useState<(typeof TABS)[number]>('流年')
  const [yearPick, setYearPick] = useState<number | null>(null)
  const [monthPick, setMonthPick] = useState(0)
  const [dayPick, setDayPick] = useState(0)
  const dayStem = result.day.stem

  const years = useMemo(() => {
    const base = daYun ? daYun.startYear : currentYear - 4
    return Array.from({ length: 10 }, (_, i) => base + i)
  }, [daYun, currentYear])

  const activeYear = yearPick !== null && years.includes(yearPick)
    ? yearPick
    : (years.includes(currentYear) ? currentYear : years[0])

  const months = useMemo(() => monthCells(activeYear, dayStem), [activeYear, dayStem])
  const monthIdx = Math.min(monthPick, 11)
  const days = useMemo(() => dayCells(activeYear, monthIdx, dayStem), [activeYear, monthIdx, dayStem])
  const dayIdx = Math.min(dayPick, Math.max(days.length - 1, 0))
  const theDay = days[dayIdx]
  const hours = useMemo(() => hourCells(theDay ? theDay.stem : dayStem, dayStem), [theDay, dayStem])
  const life = useMemo(() => lifeTable(result, birthYear), [result, birthYear])

  const activeGz = yearGanZhi(activeYear, dayStem)
  const acts = useMemo(() => branchInteractions(activeGz.branch, result), [activeGz.branch, result])

  return (
    <section>
      <h2 className="text-[10px] text-[#B23E26] tracking-[0.25em] mb-4">流 年 流 月 流 日 流 時</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              tab === t
                ? 'bg-[#B23E26] border-[#B23E26] text-[#F7F1E5] font-bold'
                : 'bg-[#2B241C]/[0.05] border-[#2B241C]/15 text-[#5A5247] hover:border-[#B23E26]/50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === '流年' && (
        <div className="space-y-4">
          <p className="text-[11px] text-[#8A8071]">
            範圍：{daYun ? `${daYun.stemChar}${daYun.branchChar} 大運（${years[0]} 至 ${years[9]}）` : `${years[0]} 至 ${years[9]}`}。點選任一流年，下方列出它與原局的沖合刑害破。
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {years.map(y => {
              const g = yearGanZhi(y, dayStem)
              return (
                <GzCell
                  key={y}
                  top={String(y)}
                  stem={g.gz[0]} branch={g.gz[1]}
                  bottom={g.tenGod}
                  active={y === activeYear}
                  onClick={() => setYearPick(y)}
                />
              )
            })}
          </div>
          <div className="rounded-lg border border-[color:var(--border-card)] bg-[#FBF7EE]/[0.02] p-4">
            <p className="text-xs text-[#2B241C] font-semibold mb-2">
              {activeYear} 年 {activeGz.gz}（天干{activeGz.tenGod}）引動原局
            </p>
            {acts.length === 0 ? (
              <p className="text-[11px] text-[#6B6155]">此流年地支與原局四支無直接沖合刑害破。</p>
            ) : (
              <ul className="space-y-1">
                {acts.map((a, i) => (
                  <li key={i} className="text-[11px] text-[#5A5247]">
                    <span className="inline-block w-12 text-[#B23E26]">{a.pillarLabel}</span>
                    <span className="inline-block w-8">{a.relation}</span>
                    {a.detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {tab === '流月' && (
        <div className="space-y-3">
          <p className="text-[11px] text-[#8A8071]">
            {activeYear} 年流月。八字月份以節氣分界，非曆月，下方標出各月交節日期與時刻（香港時間）。
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {months.map((m, i) => (
              <GzCell
                key={i}
                top={`${m.jieName} ${m.jieDate}`}
                stem={m.gz[0]} branch={m.gz[1]}
                bottom={m.tenGod}
                active={i === monthIdx}
                onClick={() => { setMonthPick(i); setDayPick(0) }}
              />
            ))}
          </div>
          <p className="text-[10px] text-[#8A8071]">
            {months[monthIdx].jieName}交節：{activeYear} 年 {months[monthIdx].jieDate} {months[monthIdx].jieTime}
          </p>
          {/* 流月引動原局 */}
          {(() => {
            const mActs = branchInteractions(months[monthIdx].branch, result)
            return (
              <div className="rounded-lg border border-[color:var(--border-card)] bg-[#FBF7EE]/[0.02] p-4">
                <p className="text-xs text-[#2B241C] font-semibold mb-2">
                  {months[monthIdx].gz} 月（天干{months[monthIdx].tenGod}）引動原局
                </p>
                {mActs.length === 0 ? (
                  <p className="text-[11px] text-[#6B6155]">此流月地支與原局四支無直接沖合刑害破。</p>
                ) : (
                  <ul className="space-y-1">
                    {mActs.map((a, i) => (
                      <li key={i} className="text-[11px] text-[#5A5247]">
                        <span className="inline-block w-12 text-[#B23E26]">{a.pillarLabel}</span>
                        <span className="inline-block w-8">{a.relation}</span>
                        {a.detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {tab === '流日' && (
        <div className="space-y-3">
          <p className="text-[11px] text-[#8A8071]">
            {months[monthIdx].gz} 月（{months[monthIdx].jieName} {months[monthIdx].jieDate} 起）逐日干支，共 {days.length} 日。可在流月分頁切換月份。
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {days.map((d, i) => (
              <GzCell
                key={i}
                top={d.date}
                stem={d.gz[0]} branch={d.gz[1]}
                bottom={d.tenGod}
                active={i === dayIdx}
                onClick={() => setDayPick(i)}
              />
            ))}
          </div>
        </div>
      )}

      {tab === '流時' && (
        <div className="space-y-3">
          <p className="text-[11px] text-[#8A8071]">
            {theDay ? `${theDay.year} 年 ${theDay.date}（${theDay.gz} 日）` : '所選日'}的十二時辰干支，依五鼠遁由日干起。
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {hours.map((h, i) => (
              <GzCell key={i} top={h.range} stem={h.gz[0]} branch={h.gz[1]} bottom={h.tenGod} />
            ))}
          </div>
        </div>
      )}

      {tab === '一生運程總表' && (
        <div className="space-y-4">
          <p className="text-[11px] text-[#8A8071]">由出生年起 108 年，按大運分組。</p>
          {life.map((g, i) => (
            <div key={i} className="rounded-lg border border-[color:var(--border-card)] bg-[#FBF7EE]/[0.02] p-3">
              <p className="text-[11px] text-[#B23E26] mb-2">
                {g.label}　{g.startYear} 至 {g.endYear}　{g.startAge} 歲起
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {g.years.map(y => (
                  <span key={y.year} className={`text-[11px] ${y.year === currentYear ? 'text-[#B23E26] font-bold' : 'text-[#5A5247]'}`}>
                    {y.year} {y.gz}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ── 五行分佈橫條圖 ───────────────────────────────────────────
const ELEM_NAMES = ['木', '火', '土', '金', '水'] as const
const ELEM_COLORS = ['#5a8a4a', '#c8522a', '#9a7228', '#7070b8', '#3870a8']
const _STEM_ELEM_IDX = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]
const _BRANCH_ELEM_IDX = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4]

function WuxingChart({ result }: { result: BaziResult }) {
  const pillars = [result.year, result.month, result.day, ...(result.hour ? [result.hour] : [])]
  const counts = [0, 0, 0, 0, 0]
  for (const p of pillars) {
    counts[_STEM_ELEM_IDX[p.stem]]++
    counts[_BRANCH_ELEM_IDX[p.branch]]++
  }
  const max = Math.max(...counts, 1)
  return (
    <div>
      <p className="text-[10px] text-[#B23E26] tracking-[0.25em] mb-3">五 行 分 佈</p>
      <div className="space-y-1.5">
        {ELEM_NAMES.map((name, i) => (
          <div key={name} className="flex items-center gap-2">
            <span className="text-[11px] text-[#5A5247] w-4 shrink-0 select-none">{name}</span>
            <div className="flex-1 h-3.5 bg-[#2B241C]/[0.06] rounded-sm overflow-hidden">
              <div
                className="h-full rounded-sm transition-[width] duration-500"
                style={{ width: `${(counts[i] / max) * 100}%`, backgroundColor: ELEM_COLORS[i] }}
              />
            </div>
            <span className="text-[11px] text-[#8A8071] w-3 text-right shrink-0">{counts[i]}</span>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-[#8A8071] mt-2">天干 + 地支本氣各計 1，藏干未計</p>
    </div>
  )
}

// Day stem index (0–9) to 五行
const STEM_ELEMENT = ['木','木','火','火','土','土','金','金','水','水'] as const

// 按命盤十神推算第二組文章類別
const TG_CATEGORY: Record<string, string> = {
  '正財': '事業財運', '偏財': '事業財運',
  '正官': '命盤格局', '七殺': '命盤格局',
  '食神': '十神應用', '傷官': '十神應用',
  '正印': '干支詳解', '偏印': '干支詳解',
  '比肩': '十神應用', '劫財': '十神應用',
}

function pickSecondaryCategory(result: BaziResult): string {
  const pillars = [result.year, result.month, result.hour].filter(Boolean) as typeof result.year[]
  for (const p of pillars) {
    const cat = TG_CATEGORY[p.tenGod ?? '']
    if (cat) return cat
  }
  return '大運流年'
}

export default function BaziCalculator({ articlesByElement = {}, articlesByCategory = {} }: {
  articlesByElement?: Record<string, ArticleMeta[]>
  articlesByCategory?: Record<string, ArticleMeta[]>
}) {
  const [form, setForm] = useState({
    year: '', month: '1', day: '', hour: '-1', gender: 'F',
    timeMode: 'branch', h24: '12', min: '0',
    trueSolar: '0', place: 'HK', customLon: '114.17', zishi: '23',
  })
  const [result, setResult] = useState<BaziResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [detail, setDetail] = useState<DetailLevel>('simple')
  const [daYunPick, setDaYunPick] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [savedFlash, setSavedFlash] = useState(false)
  const saveInputRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const { charts, save: saveChart, remove: removeChart, rename: renameChart } = useChartLibrary()

  const currentYear = new Date().getFullYear()

  // 排盤（可選擇是否寫入網址，供永久連結分享用）
  const doCalculate = useCallback((f: typeof form, updateUrl: boolean) => {
    const y = parseInt(f.year)
    const m = parseInt(f.month)
    const d = parseInt(f.day)
    const exact = f.timeMode === 'exact'
    const h24 = parseInt(f.h24) || 0
    const mi  = parseInt(f.min) || 0
    const h = f.timeMode === 'unknown' ? -1 : (exact ? hourBranchOf(h24 ?? 0, mi ?? 0) : parseInt(f.hour))

    if (!y || y < 1900 || y > currentYear) return setError('請輸入有效出生年份（1900 至今）')
    if (!d || d < 1 || d > 31)             return setError('請輸入有效日期')
    setError('')

    const place = PLACES.find(p => p.key === f.place) ?? PLACES[0]
    const lonRaw = f.place === 'CUSTOM' ? parseFloat(f.customLon) : place.lon
    const opts = exact ? {
      hour24: h24,
      minute: mi,
      trueSolarTime: f.trueSolar === '1',
      longitude: Number.isFinite(lonRaw) ? lonRaw : 114.17,
      standardMeridian: place.meridian,
      zishiMode: (f.zishi === '00' ? '00' : '23') as '23' | '00',
    } : undefined

    try {
      setResult(calculate(y, m, d, h, f.gender as 'M' | 'F', opts))
      track('tool_cast', { tool: 'bazi' })
      setDaYunPick(null)
      if (updateUrl && typeof window !== 'undefined') {
        const params = new URLSearchParams()
        params.set('y', String(y))
        params.set('m', String(m))
        params.set('d', String(d))
        params.set('h', String(h))
        params.set('g', f.gender)
        params.set('tm', f.timeMode)
        if (exact) {
          params.set('t', String(h24))
          params.set('n', String(mi))
          params.set('st', f.trueSolar)
          params.set('pl', f.place)
          if (f.place === 'CUSTOM') params.set('lo', f.customLon)
          params.set('z', f.zishi)
        }
        window.history.pushState(null, '', `${window.location.pathname}?${params.toString()}`)
      }
    } catch {
      setError('計算出錯，請確認日期是否存在')
    }
  }, [currentYear])

  const handleCalculate = useCallback(() => {
    doCalculate(form, true)
  }, [form, doCalculate])

  // 頁面載入時：若網址帶有排盤參數，自動填表並排盤
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const y = params.get('y')
    const m = params.get('m')
    const d = params.get('d')
    const h = params.get('h')
    const g = params.get('g')
    if (!y || !d) return

    const tm = params.get('tm')
    const restored = {
      year: y,
      month: m ?? '1',
      day: d,
      hour: h ?? '-1',
      gender: g === 'M' ? 'M' : 'F',
      timeMode: tm === 'exact' || tm === 'unknown' ? tm : (h === '-1' ? 'unknown' : 'branch'),
      h24: params.get('t') ?? '12',
      min: params.get('n') ?? '0',
      trueSolar: params.get('st') === '1' ? '1' : '0',
      place: PLACES.some(p => p.key === params.get('pl')) ? (params.get('pl') as string) : 'HK',
      customLon: params.get('lo') ?? '114.17',
      zishi: params.get('z') === '00' ? '00' : '23',
    }
    setForm(restored)
    doCalculate(restored, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePrint = useCallback(() => window.print(), [])

  const handleExportPng = useCallback(async () => {
    if (!resultRef.current) return
    setExporting(true)
    try {
      const h2c = (await import('html2canvas')).default as typeof html2canvasType
      const canvas = await h2c(resultRef.current, {
        backgroundColor: '#F4EEE1',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      const label = form.year && form.day
        ? `bazi_${form.year}_${form.month}_${form.day}`
        : 'bazi_chart'
      link.download = `${label}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      // silently fail — user can screenshot manually
    } finally {
      setExporting(false)
    }
  }, [form])

  const handleSaveChart = useCallback(() => {
    saveChart(saveName || `${form.year}/${form.month}/${form.day} ${form.gender === 'F' ? '女' : '男'}`, {
      year: form.year, month: form.month, day: form.day, hour: form.hour,
      gender: form.gender, timeMode: form.timeMode, h24: form.h24, min: form.min,
      trueSolar: form.trueSolar, place: form.place, customLon: form.customLon, zishi: form.zishi,
    })
    setSaving(false)
    setSaveName('')
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)
  }, [form, saveName, saveChart])

  const handleLoadChart = useCallback((chart: import('./useChartLibrary').SavedChart) => {
    const restored = {
      year: chart.year, month: chart.month, day: chart.day, hour: chart.hour,
      gender: chart.gender as 'F' | 'M',
      timeMode: chart.timeMode as 'branch' | 'exact' | 'unknown',
      h24: chart.h24, min: chart.min,
      trueSolar: chart.trueSolar, place: chart.place, customLon: chart.customLon, zishi: chart.zishi,
    }
    setForm(restored)
    doCalculate(restored, true)
  }, [doCalculate])

  const handleCopyLink = useCallback(() => {
    if (typeof window === 'undefined') return
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }).catch(() => {})
  }, [])

  const handleCopy = useCallback(() => {
    if (!result) return
    const y = form.year, m = form.month, d = form.day
    const genderLabel = form.gender === 'F' ? '女命' : '男命'
    const hourLabel = parseInt(form.hour) >= 0
      ? HOUR_OPTIONS.find(o => o.value === parseInt(form.hour))?.label.split(' ')[0] ?? ''
      : '（時辰不確定）'

    const pillarLine = (p: Pillar, label: string, isDay: boolean) => {
      const tg = isDay ? '日主' : (p.tenGod ?? '')
      const hidden = p.hiddenStems.map(h => `${h.char}${h.tenGod}(${h.tier})`).join(' ')
      return `${label}　${p.stemChar}${p.branchChar}　${tg}　│　藏干：${hidden}`
    }

    const pillarLines = [
      pillarLine(result.year,  '年柱', false),
      pillarLine(result.month, '月柱', false),
      pillarLine(result.day,   '日柱', true),
      ...(result.hour ? [pillarLine(result.hour, '時柱', false)] : []),
    ].join('\n')

    const _age = parseInt(form.year) ? currentYear - parseInt(form.year) : -1
    const yunLine = result.daYuns.map((dy) => {
      const cur = _age >= dy.startAge && _age < dy.startAge + 10
      return `${cur ? '▶' : ''}${dy.stemChar}${dy.branchChar} ${dy.startAge}歲`
    }).join(' → ')

    const startInfo = result.startAge !== null
      ? `（${result.startAge} 歲起運，${parseInt(form.year) + Math.round(result.startAge)} 年）`
      : ''

    const text = [
      `【八字命盤】`,
      `出生：${y}年${m}月${d}日 ${hourLabel}　${genderLabel}`,
      ``,
      `── 四柱 ──`,
      pillarLines,
      ``,
      `── 大運 ${startInfo}──`,
      yunLine,
      ``,
      `由 destiny.solver 八字速算工具生成`,
      `https://destinysolver.com/bazi`,
    ].join('\n')

    const doConfirm = () => { setCopied(true); setTimeout(() => setCopied(false), 2000) }
    navigator.clipboard.writeText(text).then(doConfirm).catch(() => {
      // fallback for sandboxed environments
      const el = document.createElement('textarea')
      el.value = text
      el.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
      document.body.appendChild(el)
      el.focus(); el.select()
      try { document.execCommand('copy'); doConfirm() } catch {}
      document.body.removeChild(el)
    })
  }, [result, form, currentYear])

  const birthYear  = parseInt(form.year) || 0
  const currentAge = birthYear ? currentYear - birthYear : -1

  const kong = result ? Array.from(emptyBranches(result.day.stem, result.day.branch)) : []
  const kongLabel = result
    ? `旬空：${kong.map(b => BRANCHES[b]).join('')}（${xunName(result.day.stem, result.day.branch)}）`
    : ''
  const shensha = result ? computeShenSha(result) : []
  const selectedDaYun = (result && daYunPick !== null) ? result.daYuns[daYunPick] : null

  const pillars = result ? [
    { pillar: result.year,  label: '年柱', isDay: false },
    { pillar: result.month, label: '月柱', isDay: false },
    { pillar: result.day,   label: '日柱', isDay: true  },
    ...(result.hour ? [{ pillar: result.hour, label: '時柱', isDay: false }] : []),
  ] : []

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* 表單 */}
      <div className="no-print rounded-lg border border-[color:var(--border-card)] shadow-[var(--shadow-card)] bg-[#FBF7EE]/[0.02] p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bazi-year" className="text-[10px] text-[#B23E26] tracking-widest">出生年份</label>
            <input
              id="bazi-year"
              name="year"
              type="number" placeholder="例：1990"
              autoComplete="off"
              value={form.year}
              onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleCalculate()}
              aria-describedby={error ? 'bazi-error' : undefined}
              className="w-28 bg-[#2B241C]/[0.05] border border-[#2B241C]/15 text-[#2B241C] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#B23E26]/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bazi-month" className="text-[10px] text-[#B23E26] tracking-widest">月</label>
            <select
              id="bazi-month"
              value={form.month}
              onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
              className="bg-[#2B241C]/[0.05] border border-[#2B241C]/15 text-[#2B241C] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#B23E26]/60 transition-colors"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i+1} value={i+1} className="bg-[#F4EEE1]">{i+1} 月</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bazi-day" className="text-[10px] text-[#B23E26] tracking-widest">日</label>
            <input
              id="bazi-day"
              name="day"
              type="number" placeholder="1-31"
              autoComplete="off"
              value={form.day}
              onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleCalculate()}
              aria-describedby={error ? 'bazi-error' : undefined}
              className="w-20 bg-[#2B241C]/[0.05] border border-[#2B241C]/15 text-[#2B241C] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#B23E26]/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bazi-hour" className="text-[10px] text-[#B23E26] tracking-widest">出生時辰</label>
            <select
              id="bazi-hour"
              value={form.hour}
              onChange={e => setForm(f => ({ ...f, hour: e.target.value }))}
              className="bg-[#2B241C]/[0.05] border border-[#2B241C]/15 text-[#2B241C] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#B23E26]/60 transition-colors"
            >
              {HOUR_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#F4EEE1]">{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label id="bazi-gender-label" className="text-[10px] text-[#B23E26] tracking-widest">性別</label>
            <div className="flex gap-2" role="group" aria-labelledby="bazi-gender-label">
              {(['F', 'M'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setForm(f => ({ ...f, gender: g }))}
                  aria-pressed={form.gender === g}
                  className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                    form.gender === g
                      ? 'bg-[#B23E26] border-[#B23E26] text-[#F7F1E5] font-bold'
                      : 'bg-[#2B241C]/[0.05] border-[#2B241C]/15 text-[#5A5247] hover:border-[#B23E26]/50'
                  }`}
                >
                  {g === 'F' ? '女' : '男'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p id="bazi-error" aria-live="polite" className="text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-4">
          <button
            onClick={handleCalculate}
            className="bg-[#E0552C] hover:bg-[#C9461F] text-[#F7F1E5] font-bold px-7 py-2.5 rounded-full text-sm transition-colors"
          >
            立即排盤
          </button>
          {result?.boundaryNote
            ? <p className="text-[10px] text-[#6B6155]">⚠ {result.boundaryNote}</p>
            : null}
        </div>

        <ChartLibrary
          charts={charts}
          onLoad={handleLoadChart}
          onRemove={removeChart}
          onRename={renameChart}
        />
      </div>

      {/* 結果 */}
      {result && (
        <div ref={resultRef}>
          {/* 顯示詳細度 */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#8A8071] tracking-widest">顯示詳細度：</span>
            {DETAIL_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDetail(opt.value)}
                aria-pressed={detail === opt.value}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  detail === opt.value
                    ? 'bg-[#B23E26] border-[#B23E26] text-[#F7F1E5] font-bold'
                    : 'bg-[#2B241C]/[0.05] border-[#2B241C]/15 text-[#5A5247] hover:border-[#B23E26]/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* 四柱 */}
          <section>
            <h2 className="text-[10px] text-[#B23E26] tracking-[0.25em] mb-4">四 柱 命 盤</h2>
            <div className={`grid gap-3 ${result.hour ? 'grid-cols-4' : 'grid-cols-3'}`}>
              {pillars.map(({ pillar, label, isDay }) => (
                <PillarCard
                  key={label} pillar={pillar} label={label} isDay={isDay}
                  detail={detail} dayStem={result!.day.stem} kong={kong}
                />
              ))}
            </div>
          </section>

          {/* 神煞與空亡（標準和完整模式） */}
          {detail !== 'simple' && (
            <ShenShaPanel hits={shensha} detail={detail} kongLabel={kongLabel} />
          )}

          {/* 大運 */}
          <section>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-[10px] text-[#B23E26] tracking-[0.25em]">大 運</h2>
              {result.startAge !== null && (
                <span className="text-[11px] text-[#8A8071]">
                  {result.startAge} 歲起運（{birthYear + Math.round(result.startAge)} 年）
                </span>
              )}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {result.daYuns.map((dy, i) => (
                <DaYunCard
                  key={i} dy={dy}
                  isCurrent={currentAge >= dy.startAge && currentAge < dy.startAge + 10}
                  isSelected={daYunPick === i}
                  tenGod={tenGodOf(result.day.stem, dy.stem)}
                  stage={twelveStage(result.day.stem, dy.branch)}
                  onSelect={() => setDaYunPick(daYunPick === i ? null : i)}
                />
              ))}
            </div>
          </section>

          {/* 時間軸（標準和完整模式） */}
          {detail !== 'simple' && (
            <TimelinePanel
              result={result}
              birthYear={birthYear}
              daYun={selectedDaYun}
              currentYear={currentYear}
            />
          )}

          {/* CTA */}
          <div className="rounded-lg border border-[#B23E26]/20 bg-[#B23E26]/[0.04] p-6 text-center space-y-3">
            <p className="text-[#6B6155] text-sm">想深入了解命盤的格局與能量流向？</p>
            <a
              href="/consultation"
              onClick={() => track('consult_click', { source: 'bazi' })}
              className="inline-block bg-[#E0552C] hover:bg-[#C9461F] text-[#F7F1E5] font-bold px-8 py-3 rounded-full text-sm transition-colors"
            >
              預約深度命盤分析
            </a>
          </div>

          {/* 五行分佈 */}
          <WuxingChart result={result} />

          {/* 按日主五行推薦文章 */}
          {(() => {
            const element = STEM_ELEMENT[result.day.stem]
            const recs = articlesByElement[element] ?? []
            if (recs.length === 0) return null
            return (
              <div className="no-print">
                <p className="text-[10px] text-[#B23E26] tracking-[0.25em] mb-3">
                  日主屬{element}，推薦深讀
                </p>
                <div className="space-y-2">
                  {recs.map(a => (
                    <Link
                      key={a.slug}
                      href={`/articles/${a.slug}`}
                      className="flex items-center gap-3 rounded border border-[color:var(--border-card)] bg-[#FBF7EE]/[0.02] px-4 py-3 hover:border-[#B23E26]/40 transition-colors group"
                    >
                      <span className="text-[#8A8071] text-[10px] tracking-wider shrink-0">{a.category}</span>
                      <span className="text-[#2B241C] text-sm flex-1 min-w-0 truncate group-hover:text-[#B23E26] transition-colors">{a.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* 按命盤十神精準推薦文章 */}
          {(() => {
            const cat = pickSecondaryCategory(result)
            const recs2 = (articlesByCategory[cat] ?? []).filter(
              a => !(articlesByElement[STEM_ELEMENT[result.day.stem]] ?? []).some(x => x.slug === a.slug)
            )
            if (recs2.length === 0) return null
            return (
              <div className="no-print">
                <p className="text-[10px] text-[#B23E26] tracking-[0.25em] mb-3">
                  命盤相關：{cat}
                </p>
                <div className="space-y-2">
                  {recs2.map(a => (
                    <Link
                      key={a.slug}
                      href={`/articles/${a.slug}`}
                      className="flex items-center gap-3 rounded border border-[color:var(--border-card)] bg-[#FBF7EE]/[0.02] px-4 py-3 hover:border-[#B23E26]/40 transition-colors group"
                    >
                      <span className="text-[#8A8071] text-[10px] tracking-wider shrink-0">{a.category}</span>
                      <span className="text-[#2B241C] text-sm flex-1 min-w-0 truncate group-hover:text-[#B23E26] transition-colors">{a.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* 匯出 */}
          <div className="flex justify-center no-print">
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-full text-sm border border-[#2B241C]/20 text-[#6B6155] hover:border-[#B23E26]/40 hover:text-[#B23E26] transition-colors"
            >
              列印 / 儲存 PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

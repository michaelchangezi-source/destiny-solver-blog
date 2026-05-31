'use client'

import { useState, useCallback } from 'react'
import { calculate, stemColor, branchColor } from '@/lib/bazi-calc'
import { analyzeCompat } from '@/lib/bazi-compat'
import type { BaziResult, Pillar } from '@/lib/bazi-calc'
import type { CompatResult, InteractionType, Sentiment } from '@/lib/bazi-compat'

// ── 常量 ─────────────────────────────────────────────────

const HOUR_OPTIONS = [
  { value: -1, label: '不確定' },
  { value: 0,  label: '子時 23-01' },
  { value: 1,  label: '丑時 01-03' },
  { value: 2,  label: '寅時 03-05' },
  { value: 3,  label: '卯時 05-07' },
  { value: 4,  label: '辰時 07-09' },
  { value: 5,  label: '巳時 09-11' },
  { value: 6,  label: '午時 11-13' },
  { value: 7,  label: '未時 13-15' },
  { value: 8,  label: '申時 15-17' },
  { value: 9,  label: '酉時 17-19' },
  { value: 10, label: '戌時 19-21' },
  { value: 11, label: '亥時 21-23' },
]

const TYPE_COLOR: Record<InteractionType, string> = {
  '天干五合': '#C9A84C',
  '地支六合': '#5da832',
  '地支三合': '#4a9fd4',
  '地支六沖': '#e05c2a',
  '地支六害': '#a83020',
  '地支相破': '#7a5a80',
}

const SENTIMENT_STYLE: Record<Sentiment, { bg: string; border: string; text: string }> = {
  good:    { bg: 'rgba(93,168,50,0.08)',  border: 'rgba(93,168,50,0.3)',  text: '#7fc850' },
  tense:   { bg: 'rgba(224,92,42,0.08)',  border: 'rgba(224,92,42,0.3)',  text: '#f07050' },
  complex: { bg: 'rgba(122,90,128,0.08)', border: 'rgba(122,90,128,0.3)', text: '#b080d0' },
}

// ── 子元件 ───────────────────────────────────────────────

interface PersonForm { year: string; month: string; day: string; hour: string; gender: string; name: string }
const defaultForm = (): PersonForm => ({ year: '', month: '1', day: '', hour: '-1', gender: 'F', name: '' })

function PersonInput({ label, form, onChange }: {
  label: string
  form: PersonForm
  onChange: (f: PersonForm) => void
}) {
  const set = (k: keyof PersonForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...form, [k]: e.target.value })

  return (
    <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
      <p className="text-[11px] text-[#C9A84C] tracking-[0.2em] font-medium">{label}</p>

      <input
        type="text" placeholder="暱稱（選填）"
        value={form.name} onChange={set('name')}
        className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-white/20"
      />

      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-white/35 tracking-widest">年份</label>
          <input
            type="number" placeholder="例：1990"
            value={form.year} onChange={set('year')}
            className="w-24 bg-white/5 border border-white/10 text-white rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#C9A84C]/50 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-white/35 tracking-widest">月</label>
          <select value={form.month} onChange={set('month')}
            className="bg-white/5 border border-white/10 text-white rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#C9A84C]/50 transition-colors">
            {Array.from({length:12},(_,i) => (
              <option key={i+1} value={i+1} className="bg-[#0F0F2D]">{i+1}月</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-white/35 tracking-widest">日</label>
          <input
            type="number" placeholder="1-31"
            value={form.day} onChange={set('day')}
            className="w-16 bg-white/5 border border-white/10 text-white rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#C9A84C]/50 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-white/35 tracking-widest">時辰</label>
          <select value={form.hour} onChange={set('hour')}
            className="bg-white/5 border border-white/10 text-white rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#C9A84C]/50 transition-colors">
            {HOUR_OPTIONS.map(o => (
              <option key={o.value} value={o.value} className="bg-[#0F0F2D]">{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        {(['F','M'] as const).map(g => (
          <button key={g}
            onClick={() => onChange({...form, gender: g})}
            className={`px-3 py-1 rounded-lg text-xs border transition-colors ${
              form.gender===g
                ? 'bg-[#C9A84C] border-[#C9A84C] text-[#0F0F2D] font-bold'
                : 'bg-white/5 border-white/10 text-white/50 hover:border-[#C9A84C]/40'
            }`}>
            {g==='F'?'女':'男'}
          </button>
        ))}
      </div>
    </div>
  )
}

function MiniPillars({ result, name }: { result: BaziResult; name: string }) {
  const pillars = [
    { p: result.year,  lbl: '年' },
    { p: result.month, lbl: '月' },
    { p: result.day,   lbl: '日' },
    ...(result.hour ? [{ p: result.hour, lbl: '時' }] : []),
  ]
  return (
    <div className="space-y-1.5">
      {name && <p className="text-[10px] text-white/40 tracking-widest">{name}</p>}
      <div className="flex gap-2">
        {pillars.map(({p, lbl}) => (
          <div key={lbl} className={`flex flex-col items-center gap-0.5 rounded-lg border px-2.5 py-2 ${
            lbl==='日' ? 'border-[#C9A84C]/50 bg-[#C9A84C]/[0.06]' : 'border-white/10 bg-white/[0.02]'
          }`}>
            <span className="text-[9px] text-white/30 tracking-widest">{lbl}</span>
            <span className="text-xl font-black font-serif leading-none" style={{color: stemColor(p.stem)}}>{p.stemChar}</span>
            <span className="text-base font-bold font-serif leading-none" style={{color: branchColor(p.branch), opacity:0.85}}>{p.branchChar}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 主元件 ───────────────────────────────────────────────

export default function CompatCalculator() {
  const [formA, setFormA] = useState<PersonForm>(defaultForm())
  const [formB, setFormB] = useState<PersonForm>(defaultForm())
  const [resultA, setResultA] = useState<BaziResult | null>(null)
  const [resultB, setResultB] = useState<BaziResult | null>(null)
  const [compat, setCompat] = useState<CompatResult | null>(null)
  const [error, setError] = useState('')

  const handleCalc = useCallback(() => {
    const parse = (f: PersonForm) => ({
      y: parseInt(f.year), m: parseInt(f.month),
      d: parseInt(f.day),  h: parseInt(f.hour),
    })
    const a = parse(formA), b = parse(formB)
    const cur = new Date().getFullYear()

    if (!a.y || a.y < 1900 || a.y > cur || !a.d || a.d < 1 || a.d > 31)
      return setError('甲方出生日期有誤')
    if (!b.y || b.y < 1900 || b.y > cur || !b.d || b.d < 1 || b.d > 31)
      return setError('乙方出生日期有誤')

    setError('')
    try {
      const ra = calculate(a.y, a.m, a.d, a.h, formA.gender as 'M'|'F')
      const rb = calculate(b.y, b.m, b.d, b.h, formB.gender as 'M'|'F')
      setResultA(ra)
      setResultB(rb)
      setCompat(analyzeCompat(ra, rb))
    } catch {
      setError('計算出錯，請確認日期是否正確')
    }
  }, [formA, formB])

  // ── 分組互動 ──────────────────────────────────────────
  const groups: InteractionType[] = ['天干五合','地支六合','地支三合','地支六沖','地支六害','地支相破']

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* 輸入區 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <PersonInput label="甲 方" form={formA} onChange={setFormA} />
        <div className="flex items-center justify-center text-[#C9A84C]/40 text-2xl font-serif select-none sm:py-4">
          ×
        </div>
        <PersonInput label="乙 方" form={formB} onChange={setFormB} />
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <div className="flex justify-center">
        <button onClick={handleCalc}
          className="bg-[#C9A84C] hover:bg-[#B8963B] text-[#0F0F2D] font-bold px-8 py-2.5 rounded-full text-sm transition-colors">
          立即合盤
        </button>
      </div>

      {/* 結果 */}
      {compat && resultA && resultB && (
        <>
          {/* 雙方四柱 */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
            <h2 className="text-[10px] text-[#C9A84C] tracking-[0.25em]">雙 方 命 盤</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <MiniPillars result={resultA} name={formA.name || '甲方'} />
              <MiniPillars result={resultB} name={formB.name || '乙方'} />
            </div>
          </div>

          {/* 日支關係（重點） */}
          <div className="rounded-xl border p-4 space-y-2"
            style={{
              borderColor: SENTIMENT_STYLE[compat.dayBranchSentiment].border,
              background: SENTIMENT_STYLE[compat.dayBranchSentiment].bg,
            }}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.2em]"
                style={{color: SENTIMENT_STYLE[compat.dayBranchSentiment].text}}>
                日 支 關 係
              </span>
              <span className="text-[10px] text-white/30">（最直接反映兩人相處模式）</span>
            </div>
            <p className="text-sm text-white/80 font-medium">
              <span className="font-serif text-base" style={{color: branchColor(resultA.day.branch)}}>
                {resultA.day.branchChar}
              </span>
              <span className="text-white/30 mx-2">vs</span>
              <span className="font-serif text-base" style={{color: branchColor(resultB.day.branch)}}>
                {resultB.day.branchChar}
              </span>
              <span className="ml-3 text-white/70 text-sm">{compat.dayBranchNote}</span>
            </p>
          </div>

          {/* 互動總覽 */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] text-[#C9A84C] tracking-[0.25em]">干 支 互 動</h2>
              <div className="flex gap-3 text-[10px]">
                <span className="text-[#7fc850]">合 {compat.positiveCount}</span>
                <span className="text-[#f07050]">沖害破 {compat.tensionCount}</span>
              </div>
            </div>

            {compat.interactions.length === 0 ? (
              <p className="text-white/35 text-sm text-center py-4">
                雙方命盤無明顯干支互動，緣分平穩，宜深入觀察整體五行
              </p>
            ) : (
              groups.map(type => {
                const items = compat.interactions.filter(i => i.type === type)
                if (!items.length) return null
                const col = TYPE_COLOR[type]
                return (
                  <div key={type} className="space-y-1.5">
                    <p className="text-[10px] tracking-widest font-medium" style={{color: col}}>{type}</p>
                    {items.map((item, idx) => {
                      const st = SENTIMENT_STYLE[item.sentiment]
                      return (
                        <div key={idx}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm flex-wrap ${item.isDay ? 'ring-1' : ''}`}
                          style={{background: st.bg, border: `1px solid ${st.border}`}}>
                          <span className="font-serif font-bold" style={{color: st.text}}>{item.aLabel.split(' ')[1]}</span>
                          <span className="text-white/25 text-xs">{item.aLabel.split(' ')[0]}</span>
                          <span className="text-white/30">×</span>
                          <span className="font-serif font-bold" style={{color: st.text}}>{item.bLabel.split(' ')[1]}</span>
                          <span className="text-white/25 text-xs">{item.bLabel.split(' ')[0]}</span>
                          <span className="ml-auto text-xs" style={{color: st.text}}>→ {item.detail}</span>
                          {item.isDay && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded" style={{color: col, background: `${col}20`, border: `1px solid ${col}40`}}>
                              日柱
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })
            )}
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-[#C9A84C]/20 bg-[#C9A84C]/[0.04] p-6 text-center space-y-3">
            <p className="text-white/55 text-sm">
              合盤只是第一步，真正的緣分深度需要結合各自格局、大運才能判斷
            </p>
            <a href="/consultation"
              className="inline-block bg-[#C9A84C] hover:bg-[#B8963B] text-[#0F0F2D] font-bold px-8 py-3 rounded-full text-sm transition-colors">
              預約深度合盤分析
            </a>
          </div>
        </>
      )}
    </div>
  )
}

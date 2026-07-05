'use client'

import { useState, useCallback } from 'react'
import { calculate, stemColor, branchColor } from '@/lib/bazi-calc'
import type { BaziResult, Pillar, DaYun } from '@/lib/bazi-calc'

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

function PillarCard({ pillar, label, isDay }: { pillar: Pillar; label: string; isDay: boolean }) {
  const sc = stemColor(pillar.stem)
  const bc = branchColor(pillar.branch)

  return (
    <div className={`flex flex-col items-center gap-2 rounded-lg border p-3 sm:p-4 ${
      isDay ? 'border-[#B23E26]/60 bg-[#B23E26]/[0.06]' : 'border-[#2B241C]/10 bg-[#FBF7EE]/[0.02]'
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

function DaYunCard({ dy, isCurrent }: { dy: DaYun; isCurrent: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 rounded-lg border p-2 ${
      isCurrent ? 'border-[#B23E26]/60 bg-[#B23E26]/[0.07]' : 'border-[#2B241C]/10 bg-[#FBF7EE]/[0.02]'
    }`}>
      <span className="text-xl font-black font-serif leading-none" style={{ color: stemColor(dy.stem) }}>
        {dy.stemChar}
      </span>
      <span className="text-lg font-bold font-serif leading-none" style={{ color: branchColor(dy.branch), opacity: 0.85 }}>
        {dy.branchChar}
      </span>
      <div className="mt-0.5 text-center">
        <p className="text-[11px] text-[#B23E26] font-medium">{dy.startAge}歲</p>
        <p className="text-[9px] text-[#8A8071]">{dy.startYear}</p>
      </div>
    </div>
  )
}

export default function BaziCalculator() {
  const [form, setForm] = useState({ year: '', month: '1', day: '', hour: '-1', gender: 'F' })
  const [result, setResult] = useState<BaziResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const currentYear = new Date().getFullYear()

  const handleCalculate = useCallback(() => {
    const y = parseInt(form.year)
    const m = parseInt(form.month)
    const d = parseInt(form.day)
    const h = parseInt(form.hour)

    if (!y || y < 1900 || y > currentYear) return setError('請輸入有效出生年份（1900 至今）')
    if (!d || d < 1 || d > 31)             return setError('請輸入有效日期')
    setError('')
    try {
      setResult(calculate(y, m, d, h, form.gender as 'M' | 'F'))
    } catch {
      setError('計算出錯，請確認日期是否存在')
    }
  }, [form, currentYear])

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
      `https://destiny-solver-blog.vercel.app/bazi`,
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

  const pillars = result ? [
    { pillar: result.year,  label: '年柱', isDay: false },
    { pillar: result.month, label: '月柱', isDay: false },
    { pillar: result.day,   label: '日柱', isDay: true  },
    ...(result.hour ? [{ pillar: result.hour, label: '時柱', isDay: false }] : []),
  ] : []

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* 表單 */}
      <div className="rounded-lg border border-[#2B241C]/10 bg-[#FBF7EE]/[0.02] p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#B23E26] tracking-widest">出生年份</label>
            <input
              type="number" placeholder="例：1990"
              value={form.year}
              onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleCalculate()}
              className="w-28 bg-[#2B241C]/[0.05] border border-[#2B241C]/15 text-[#2B241C] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#B23E26]/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#B23E26] tracking-widest">月</label>
            <select
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
            <label className="text-[10px] text-[#B23E26] tracking-widest">日</label>
            <input
              type="number" placeholder="1-31"
              value={form.day}
              onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleCalculate()}
              className="w-20 bg-[#2B241C]/[0.05] border border-[#2B241C]/15 text-[#2B241C] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#B23E26]/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[#B23E26] tracking-widest">出生時辰</label>
            <select
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
            <label className="text-[10px] text-[#B23E26] tracking-widest">性別</label>
            <div className="flex gap-2">
              {(['F', 'M'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setForm(f => ({ ...f, gender: g }))}
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

        {error && <p className="text-red-400 text-sm">{error}</p>}

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
      </div>

      {/* 結果 */}
      {result && (
        <>
          {/* 四柱 */}
          <section>
            <h2 className="text-[10px] text-[#B23E26] tracking-[0.25em] mb-4">四 柱 命 盤</h2>
            <div className={`grid gap-3 ${result.hour ? 'grid-cols-4' : 'grid-cols-3'}`}>
              {pillars.map(({ pillar, label, isDay }) => (
                <PillarCard key={label} pillar={pillar} label={label} isDay={isDay} />
              ))}
            </div>
          </section>

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
                />
              ))}
            </div>
          </section>

          {/* 複製按鈕 */}
          <div className="flex justify-center">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm border transition-all duration-200 ${
                copied
                  ? 'border-green-500/60 text-green-400 bg-green-500/10'
                  : 'border-[#B23E26]/40 text-[#B23E26] hover:bg-[#B23E26]/10'
              }`}
            >
              {copied ? '✓ 已複製命盤' : '複製命盤文字'}
            </button>
          </div>

          {/* CTA */}
          <div className="rounded-lg border border-[#B23E26]/20 bg-[#B23E26]/[0.04] p-6 text-center space-y-3">
            <p className="text-[#6B6155] text-sm">想深入了解命盤的格局與能量流向？</p>
            <a
              href="/consultation"
              className="inline-block bg-[#E0552C] hover:bg-[#C9461F] text-[#F7F1E5] font-bold px-8 py-3 rounded-full text-sm transition-colors"
            >
              預約深度命盤分析
            </a>
          </div>
        </>
      )}
    </div>
  )
}

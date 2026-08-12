'use client'

import { useMemo, useState } from 'react'

const CURRENT_YEAR = new Date().getFullYear()

function daysInMonth(year: number, month: number): number {
  if (!year || !month) return 31
  return new Date(year, month, 0).getDate()
}

export default function BirthInput({
  onSubmit,
}: {
  onSubmit: (year: number, month: number, day: number) => void
}) {
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [error, setError] = useState('')

  const y = Number(year)
  const m = Number(month)
  const maxDay = useMemo(() => daysInMonth(y, m), [y, m])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const d = Number(day)

    if (!y || !m || !d) return setError('請把年、月、日三項都填好。')
    if (y < 1900 || y > CURRENT_YEAR) return setError(`出生年份請填 1900 至 ${CURRENT_YEAR} 之間。`)
    if (m < 1 || m > 12) return setError('月份請填 1 至 12。')
    if (d < 1 || d > maxDay) return setError(`${y} 年 ${m} 月只有 ${maxDay} 天。`)

    const today = new Date()
    if (new Date(y, m - 1, d).getTime() > today.getTime()) return setError('出生日期不能晚於今日。')

    setError('')
    onSubmit(y, m, d)
  }

  const fieldClass =
    'w-full rounded-lg border border-[color:var(--border-card)] bg-[#FFFFFF] px-3 py-2.5 ' +
    'text-[#2B241C] text-base tabular-nums outline-none ' +
    'focus:border-[#B23E26]/60 focus:ring-2 focus:ring-[#B23E26]/15 transition-colors'

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-[color:var(--border-card)] shadow-[var(--shadow-card)] bg-[#FFFFFF] p-6 sm:p-8">
      <p className="text-[#B23E26] text-xs font-semibold tracking-[0.3em] mb-2">開始</p>
      <h2 className="font-serif text-[#2B241C] text-2xl font-black mb-2">輸入你的出生日期</h2>
      <p className="text-[#6B6155] text-sm leading-relaxed mb-6">
        只需要年月日，不需要時辰，亦不需要註冊。系統計出你的日柱之後，只把日柱兩個字存在你自己的裝置上，出生日期本身不會儲存，也不會離開這部裝置。
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <label className="block">
          <span className="block text-[#8A8071] text-[11px] tracking-widest mb-1.5">年</span>
          <input
            type="number" inputMode="numeric" placeholder="1988"
            min={1900} max={CURRENT_YEAR} value={year}
            onChange={e => setYear(e.target.value)}
            className={fieldClass} required
          />
        </label>
        <label className="block">
          <span className="block text-[#8A8071] text-[11px] tracking-widest mb-1.5">月</span>
          <select value={month} onChange={e => setMonth(e.target.value)} className={fieldClass} required>
            <option value="">選擇</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-[#8A8071] text-[11px] tracking-widest mb-1.5">日</span>
          <select value={day} onChange={e => setDay(e.target.value)} className={fieldClass} required>
            <option value="">選擇</option>
            {Array.from({ length: maxDay }, (_, i) => i + 1).map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="text-[#C24A2E] text-sm mb-4">{error}</p>
      )}

      <button
        type="submit"
        className="w-full rounded-lg bg-[#B23E26] hover:bg-[#96321E] text-[#FAFAF8] font-semibold py-3 transition-colors"
      >
        看今日
      </button>

      <p className="text-[#8A8071] text-xs leading-relaxed mt-5">
        出生於晚上十一時之後的話，日柱有可能屬於翌日。本功能一律以曆日計算，如結果與你已知的日柱不符，可把日期改為翌日再試一次。
      </p>
    </form>
  )
}

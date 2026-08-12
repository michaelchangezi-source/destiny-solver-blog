'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import type { BranchRelation, Pillar, RelationResult } from '@/lib/daily-relate'
import { CELLS, MARK_COPY, RELATION_LABEL } from '@/data/daily-copy'
import type html2canvasType from 'html2canvas'

/** 關係標籤配色。合類用木綠、變動用赤、耗損類用褐、重複用水藍、平穩用灰。 */
const RELATION_COLOR: Record<BranchRelation, string> = {
  六合: '#5E7355',
  半合: '#5E7355',
  沖: '#C24A2E',
  刑: '#B23E26',
  穿害: '#9C7A3F',
  破: '#9C7A3F',
  伏吟: '#4A7A96',
  無關: '#8A8071',
}

export default function ResultCard({
  userPillar,
  todayPillar,
  todayLabel,
  result,
  onReset,
}: {
  userPillar: Pillar
  todayPillar: Pillar
  todayLabel: string
  result: RelationResult
  onReset: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)

  const cell = CELLS[result.key]
  const color = RELATION_COLOR[result.branchRelation]
  const mark = result.marks[0]

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return
    setExporting(true)
    try {
      const h2c = (await import('html2canvas')).default as typeof html2canvasType
      const canvas = await h2c(cardRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `daily_${todayPillar.stem}${todayPillar.branch}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      // 匯出失敗不阻塞閱讀，用戶仍可自行截圖
    } finally {
      setExporting(false)
    }
  }, [todayPillar])

  if (!cell) {
    return (
      <div className="rounded-lg border border-[color:var(--border-card)] bg-[#FFFFFF] p-6">
        <p className="text-[#C24A2E] text-sm">今日的文案暫時取不到，請稍後再試。</p>
      </div>
    )
  }

  return (
    <div>
      <div
        ref={cardRef}
        className="rounded-lg border border-[color:var(--border-card)] shadow-[var(--shadow-card)] overflow-hidden bg-[#FFFFFF]"
      >
        {/* 日柱對照 */}
        <div className="px-6 sm:px-8 py-6 border-b border-[#2B241C]/10" style={{ background: `${color}08` }}>
          <div className="flex items-center justify-between gap-4 mb-5">
            <p className="text-[#8A8071] text-[11px] tracking-widest">{todayLabel}</p>
            <span
              className="inline-flex items-center border rounded-full px-3 py-1 text-xs font-bold"
              style={{ color, borderColor: `${color}40`, background: `${color}12` }}
            >
              {RELATION_LABEL[result.branchRelation]}
            </span>
          </div>

          <div className="flex items-center gap-5 sm:gap-8">
            <PillarBlock label="你的日柱" pillar={userPillar} color="#8A8071" />
            <div className="flex-shrink-0 text-[#8A8071] text-lg">對</div>
            <PillarBlock label="今日" pillar={todayPillar} color={color} emphasis />
          </div>
        </div>

        {/* 一句定性 */}
        <div className="px-6 sm:px-8 py-7">
          <p className="text-[#2B241C] text-lg sm:text-xl leading-relaxed font-semibold">
            {cell.tone}
          </p>
          {mark && (
            <p className="text-[#6B6155] text-sm leading-relaxed mt-4 pl-4 border-l-2" style={{ borderColor: `${color}50` }}>
              {MARK_COPY[mark]}
            </p>
          )}
        </div>

        {/* 宜 / 不宜 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 sm:px-8 pb-7">
          <div className="rounded-lg border-l-4 border-[#5E7355] bg-[#5E7355]/[0.05] px-5 py-5">
            <p className="text-[#5E7355] text-xs font-semibold tracking-widest mb-3">宜</p>
            <ul className="space-y-2">
              {cell.yi.map((item, i) => (
                <li key={i} className="flex gap-2 text-[#2B241C] text-sm leading-relaxed">
                  <span className="text-[#5E7355] text-xs mt-1 flex-shrink-0">◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-[#C24A2E] bg-[#C24A2E]/[0.05] px-5 py-5">
            <p className="text-[#C24A2E] text-xs font-semibold tracking-widest mb-3">不宜</p>
            <ul className="space-y-2">
              <li className="flex gap-2 text-[#2B241C] text-sm leading-relaxed">
                <span className="text-[#C24A2E] text-xs mt-1 flex-shrink-0">◆</span>
                <span>{cell.buYi}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 層級聲明（§6.3）：出現在分享圖之內，不可省 */}
        <div className="px-6 sm:px-8 py-4 border-t border-[#2B241C]/10 bg-[#F4EEE1]/50">
          <p className="text-[#6B6155] text-xs leading-relaxed">
            流日只是引動，不是決定。上面說的是今日這股氣往哪個方向推，推得成與否，仍然要看你當下怎樣接。
          </p>
        </div>
      </div>

      {/* 操作列（不入分享圖） */}
      <div className="flex flex-wrap items-center gap-3 mt-5">
        <button
          onClick={handleShare}
          disabled={exporting}
          className="rounded-lg border border-[color:var(--border-card)] bg-[#FFFFFF] hover:border-[#B23E26]/40 text-[#5A5247] text-sm px-4 py-2 transition-colors disabled:opacity-50"
        >
          {exporting ? '製作中' : '儲存分享圖'}
        </button>
        <button
          onClick={onReset}
          className="rounded-lg border border-[color:var(--border-card)] bg-[#FFFFFF] hover:border-[#B23E26]/40 text-[#5A5247] text-sm px-4 py-2 transition-colors"
        >
          換一個出生日期
        </button>
      </div>

      {/* 升級路徑（§6.5） */}
      <div className="mt-8 rounded-lg bg-[#F4EEE1] px-6 py-6">
        <p className="text-[#2B241C] text-sm leading-relaxed mb-4">
          日柱只答得到今日。要答一世，需要年、月、日、時四柱齊全，其中時辰是缺不得的一柱。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/bazi" className="text-[#B23E26] text-sm font-semibold hover:underline">
            排一張完整的四柱命盤
          </Link>
          <span className="text-[#8A8071] text-sm">·</span>
          <Link href="/daily" className="text-[#B23E26] text-sm font-semibold hover:underline">
            看今日的大環境能量
          </Link>
        </div>
      </div>
    </div>
  )
}

function PillarBlock({ label, pillar, color, emphasis = false }: {
  label: string
  pillar: Pillar
  color: string
  emphasis?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[#8A8071] text-[10px] tracking-widest">{label}</span>
      <div
        className="flex flex-col items-center justify-center rounded-lg border px-4 py-2.5 gap-0.5"
        style={{ borderColor: `${color}40`, background: `${color}10` }}
      >
        <span
          className={`font-serif font-black leading-none ${emphasis ? 'text-4xl' : 'text-3xl'}`}
          style={{ color }}
        >
          {pillar.stem}
        </span>
        <span
          className={`font-serif font-bold leading-none text-[#2B241C] ${emphasis ? 'text-3xl' : 'text-2xl'}`}
        >
          {pillar.branch}
        </span>
      </div>
    </div>
  )
}

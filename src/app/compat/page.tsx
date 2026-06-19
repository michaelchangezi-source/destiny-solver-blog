import type { Metadata } from 'next'
import CompatCalculator from './CompatCalculator'

export const metadata: Metadata = {
  title: '八字合盤｜干支互動分析',
  description: '輸入兩人出生資料，即時分析雙方四柱的天干五合、地支六合、六沖、六害等干支互動關係。destiny.solver 免費合盤工具。',
  alternates: { canonical: '/compat' },
}

export default function CompatPage() {
  return (
    <main className="pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <p className="text-[#B23E26]/60 text-[10px] tracking-[0.3em] uppercase">Free Tool</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#B23E26] tracking-wider">
            八字合盤
          </h1>
          <p className="text-[#6B6155] text-sm">輸入兩人生日，即時分析干支互動關係</p>
        </div>
        <CompatCalculator />
      </div>
    </main>
  )
}

import type { Metadata } from 'next'
import BaziCalculator from './BaziCalculator'

export const metadata: Metadata = {
  title: '八字速算｜免費四柱大運排盤',
  description: '輸入出生年月日時，即時計算四柱命盤、十神及十個大運。destiny.solver 免費八字排盤工具。',
}

export default function BaziPage() {
  return (
    <main className="pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <p className="text-[#C9A84C]/60 text-[10px] tracking-[0.3em] uppercase">Free Tool</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#C9A84C] tracking-wider">
            八字速算
          </h1>
          <p className="text-white/45 text-sm">輸入出生資料，即時排出四柱命盤及大運</p>
        </div>
        <BaziCalculator />
      </div>
    </main>
  )
}

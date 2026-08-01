import { CheckCircle } from 'lucide-react'

export const CONSULTATION_PRICE = '800'

function PricingCard({ label, price, suffix, items }: {
  label: string
  price: string
  suffix: string
  items: string[]
}) {
  return (
    <div className="relative bg-[#FFFFFF] rounded-lg p-7 flex flex-col text-left overflow-hidden shadow-[var(--shadow-card)] border border-[color:var(--border-card)]">
      <p className="text-[#B23E26] text-xs font-semibold tracking-[0.25em] uppercase mb-3">
        {label}
      </p>
      <p className="font-serif text-[#2B241C] text-4xl font-black mb-5">
        <span className="text-xl font-bold text-[#6B6155] align-top mr-1">HK$</span>
        {Number(price).toLocaleString('en-US')}
        <span className="text-xl font-bold text-[#6B6155] ml-1">{suffix}</span>
      </p>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[#5A5247] text-sm leading-relaxed">
            <CheckCircle size={15} className="text-[#B23E26] flex-shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function PricingTiers() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
      <PricingCard
        label="個人命盤諮詢"
        price={CONSULTATION_PRICE}
        suffix="起"
        items={['命格整體解讀', '性格與天賦', '當前大運分析', '1-2 個人生議題深入解答']}
      />
      <PricingCard
        label="雙人合盤諮詢"
        price="2000"
        suffix=""
        items={['兩命盤干支結構配合分析', '六合、沖剋、刑害關係解讀', '關係能量模式與互動盲點', '共同重要時間節點建議']}
      />
    </div>
  )
}

import { CheckCircle, XCircle } from 'lucide-react'

export const CONSULTATION_PRICE = '800'

function PricingCard({ label, price, suffix, items, exclusion }: {
  label: string
  price: string
  suffix: string
  items: string[]
  exclusion?: string
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
        {exclusion && (
          <li className="flex items-start gap-2.5 text-sm leading-relaxed mt-1 pt-1 border-t border-[#B23E26]/15">
            <XCircle size={15} className="text-[#B23E26] flex-shrink-0 mt-0.5" />
            <span className="text-[#B23E26] font-medium">{exclusion}</span>
          </li>
        )}
      </ul>
    </div>
  )
}

export default function PricingTiers() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
      <PricingCard
        label="人生定位分析報告"
        price="500"
        suffix=""
        items={['命格整體分析', '性格優勢與潛能', '事業、財運、感情發展方向', '現階段大運重點', 'PDF 完整分析報告']}
        exclusion="不包含一對一策略諮詢"
      />
      <PricingCard
        label="人生策略諮詢"
        price={CONSULTATION_PRICE}
        suffix="起"
        items={['命格整體分析', '性格與能力分析', '大運趨勢解析', '事業、財運、感情發展方向', '自選 1 條問題作深入分析（每多一項問題，需另加 HK$400）', 'PDF 完整分析報告', '一對一線上諮詢']}
      />
      <PricingCard
        label="雙人關係分析"
        price="2800"
        suffix=""
        items={['雙方命盤交叉分析', '關係互動模式', '性格互補與磨合重點', '關係中的優勢與風險', '未來重要時間節點分析', '一對一深入解說']}
      />
    </div>
  )
}

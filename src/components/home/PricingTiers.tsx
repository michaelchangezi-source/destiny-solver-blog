import { CheckCircle } from 'lucide-react'

export const CONSULTATION_PRICE = '800'

export default function PricingTiers() {
  const includes = ['命格整體解讀', '性格與天賦', '當前大運分析', '1-2 個人生議題深入解答']
  return (
    <div className="max-w-sm">
      <div className="relative bg-[#FFFFFF] rounded-lg p-7 flex flex-col text-left overflow-hidden shadow-[var(--shadow-card)] border border-[color:var(--border-card)]">
        <p className="text-[#B23E26] text-xs font-semibold tracking-[0.25em] uppercase mb-3">
          一對一命理諮詢
        </p>
        <p className="font-serif text-[#2B241C] text-4xl font-black mb-5">
          <span className="text-xl font-bold text-[#6B6155] align-top mr-1">HK$</span>
          {Number(CONSULTATION_PRICE).toLocaleString('en-US')}
          <span className="text-xl font-bold text-[#6B6155] ml-1">起</span>
        </p>
        <ul className="space-y-2.5 mb-5">
          {includes.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[#5A5247] text-sm leading-relaxed">
              <CheckCircle size={15} className="text-[#B23E26] flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

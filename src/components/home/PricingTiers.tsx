import { CheckCircle } from 'lucide-react'

export type PricingTier = {
  id: string
  name: string
  /** 純數字，供 Offer schema 與版面共用，確保頁面與結構化資料一致。 */
  price: string
  featured: boolean
  /** 交付物。站主尚未確認的層級留空陣列，版面自動不顯示清單。 */
  includes: string[]
  /** 付款時點。站主尚未確認前留空字串，版面自動不顯示該行。 */
  payment: string
}

// 價格由站主拍板：HK$800 / HK$1,600 / HK$2,400，中間層標「最多人選」。
//
// TODO（待站主填入，未填之前一律留空，不得自行補寫）：
//   1. tier-1600 與 tier-2400 的方案名稱（現以「方案二」「方案三」佔位）
//   2. tier-1600 與 tier-2400 的 includes（交付物逐項）
//   3. 三個層級的 payment（付款時點與方式，例如「完成解讀後付款」）
//   4. 三個層級的諮詢時長（時長欄位在 /consultation 的「服務說明」區，同樣待填）
// tier-800 的 includes 取自 /consultation 現有的真實說明，未經站主確認不要改動。
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'tier-800',
    name: '基礎諮詢',
    price: '800',
    featured: false,
    includes: ['命格整體解讀', '性格與天賦', '當前大運分析', '1-2 個人生議題深入解答'],
    payment: '',
  },
  {
    id: 'tier-1600',
    name: '方案二',
    price: '1600',
    featured: true,
    includes: [],
    payment: '',
  },
  {
    id: 'tier-2400',
    name: '方案三',
    price: '2400',
    featured: false,
    includes: [],
    payment: '',
  },
]

function formatPrice(price: string) {
  return Number(price).toLocaleString('en-US')
}

export default function PricingTiers() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {PRICING_TIERS.map((tier) => (
        <div
          key={tier.id}
          className={`relative bg-[#FFFFFF] rounded-lg p-7 flex flex-col text-left overflow-hidden shadow-[var(--shadow-card)] ${
            tier.featured
              ? 'border-2 border-[#B23E26] sm:-mt-2 sm:pb-9'
              : 'border border-[color:var(--border-card)]'
          }`}
        >
          {tier.featured && (
            <span className="absolute top-0 right-0 bg-[#B23E26] text-[#FBF7EE] text-[11px] font-bold tracking-widest px-3 py-1 rounded-bl-lg">
              最多人選
            </span>
          )}
          <p className="text-[#B23E26] text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            {tier.name}
          </p>
          <p className="font-serif text-[#2B241C] text-4xl font-black mb-5">
            <span className="text-xl font-bold text-[#6B6155] align-top mr-1">HK$</span>
            {formatPrice(tier.price)}
          </p>

          {tier.includes.length > 0 ? (
            <ul className="space-y-2.5 mb-5">
              {tier.includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[#5A5247] text-sm leading-relaxed">
                  <CheckCircle size={15} className="text-[#B23E26] flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#8A8071] text-sm leading-relaxed mb-5">
              詳細內容請先透過訊息查詢，確認方向後再開始。
            </p>
          )}

          {tier.payment && (
            <p className="mt-auto text-[#6B6155] text-xs leading-relaxed border-t border-[#2B241C]/10 pt-4">
              付款時點：{tier.payment}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

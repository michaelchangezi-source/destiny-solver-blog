import { CheckCircle, XCircle } from 'lucide-react'

// 自我篩選雙欄（P2-2）。內容與 /consultation 的詳細版同源，
// 首頁只做對照，內頁保留完整版本。
const suitable = [
  '正面臨職業轉換、創業或移民，需要一個結構性的時機評估',
  '感覺跟現有環境格格不入，想理解自己的能量結構與天賦',
  '正在處理感情或婚姻的重大決定，需要看清楚雙方能量的動態',
  '長期有某種模式重複出現，想找到根源而不是再忍一次',
  '願意聽直接的意見，包括不好聽的那一部分',
]

const notSuitable = [
  '想用占卜式問事代替判斷（例如這個月能否投資、明天適不適合出門）',
  '希望得到百分之百的保證，或者希望命理替你把決定做完',
  '只接受自己本來就想聽的答案，其餘一律不算',
  '主要目的是測試、挑戰或反駁命理師',
  '想用算命代替醫療、法律或心理健康的專業建議',
]

export default function SelfQualification() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="bg-[#FFFFFF] border border-[color:var(--border-card)] shadow-[var(--shadow-card)] rounded-lg p-7">
        <h3 className="text-[#2B241C] font-bold mb-5 flex items-center gap-2">
          <CheckCircle size={18} className="text-[#B23E26]" />
          可能適合你
        </h3>
        <ul className="space-y-3">
          {suitable.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[#5A5247] text-sm leading-relaxed">
              <span className="text-[#B23E26] mt-0.5 flex-shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-[#F4EEE1] border border-[color:var(--border-card)] rounded-lg p-7">
        <h3 className="text-[#2B241C] font-bold mb-5 flex items-center gap-2">
          <XCircle size={18} className="text-[#8A8071]" />
          可能未必適合你
        </h3>
        <ul className="space-y-3">
          {notSuitable.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[#5A5247] text-sm leading-relaxed">
              <span className="text-[#8A8071] mt-0.5 flex-shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle, Mail, CheckCircle, Clock, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: '預約諮詢',
  description: '預約一對一八字命理深度諮詢，解讀你的格局、時機與人生方向。',
}

export default function ConsultationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-[#C9A84C] text-sm font-semibold tracking-widest mb-4">CONSULTATION</p>
        <h1 className="text-white text-4xl sm:text-5xl font-black mb-6">一對一命理諮詢</h1>
        <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
          深度解讀你的八字格局，讓命理成為你人生決策的羅盤。
        </p>
      </div>

      {/* What you get */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10">
        <h2 className="text-white text-xl font-bold mb-6">諮詢內容包括</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            '八字本命格局完整分析',
            '五行能量強弱與用神判定',
            '大運流年時機解讀',
            '感情、事業、健康深度取象',
            '個人核心優勢與盲點剖析',
            '未來 1-3 年關鍵時間節點',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle size={16} className="text-[#C9A84C] flex-shrink-0" />
              <span className="text-white/70 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="mb-10">
        <h2 className="text-white text-xl font-bold mb-6">預約流程</h2>
        <div className="space-y-4">
          {[
            { step: '01', title: '發送訊息', desc: '透過 Threads / IG 私訊或 Email 聯絡，說明你希望諮詢的方向' },
            { step: '02', title: '確認資料', desc: '提供出生年月日及出生時間（以確認八字命盤）' },
            { step: '03', title: '安排時間', desc: '雙方確認合適的諮詢日期與時間' },
            { step: '04', title: '開始解讀', desc: '以視訊或文字形式進行深度命盤解讀' },
          ].map((item) => (
            <div key={item.step} className="flex gap-5 items-start">
              <span className="text-[#C9A84C] text-2xl font-black w-10 flex-shrink-0">{item.step}</span>
              <div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        <a
          href="https://www.threads.com/@destiny.solver"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-[#C9A84C] hover:bg-[#B8963B] text-[#0F0F2D] font-bold py-4 px-6 rounded-2xl transition-colors"
        >
          <MessageCircle size={20} />
          Threads 私訊預約
        </a>
        <a
          href="mailto:michaelchan.gezi@gmail.com?subject=命理諮詢預約"
          className="flex items-center justify-center gap-3 border border-[#C9A84C]/40 hover:border-[#C9A84C] text-white font-bold py-4 px-6 rounded-2xl transition-colors"
        >
          <Mail size={20} />
          Email 聯絡
        </a>
      </div>

      {/* Notes */}
      <div className="bg-white/3 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white/70 font-semibold mb-3 flex items-center gap-2">
          <Clock size={16} className="text-[#C9A84C]" /> 注意事項
        </h3>
        <ul className="space-y-2 text-white/40 text-sm">
          <li>· 請提前準備正確的出生時間（以時柱計算為主）</li>
          <li>· 如出生時間不確定，可提供大約時間範圍，以進行校正</li>
          <li>· 諮詢以廣東話或普通話進行</li>
          <li>· 回覆時間：工作日 24 小時內</li>
        </ul>
      </div>
    </div>
  )
}

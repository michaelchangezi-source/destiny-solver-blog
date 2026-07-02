import type { Metadata } from 'next'
import Image from 'next/image'
import { MessageCircle, Mail, CheckCircle, Clock, Star, XCircle } from 'lucide-react'
import { SITE_URL, PERSON } from '@/lib/site'

export const metadata: Metadata = {
  title: '預約諮詢',
  description: '預約一對一八字命理深度諮詢，解讀你的格局、時機與人生方向。',
  alternates: { canonical: '/consultation' },
}

const testimonials = [
  {
    id: '01',
    name: 'T 小姐',
    tag: 'T 小姐 · 31 · 台北',
    quote: '陳師給我看見了自己天賦的方向，也幫我想清楚怎樣爭取更適合自己的職位。',
    content:
      '我在家族的小型事務所做行政，整整做了幾年。明明很努力，卻一直有種才能被埋沒、方向錯了的窒息感，還同時面對感情失戀和自我認同的危機。\n\n諮詢後我才明白，不是我不夠努力，是我的能量結構根本不適合那個封閉的環境。陳師給我看見了自己天賦的方向，也幫我想清楚怎樣跟父母談判、爭取更適合自己的職位。\n\n那次諮詢後，焦慮沒有消失，但我知道自己在往哪裡走了。這個「方向感」，是我以前怎麼努力都找不到的東西。',
  },
  {
    id: '02',
    name: 'J 女士',
    tag: 'J 女士 · 53 · 美國',
    quote: '陳師用結構和數據說話，讓我看清楚自己的財運底氣其實比我想像的強得多。',
    content:
      '我在婚姻的十字路口待了很久，猶豫要不要離婚，最大的恐懼是：年過半百，孩子快上大學，我還有財務能力獨立生活嗎？\n\n陳師把我的命盤拆開來給我看，用結構和數據說話，不是叫我「跟從命運」，而是讓我看清楚自己的財運底氣其實比我想像的強得多。他也指出地產方向適合我，這跟我自己的直覺不謀而合。\n\n現在我已經開始備考地產經紀執照。不是因為命理告訴我，而是因為我終於有了底氣，相信自己做得到。',
  },
  {
    id: '03',
    name: 'C 醫師',
    tag: 'C 醫師 · 45 · 香港',
    quote: '他不是叫我等，而是告訴我現在應該做哪些「沉澱」，為未來的起跑做準備。',
    content:
      '我在打工的事業上遇到了天花板，心裡很清楚自己想創業，但一直拿不定主意：現在做？還是等？\n\n陳師的分析非常冷靜直接——他把我目前的大運結構和下一個大運的差異清楚說明，讓我理解為什麼現在創業的阻力比五年後大得多。他不是叫我等，而是告訴我現在應該做哪些「沉澱」，為未來的起跑做準備。\n\n我帶著這份清晰回去了。少了那種「明明想動卻不知該不該動」的焦慮。',
  },
  {
    id: '04',
    name: 'W 小姐',
    tag: 'W 小姐 · 29 · 香港',
    quote: '我第一次覺得：過去那些「壞事」是有意義的，我現在走的路是對的。',
    content:
      '二十幾歲經歷了很多：失去至親、感情被背叛、被朋友傷害。那幾年我一直在問自己：為什麼這些事情全都發生在我身上？\n\n陳師用八字幫我看見了那段時間的「格局意義」——不是說我命苦，而是說那些遭遇在命理結構上有清晰的邏輯，而且它們在幫我長出邊界感。我放棄了沒有出路的生活、回來讀書，他說這個選擇在命理上非常準確。\n\n我第一次覺得：過去那些「壞事」是有意義的，我現在走的路是對的。',
  },
]

const faq = [
  {
    q: '什麼人適合來做命理諮詢？',
    a: '正在面臨人生交叉點的人——不論是職業方向、感情決策、移民或創業時機。諮詢不是給對生活完全滿意的人，而是給那些「有想法但方向模糊」或「知道有問題但說不清楚」的人。',
  },
  {
    q: '命理可以預測未來嗎？是命定論嗎？',
    a: '命理給你的不是「你一定會怎樣」，而是「你的能量結構在這段時期的傾向是什麼」。它更像是地形圖，告訴你哪段路是上坡、哪段風較大，但你決定怎麼走。這是認識自己的工具，不是讓你交出決定權。',
  },
  {
    q: '我不確定自己的出生時辰，還能諮詢嗎？',
    a: '如時辰不確定需要進行定盤，但起碼要本身知道一個出生時間範圍，誤差不可多於 2 小時。',
  },
  {
    q: '你的解讀方式跟其他命理師有什麼不同？',
    a: '我用盲派八字體系，以邏輯和結構分析命局，不依賴神祕語言或感性包裝。我會直接說出命盤顯示的優勢和問題，不迴避缺點，也不過度美化。我相信清醒的認識，比模糊的安慰更有價值。',
  },
  {
    q: '一次諮詢可以問哪些問題？',
    a: '基礎諮詢（HK$800）涵蓋：命格整體解讀、性格與天賦、當前大運分析、以及你最關心的 1-2 個人生議題（如事業方向、感情判斷、時機評估）。',
  },
  {
    q: '諮詢需要準備什麼？',
    a: '出生年月日、時辰（如不確定請提供大約範圍）、性別，以及你的人生重要事件（如重大轉折、結婚、失業等年份）。事件越具體，分析越準確。',
  },
  {
    q: '諮詢以什麼形式進行？',
    a: '可以透過 Threads / IG 私訊、Email 或 WhatsApp 進行。',
  },
  {
    q: '如果你說的跟我的感受不符，怎麼辦？',
    a: '這是正常的，也是最值得深入的時刻。命理分析提供的是結構視角，你的親身感受提供的是現實驗證。兩者出現落差時，我們一起找原因——有時候是時辰需要校正，有時候是某些能量還沒有顯化。',
  },
  {
    q: '我需要相信命理才能受惠嗎？',
    a: '不需要。我更希望你帶著懷疑來，用你的親身經歷對照分析，看看命理視角是否幫你看見了什麼新的東西。信不信由你，但看見了，就是看見了。',
  },
]

const willAccept = [
  '面臨職業轉換、創業或移民，需要一個結構性的時機評估',
  '感覺跟現有環境「格格不入」，想理解自己的能量結構與天賦',
  '正在處理感情或婚姻的重大決定，需要看清楚雙方能量的動態',
  '長期有某種模式重複出現（如不斷遇到同類困境），想找到根源',
  '想透過大運流年，為未來 3-5 年的人生佈局找到節奏',
]

const wontAccept = [
  '占卜式問事（「這個月能否投資」「明天適不適合出門」）',
  '尋找失物、失蹤者或任何涉及他人隱私的問題',
  '要求詛咒或以任何方式影響他人命運',
  '只求「黃道吉日」擇日，而非理解命理結構的服務',
  '以算命代替醫療、法律或心理健康的專業建議',
]

const pricingIncludes = [
  '命格整體解讀',
  '性格與天賦',
  '當前大運分析',
  '1-2 個人生議題深入解答',
]

const THREADS_DM_URL = 'https://www.threads.net/@destiny.solver'
const MAILTO_URL =
  'mailto:michaelchan.gezi@gmail.com?subject=' +
  encodeURIComponent('預約八字諮詢') +
  '&body=' +
  encodeURIComponent('稱呼：\n出生年月日時：\n想諮詢的方向：\n')

// ── 結構化資料（AEO）────────────────────────────────────────────
const SERVICE_ID = `${SITE_URL}/consultation#service`

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': SERVICE_ID,
  name: '一對一八字命理諮詢',
  serviceType: '八字命理諮詢',
  description:
    '深度解讀八字本命格局、五行能量強弱與用神、大運流年時機，涵蓋事業、感情、健康等人生議題的一對一命理諮詢。',
  provider: PERSON,
  areaServed: { '@type': 'Place', name: '香港' },
  url: `${SITE_URL}/consultation`,
  inLanguage: 'zh-TW',
  availableChannel: [
    { '@type': 'ServiceChannel', name: 'Threads 私訊', serviceUrl: THREADS_DM_URL },
    { '@type': 'ServiceChannel', name: 'Email 預約', serviceUrl: 'mailto:michaelchan.gezi@gmail.com' },
  ],
  offers: {
    '@type': 'Offer',
    name: '基礎諮詢',
    price: '800',
    priceCurrency: 'HKD',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/consultation`,
  },
  review: testimonials.map((t) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: t.tag },
    reviewBody: t.content.replace(/\s*\n+\s*/g, ' ').trim(),
    itemReviewed: { '@id': SERVICE_ID },
  })),
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function ConsultationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header：公仔頭像 + 「真人一對一諮詢」文案並列（§2） */}
      <div className="text-center mb-16">
        <div className="relative w-16 h-16 mx-auto mb-5 rounded-full overflow-hidden ring-2 ring-[#B23E26]/25">
          <Image src="/images/avatar.png" alt="命運解決師" fill sizes="64px" className="object-cover" />
        </div>
        <p className="text-[#B23E26] text-sm font-semibold tracking-widest mb-4">真人一對一諮詢</p>
        <h1 className="text-[#2B241C] text-4xl sm:text-5xl font-black mb-6">一對一命理諮詢</h1>
        <p className="text-[#6B6155] text-lg max-w-2xl mx-auto leading-relaxed">
          深度解讀你的八字格局，讓命理成為你人生決策的羅盤。
        </p>
      </div>

      {/* What you get */}
      <div className="bg-[#F4EEE1] rounded-2xl p-8 mb-10">
        <h2 className="text-[#2B241C] text-xl font-bold mb-6">諮詢內容包括</h2>
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
              <CheckCircle size={16} className="text-[#B23E26] flex-shrink-0" />
              <span className="text-[#5A5247] text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing 卡（§5.1）：置中定價，一撳即開的雙 CTA */}
      <div className="relative bg-[#FFFFFF] border border-[#2B241C]/10 rounded-3xl p-10 mb-10 text-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#B23E26]" aria-hidden="true" />
        <p className="text-[#B23E26] text-xs font-semibold tracking-[0.3em] uppercase mb-3">一對一八字諮詢</p>
        <p className="font-serif text-[#2B241C] text-5xl font-black mb-6">
          HK$800<span className="text-2xl font-bold text-[#6B6155]"> 起</span>
        </p>
        <ul className="max-w-sm mx-auto mb-8 space-y-2.5 text-left">
          {pricingIncludes.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-[#5A5247] text-sm">
              <CheckCircle size={15} className="text-[#B23E26] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <a
            href={THREADS_DM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 bg-[#E0552C] hover:bg-[#C9461F] text-[#FBF7EE] font-bold py-3.5 px-6 rounded-lg transition-all duration-200 active:scale-[0.97]"
          >
            <MessageCircle size={18} />
            Threads 私訊預約
          </a>
          <a
            href={MAILTO_URL}
            className="flex items-center justify-center gap-2.5 border border-[#2B241C]/20 hover:border-[#B23E26] hover:text-[#B23E26] text-[#2B241C] font-bold py-3.5 px-6 rounded-lg transition-all duration-200 active:scale-[0.97]"
          >
            <Mail size={18} />
            Email 預約
          </a>
        </div>
      </div>

      {/* Process */}
      <div className="mb-10">
        <h2 className="text-[#2B241C] text-xl font-bold mb-6">預約流程</h2>
        <div className="space-y-4">
          {[
            { step: '01', title: '發送訊息', desc: '透過 Threads / IG 私訊或 Email 聯絡，說明你希望諮詢的方向' },
            { step: '02', title: '確認資料', desc: '提供出生年月日及出生時間（以確認八字命盤）' },
            { step: '03', title: '安排時間', desc: '雙方確認合適的諮詢日期與時間' },
            { step: '04', title: '開始解讀', desc: '透過 Threads / IG 私訊、Email 或 WhatsApp 進行深度命盤解讀' },
          ].map((item) => (
            <div key={item.step} className="flex gap-5 items-start">
              <span className="text-[#B23E26] text-2xl font-black w-10 flex-shrink-0">{item.step}</span>
              <div>
                <h3 className="text-[#2B241C] font-semibold mb-1">{item.title}</h3>
                <p className="text-[#6B6155] text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Will / Won't accept */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        <div className="bg-[#F4EEE1] rounded-2xl p-6">
          <h3 className="text-[#2B241C] font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-[#B23E26]" />
            適合諮詢的情況
          </h3>
          <ul className="space-y-3">
            {willAccept.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[#5A5247] text-sm leading-relaxed">
                <span className="text-[#B23E26] mt-0.5 flex-shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#F4EEE1] rounded-2xl p-6">
          <h3 className="text-[#2B241C] font-bold mb-4 flex items-center gap-2">
            <XCircle size={18} className="text-[#8A8071]" />
            我不接的諮詢
          </h3>
          <ul className="space-y-3">
            {wontAccept.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[#5A5247] text-sm leading-relaxed">
                <span className="text-[#8A8071] mt-0.5 flex-shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Testimonials：卡片化，quote 放大 + 摺埋長文（§5.3） */}
      <div className="mb-16">
        <h2 className="text-[#2B241C] text-xl font-bold mb-8 flex items-center gap-2">
          <Star size={18} className="text-[#B23E26]" />
          客戶見證
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-[#FFFFFF] border border-[#2B241C]/10 rounded-2xl p-6 flex flex-col">
              <p className="font-serif text-[#B23E26] text-3xl leading-none mb-2" aria-hidden="true">
                &ldquo;
              </p>
              <p className="text-[#2B241C] font-serif font-semibold text-base leading-relaxed mb-4">
                {t.quote}
              </p>
              <p className="text-[#8A8071] text-xs tracking-wide mb-4">{t.tag}</p>
              <details className="mt-auto group">
                <summary className="text-[#B23E26] text-xs font-semibold cursor-pointer list-none flex items-center gap-1 select-none">
                  閱讀完整見證
                  <span className="transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="mt-3 space-y-3">
                  {t.content.split('\n\n').map((para, i) => (
                    <p key={i} className="text-[#6B6155] text-sm leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="text-[#2B241C] text-xl font-bold mb-8">常見問題</h2>
        <div className="space-y-4">
          {faq.map((item, i) => (
            <div key={i} className="bg-[#F4EEE1] rounded-2xl p-6">
              <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-2">Q{i + 1}</p>
              <h3 className="text-[#2B241C] font-semibold mb-3">{item.q}</h3>
              <p className="text-[#6B6155] text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-[#F4EEE1] rounded-2xl p-6">
        <h3 className="text-[#5A5247] font-semibold mb-3 flex items-center gap-2">
          <Clock size={16} className="text-[#B23E26]" /> 注意事項
        </h3>
        <ul className="space-y-2 text-[#8A8071] text-sm">
          <li>· 請提前準備正確的出生時間（以時柱計算為主）</li>
          <li>· 如出生時間不確定，需提供時間範圍，誤差不可多於 2 小時</li>
          <li>· 諮詢以廣東話或普通話進行</li>
          <li>· 回覆時間：工作日 24 小時內</li>
        </ul>
      </div>
    </div>
  )
}

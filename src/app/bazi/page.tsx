import type { Metadata } from 'next'
import BaziCalculator from './BaziCalculator'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: '八字速算｜免費四柱大運排盤',
  description: '輸入出生年月日時，即時計算四柱命盤、十神及十個大運。destiny.solver 免費八字排盤工具。',
  alternates: { canonical: '/bazi' },
}

const faq = [
  {
    q: '八字排盤需要準確的出生時辰嗎？',
    a: '時柱是四柱之一，關係到十神與藏干的完整分佈，出生時辰不準確，分析結果會有偏差。如果不確定準確時辰，可以先選擇「不確定時辰」排出年月日三柱，再另行核實時辰。',
  },
  {
    q: '什麼是日主？',
    a: '日主是日柱的天干，代表命主本身。其餘各柱與日主之間的對應關係稱為十神，是解讀性格傾向與人生模式的起點。',
  },
  {
    q: '藏干是什麼？',
    a: '藏干是地支內部所含的天干，依力量深淺分為本氣、中氣、餘氣三層，是判斷命局細節的重要依據，通常本氣力量最強，中氣次之，餘氣最弱。',
  },
  {
    q: '大運如何計算起運歲數？',
    a: '起運歲數根據出生時刻與最近節氣交節時刻的距離推算，工具會列出起運歲數與起運年份，並標示目前所處的大運，讓你了解自己身處哪一個十年氣候之中。',
  },
  {
    q: '排出來的命盤代表命運已經注定嗎？',
    a: '四柱八字提供的是命主先天的能量結構與傾向，實際人生發展仍然涉及大運流年的引動、環境際遇與個人選擇。排盤本身只是分析的起點，並非最終結論。',
  },
  {
    q: '這個工具需要付費嗎？',
    a: '不需要，八字速算是完全免費的線上工具，即時排出四柱與十個大運，無需註冊或安裝。',
  },
]

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '八字速算',
  url: `${SITE_URL}/bazi`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description:
    '輸入出生年月日時，即時計算四柱命盤、十神及十個大運的免費線上工具。',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HKD' },
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

export default function BaziPage() {
  return (
    <main className="pt-24 pb-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <p className="text-[#B23E26]/60 text-[10px] tracking-[0.3em] uppercase">Free Tool</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#B23E26] tracking-wider">
            八字速算
          </h1>
          <p className="text-[#6B6155] text-sm">輸入出生資料，即時排出四柱命盤及大運</p>
        </div>
        <BaziCalculator />

        {/* 工具說明 */}
        <div className="max-w-3xl mx-auto mt-16 space-y-10">
          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">排盤計算什麼</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              輸入出生年、月、日、時之後，系統會換算出年柱、月柱、日柱、時柱四組天干地支組合，合稱「四柱八字」。每一柱由一個天干與一個地支組成，天干地支各自對應五行（木、火、土、金、水），是後續命理分析的基本材料。日柱的天干稱為「日主」，代表命主本身；其餘各柱與日主之間的對應關係，稱為「十神」，共有比肩、劫財、食神、傷官、正財、偏財、正官、七殺、正印、偏印十種。每個地支之下另外藏有「藏干」，即地支內部所含的天干，依力量深淺分為本氣、中氣、餘氣三層，是判斷命局細節的重要依據。工具同時會排出十個大運，每個大運管十年，反映人生不同階段的整體氣候與節奏。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">如何理解結果</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              四柱排出之後，首先要確認日主，即工具特別標示的那一柱天干，代表命主本身。其餘三柱與日主之間標示的十神，反映命主與財星、官殺、印星、食傷等能量之間的對應關係，是解讀性格傾向與人生模式的起點。每一柱地支下方列出的藏干，連同對應的十神與力量層次，補充地支內部隱藏的訊息，通常本氣的力量最強，中氣次之，餘氣最弱。大運部分，工具會標示目前所處的大運，並附上起運歲數與起運年份，可以了解自己目前處於哪一個十年氣候之中，以及下一個大運轉換的時間點。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">常見誤解</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              第一個常見誤解，是以為出生時辰不重要，可以隨便選一個。時柱屬於四柱之一，關係到十神與藏干的完整分佈，時辰不準確，分析結果亦會偏差，如果不確定準確時辰，建議先以「不確定時辰」選項排出年月日三柱，再另行核實時辰。第二個常見誤解，是把單一十神或單一大運看作絕對定論。命理分析從來是整體格局的判斷，一個十神或一步大運只是命局眾多元素之中的一環，不能脫離四柱整體與大運流年的交互作用單獨解讀。第三個常見誤解，是把排盤結果當成命運的最終判決。四柱八字提供的是命主先天的能量結構與傾向，實際人生發展仍然涉及大運流年的引動、環境際遇與個人選擇，排盤本身只是分析的起點，並非結論。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-6">常見問題</h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <div key={i} className="bg-[#F4EEE1] rounded-lg p-6">
                  <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-2">Q{i + 1}</p>
                  <h3 className="text-[#2B241C] font-semibold mb-3">{item.q}</h3>
                  <p className="text-[#6B6155] text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

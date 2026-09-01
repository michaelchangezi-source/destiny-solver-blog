import BaziCalculator from './BaziCalculator'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'
import { getArticlesByElement, getArticlesByCategory } from '@/lib/articles'
import type { ArticleMeta } from '@/types'

export const metadata = buildMetadata({
  title: '免費八字排盤算命｜四柱命盤大運速算',
  description: '免費八字排盤算命工具，輸入生辰八字即時算出四柱命盤、十神、藏干及大運。支援真太陽時校正、神煞查詢、流年流月時間軸。生辰八字查詢、八字算命免費，香港命運解決師陳卓賢出品，無需註冊。',
  path: '/bazi',
})

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
    q: '什麼是真太陽時？排盤時需要用嗎？',
    a: '真太陽時是根據出生地的實際經度與當日的均時差，將鐘錶時間校正為太陽實際運行的時間。由於時區覆蓋範圍廣，同一時區內不同經度的真太陽時可能相差數十分鐘。如果出生時間剛好落在時辰交界附近，校正後可能改變時柱。一般情況下，真太陽時校正對結果影響不大。如果知道精確出生時分與出生地，可在進階選項中啟用真太陽時校正，工具會同時顯示校正前後的時柱供比對。',
  },
  {
    q: '這個工具需要付費嗎？',
    a: '不需要，八字速算是完全免費的線上工具，即時排出四柱與十個大運，無需註冊或安裝。',
  },
]

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '免費八字排盤｜命運解決師 陳卓賢',
  alternateName: '八字速算',
  url: `${SITE_URL}/bazi`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description:
    '香港免費八字排盤工具，輸入出生年月日時即時算出四柱命盤、日主、十神、藏干及十個大運起運歲數，無需註冊。',
  featureList: ['四柱排盤', '日主與十神計算', '藏干顯示（本氣中氣餘氣）', '大運起運歲數', '目前所處大運標示', '天文精算節氣', '真太陽時校正', '神煞查詢', '流年流月時間軸'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HKD' },
  author: {
    '@type': 'Person',
    name: '陳卓賢',
    url: `${SITE_URL}/about`,
  },
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

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '八字速算', item: `${SITE_URL}/bazi` },
  ],
}

export default function BaziPage() {
  const articlesByElement: Record<string, ArticleMeta[]> = {
    '木': getArticlesByElement('木', undefined, 3),
    '火': getArticlesByElement('火', undefined, 3),
    '土': getArticlesByElement('土', undefined, 3),
    '金': getArticlesByElement('金', undefined, 3),
    '水': getArticlesByElement('水', undefined, 3),
  }
  // 按十神類別預載文章，供客戶端根據命盤結果精準推薦
  const articlesByCategory: Record<string, ArticleMeta[]> = {
    '十神應用': getArticlesByCategory('十神應用').slice(0, 3),
    '命盤格局': getArticlesByCategory('命盤格局').slice(0, 3),
    '事業財運': getArticlesByCategory('事業財運').slice(0, 3),
    '感情格局': getArticlesByCategory('感情格局').slice(0, 3),
    '大運流年': getArticlesByCategory('大運流年').slice(0, 3),
    '干支詳解': getArticlesByCategory('干支詳解').slice(0, 3),
  }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <p className="text-[#B23E26]/60 text-[10px] tracking-[0.3em] uppercase">Free Tool</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#B23E26] tracking-wider">
            免費八字排盤
          </h1>
          <p className="text-[#6B6155] text-sm">輸入出生年月日時，即時排出四柱命盤、日主十神及十個大運</p>
        </div>
        <BaziCalculator articlesByElement={articlesByElement} articlesByCategory={articlesByCategory} />

        {/* 工具說明 */}
        <div className="max-w-3xl mx-auto mt-16 space-y-10">
          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">香港免費八字排盤：四柱命盤計算什麼</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              輸入出生年、月、日、時之後，系統會換算出年柱、月柱、日柱、時柱四組天干地支組合，合稱「四柱八字」。每一柱由一個天干與一個地支組成，天干地支各自對應五行（木、火、土、金、水），是後續命理分析的基本材料。日柱的天干稱為「日主」，代表命主本身；其餘各柱與日主之間的對應關係，稱為「十神」，共有比肩、劫財、食神、傷官、正財、偏財、正官、七殺、正印、偏印十種。每個地支之下另外藏有「藏干」，即地支內部所含的天干，依力量深淺分為本氣、中氣、餘氣三層，是判斷命局細節的重要依據。工具同時會排出十個大運，每個大運管十年，反映人生不同階段的整體氣候與節奏。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">排盤之後如何讀懂日主與十神</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              四柱排出之後，首先要確認日主，即工具特別標示的那一柱天干，代表命主本身。其餘三柱與日主之間標示的十神，反映命主與財星、官殺、印星、食傷等能量之間的對應關係，是解讀性格傾向與人生模式的起點。每一柱地支下方列出的藏干，連同對應的十神與力量層次，補充地支內部隱藏的訊息，通常本氣的力量最強，中氣次之，餘氣最弱。大運部分，工具會標示目前所處的大運，並附上起運歲數與起運年份，可以了解自己目前處於哪一個十年氣候之中，以及下一個大運轉換的時間點。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">八字排盤常見誤解</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              第一個常見誤解，是以為出生時辰不重要，可以隨便選一個。時柱屬於四柱之一，關係到十神與藏干的完整分佈，時辰不準確，分析結果亦會偏差，如果不確定準確時辰，建議先以「不確定時辰」選項排出年月日三柱，再另行核實時辰。第二個常見誤解，是把單一十神或單一大運看作絕對定論。命理分析從來是整體格局的判斷，一個十神或一步大運只是命局眾多元素之中的一環，不能脫離四柱整體與大運流年的交互作用單獨解讀。第三個常見誤解，是把排盤結果當成命運的最終判決。四柱八字提供的是命主先天的能量結構與傾向，實際人生發展仍然涉及大運流年的引動、環境際遇與個人選擇，排盤本身只是分析的起點，並非結論。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">什麼是真太陽時？為什麼排盤要校正？</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              日常使用的鐘錶時間是按時區標準經線統一的「平均太陽時」，同一個時區內所有城市用同一個時鐘，但太陽實際照到每個城市的時間並不一樣。「真太陽時」把鐘錶時間校正為出生地太陽實際運行的時間，校正由兩部分組成：第一是經度修正，出生地經度與時區標準經線每差一度，太陽到達時間就差四分鐘；第二是均時差，因為地球公轉軌道是橢圓形，一年之中太陽每天的「快慢」不同，均時差可以在負十四分鐘到正十六分鐘之間浮動。以香港（東經 114.17 度）為例，中國標準時間的標準經線是東經 120 度，光是經度修正就約 −23 分鐘，加上當天的均時差，一月出生的人實際太陽時可能比鐘錶時間慢近 40 分鐘。如果出生時間剛好落在時辰交界附近（例如鐘錶時間 01:10，理論上屬丑時，但真太陽時校正後可能退回 00:30 仍屬子時），時柱就會改變，連帶影響十神與藏干分佈。本工具的「進階時間選項」提供真太陽時校正功能，輸入精確出生時分與出生地之後，工具會同時顯示校正前後的時柱供比對。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">八字命盤可以直接交給 AI 分析嗎？</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              AI 適合一事一問的問事類分析，本站的問事工具（<a href="/liuyao" className="text-[#B23E26] hover:underline">六爻排盤</a>、<a href="/qimen" className="text-[#B23E26] hover:underline">奇門遁甲</a>、<a href="/tarot" className="text-[#B23E26] hover:underline">塔羅占卜</a>、<a href="/lenormand" className="text-[#B23E26] hover:underline">雷諾曼占卜</a>）全部附有 AI 資料包功能，可一鍵複製結構化排盤結果，直接貼入 ChatGPT、Claude 或 Gemini 解讀。八字命盤則不同：命盤呈現的是命主完整的先天能量結構，涵蓋格局、十神、藏干與大運交疊，是一盤人生的全貌，而非針對單一事件的判斷，不建議僅靠 AI 解讀，以免遺漏關鍵格局或產生斷章取義的結論。若需深入了解命盤的格局走向，歡迎<a href="/consultation" className="text-[#B23E26] hover:underline">預約人手深度諮詢</a>，由命理師綜合分析。
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

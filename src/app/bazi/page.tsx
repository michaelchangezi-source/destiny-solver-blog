import BaziCalculator from './BaziCalculator'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'
import { getArticlesByElement, getArticlesByCategory } from '@/lib/articles'
import type { ArticleMeta } from '@/types'

export const metadata = buildMetadata({
  title: '免費八字排盤｜四柱大運速算',
  description: '免費八字排盤工具，即時算出四柱命盤、十神、藏干及大運。排好盤可一鍵生成結構化資料包，交給 ChatGPT、Claude、Gemini 深度解讀。香港命運解決師陳卓賢出品，無需註冊。',
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
    q: '這個工具需要付費嗎？',
    a: '不需要，八字速算是完全免費的線上工具，即時排出四柱與十個大運，無需註冊或安裝。',
  },
  {
    q: '如何把排好的八字命盤交給 ChatGPT 或 Claude 分析？',
    a: '排盤完成後，命盤下方有「交給 AI 解讀」面板。選好分析方向（命格全覽、感情、事業、流年等），按「複製 Prompt＋資料包」，再開 ChatGPT、Claude 或 Gemini，貼上即可。資料包已包含四柱、十神、藏干、大運及流年引動，AI 可直接對應盤面作答。',
  },
  {
    q: '把八字資料交給 AI 分析安全嗎？',
    a: '資料包只包含出生年月日時、性別及命盤結構，不含姓名或聯絡資料。資料是由你手動複製貼到 AI 平台，本站不會傳送任何資料到第三方。建議只貼給你信任的 AI 服務，如有私隱顧慮可使用 AI 平台的私人對話模式。',
  },
  {
    q: 'AI 分析八字的結果準確嗎？',
    a: 'AI 的分析質素取決於命盤資料的準確性與你提出的問題方向。本工具提供的資料包採用天文精算節氣與標準子平計算，確保排盤數據正確。AI 會依據提供的干支、十神與大運資料作推論，但無法代替有師承根據的深度批命；分析結果供參考，不構成專業命理意見。',
  },
]

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '免費八字排盤 — 命運解決師',
  alternateName: '八字速算',
  url: `${SITE_URL}/bazi`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description:
    '香港免費八字排盤工具，輸入出生年月日時即時算出四柱命盤、日主、十神、藏干及十個大運起運歲數，無需註冊。',
  featureList: ['四柱排盤', '日主與十神計算', '藏干顯示（本氣中氣餘氣）', '大運起運歲數', '目前所處大運標示', '天文精算節氣', '一鍵生成 AI 命盤資料包', '支援 ChatGPT／Claude／Gemini 深度解讀'],
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
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">如何把八字命盤交給 ChatGPT 分析？</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed mb-3">
              排盤完成後，命盤下方的「交給 AI 解讀」面板會自動生成一份結構化命盤資料包，包含四柱天干地支、十神、藏干、月令狀態、通根、五行計數、原局干支互動、大運及流年引動等資訊，總字數控制在 AI 上下文視窗的合理範圍內。
            </p>
            <p className="text-[#5A5247] text-sm leading-relaxed mb-3">
              使用步驟：一、選擇分析方向（命格全覽、感情與婚姻、事業與財運、流年運程或自由提問）；二、按「複製 Prompt＋資料包」；三、開啟 ChatGPT、Claude 或 Gemini，直接貼上，AI 即可根據你的命盤結構作答。
            </p>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              資料包隨分析深度分為完整包（約 5,000 字，含神煞與延伸閱讀）與基礎包（約 2,800 字），可按需切換。所有計算在本地瀏覽器完成，本站不會將任何命盤資料傳送到第三方伺服器。
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

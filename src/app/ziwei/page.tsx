import ZiweiCalculator from './ZiweiCalculator'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '免費紫微斗數排盤｜飛星派命盤速算',
  description: '免費紫微斗數排盤工具（飛星派），輸入農曆生日即時排出十二宮命盤、主星強度、生年四化及大限。排好盤可一鍵生成 AI 解讀資料包，交給 ChatGPT、Claude 或 Gemini 深度分析。香港命運解決師出品，無需註冊。',
  path: '/ziwei',
})

const faq = [
  {
    q: '紫微斗數排盤需要農曆生日嗎？',
    a: '是的，紫微斗數以農曆生年月日及時辰為基礎，時辰影響命宮位置及整張命盤的宮位分佈。如果只知道陽曆生日，工具支援自動換算農曆，但閏月年份建議核實後以農曆直接輸入。',
  },
  {
    q: '甚麼是五行局？',
    a: '五行局是紫微斗數獨有的概念，依命宮天干地支的納音五行定出水二局、木三局、金四局、土五局或火六局，決定大限起運的歲數及紫微星的落宮位置。',
  },
  {
    q: '甚麼是飛星派？',
    a: '飛星派是紫微斗數中以宮干四化為核心的一個流派，強調「飛化」——每個宮位的天干（宮干）會化祿、化權、化科、化忌飛入其他宮位，形成宮位之間的能量流動，是分析感情、財富、事業的重要方法。',
  },
  {
    q: '廟旺利平陷是甚麼意思？',
    a: '廟旺利平陷是紫微斗數評估主星在各宮強弱的標準。廟（最強）、旺（較強）、利（中等）、平（較弱）、陷（最弱），影響該星曜在命盤中發揮作用的力度。',
  },
  {
    q: '大限如何計算？',
    a: '大限依五行局決定起運歲數（水二局從2歲、木三局從3歲……），每個大限管十年，男命陽年及女命陰年順布，男命陰年及女命陽年逆布。工具會標示現行大限及各大限的對應宮位與主星。',
  },
  {
    q: '這個工具免費嗎？',
    a: '完全免費，無需註冊，所有計算在瀏覽器本地完成，本站不會儲存或傳送任何生日資料。',
  },
]

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '免費紫微斗數排盤 — 命運解決師',
  url: `${SITE_URL}/ziwei`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description: '香港免費紫微斗數排盤工具（飛星派），輸入農曆生日即時排出十二宮命盤及一鍵生成 AI 解讀資料包。',
  featureList: ['十二宮命盤', '主星廟旺利平陷', '生年四化', '宮干四化飛星', '大限排列', 'AI 解讀資料包'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HKD' },
  author: { '@type': 'Person', name: '陳卓賢', url: `${SITE_URL}/about` },
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
    { '@type': 'ListItem', position: 2, name: '紫微斗數排盤', item: `${SITE_URL}/ziwei` },
  ],
}

export default function ZiweiPage() {
  return (
    <main className="pt-24 pb-20 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <p className="text-[#B23E26]/60 text-[10px] tracking-[0.3em] uppercase">Free Tool</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#B23E26] tracking-wider">
            免費紫微斗數排盤
          </h1>
          <p className="text-[#6B6155] text-sm">輸入農曆生日，即時排出飛星派十二宮命盤、四化及大限</p>
        </div>

        <ZiweiCalculator />

        {/* 說明文字 */}
        <div className="max-w-3xl mx-auto mt-16 space-y-10">
          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">紫微斗數排盤計算甚麼</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              輸入農曆生年、月、日及時辰，系統會依五行局定出紫微星落宮，再逐一計算十二宮的主星分佈。每個宮位配有廟旺利平陷強度評估，反映各星在該宮的力量強弱。生年四化（化祿、化權、化科、化忌）由出生年的天干決定，是命盤中最重要的格局因素之一。宮干四化屬飛星派核心，每個宮位的天干（宮干）各自再飛出祿權科忌，形成宮位之間複雜的能量流動。大限依五行局與性別陰陽決定順逆，每步大限管十年，與流年合參可分析各階段的運勢起伏。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">飛星派宮干四化如何使用</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              點擊命盤任何一個宮格，下方會顯示該宮的宮干四化飛向——即此宮天干所化的祿、權、科、忌各自飛入哪個宮位。例如命宮宮干飛祿入財帛，代表主動追求財富；命宮宮干飛忌入疾厄，則需留意健康或工作壓力。宮干四化是飛星派分析感情、事業、財運的主要工具，亦可追蹤連串飛化形成的宮位鏈，了解能量最終落在何處。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">如何把紫微命盤交給 AI 分析</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              排盤完成後，命盤下方的「交給 AI 解讀」面板會生成一份結構化資料包，包含十二宮主星、輔星、生年四化落宮、宮干四化飛向及大限資料。選好分析方向（命格全覽、宮位深度、大限流年或自由提問），按「複製 Prompt＋資料包」，貼上 ChatGPT、Claude 或 Gemini，AI 即可根據命盤內容作答。所有計算在本地瀏覽器完成，本站不會傳送任何資料到第三方伺服器。
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

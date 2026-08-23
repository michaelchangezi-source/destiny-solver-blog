import LenormandTool from './LenormandTool'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '免費雷諾曼占卜｜36 張線上抽牌問事',
  description: '免費線上雷諾曼占卜：36 張 Petit Lenormand，六種牌陣（每日一張、三張、五張、九宮格、二選一、大藍圖），可線上抽牌或錄入實體牌，一鍵複製 AI 解讀資料包貼去 ChatGPT／Claude／Gemini 深入分析。免費占卜，免登入、免安裝。',
  path: '/lenormand',
})

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '免費雷諾曼占卜｜命運解決師 陳卓賢',
  url: `${SITE_URL}/lenormand`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description: '免費線上雷諾曼占卜：36 張 Petit Lenormand，六種牌陣（每日一張、三張、五張、九宮格、二選一、大藍圖），可線上抽牌或錄入實體牌，一鍵複製 AI 解讀資料包貼去 ChatGPT／Claude／Gemini 深入分析。免費占卜，免登入、免安裝。',
  featureList: ['Petit Lenormand 36 張', '六種牌陣（每日一張至大藍圖）', '線上加密隨機抽牌', '實體牌手動錄入', '大藍圖 9×4 宮位排列', '指示牌選擇', 'AI 解讀資料包複製', 'Permalink 重現此局'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HKD' },
  author: { '@type': 'Person', name: '陳卓賢', url: `${SITE_URL}/about` },
}

const faq = [
  { q: '雷諾曼有沒有逆位？', a: '傳統雷諾曼不使用逆位，本工具全部以正位論，牌的色彩由組合與脈絡決定。' },
  { q: '本人有實體牌，是否可以使用？', a: '可以。選擇「錄入實體抽牌」，按抽出的先後順序逐張點選，工具將按您的結果排陣並生成資料包（大藍圖除外）。' },
  { q: '大藍圖是什麼？', a: '大藍圖（Grand Tableau）是雷諾曼最完整的讀法：36 張牌全部鋪開，9 列 4 行，由指示牌（代表問卜人的牌）的位置、周圍的牌及宮位對應讀出全局。適合全面審視一段時期運勢時使用。' },
  { q: '什麼是指示牌？', a: '指示牌（Significator）是代表問卜人的牌，傳統上男性用男人（28）、女性用女人（29），亦可自行選擇。大藍圖將以指示牌位置作為解讀中心。' },
  { q: '如何提問才有效？', a: '一次聚焦一件事，開放式問題比是非題更有層次：與其問「我應否辭職」，不如問「若繼續留下，接下來將如何發展」。問題越具體，連讀越貼身。' },
  { q: '此工具需要付費嗎？', a: '不需要。雷諾曼占卜與 AI 資料包全部免費，免登入、免安裝。' },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: '如何用雷諾曼牌搭配 AI 解讀',
  description: '在命運解決師平台抽雷諾曼牌，再複製資料包給 ChatGPT、Claude 或 Gemini 進行組合連讀，全程免費、免登入。',
  step: [
    { '@type': 'HowToStep', position: 1, name: '選擇牌陣', text: '從每日一張、三張連讀、五張連讀、九宮格、二選一、大藍圖六種牌陣中選擇一種；大藍圖需選擇指示牌。' },
    { '@type': 'HowToStep', position: 2, name: '抽牌或錄入實體牌', text: '點擊「線上抽牌」讓工具隨機抽出，或選擇「錄入實體抽牌」按抽出順序逐張點選。' },
    { '@type': 'HowToStep', position: 3, name: '複製 AI 解讀資料包', text: '抽牌完成後點擊「複製資料包」，資料包列明牌陣結構、每個位置的意義及各牌傳統關鍵詞，並指明 AI 須組合連讀。' },
    { '@type': 'HowToStep', position: 4, name: '貼至 AI 獲得解讀', text: '將資料包貼至 ChatGPT、Claude 或 Gemini，AI 會按雷諾曼組合連讀邏輯解析，而非逐張獨立交代。' },
  ],
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '雷諾曼占卜', item: `${SITE_URL}/lenormand` },
  ],
}

export default function LenormandPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <LenormandTool />
      <section className="max-w-3xl mx-auto px-4 mt-16 pb-20 space-y-10">
        <div>
          <h2 className="text-[#2B241C] text-xl font-bold mb-4">雷諾曼占卜怎麼看</h2>
          <p className="text-[#5A5247] text-sm leading-relaxed">
            雷諾曼（Lenormand）是一套 36 張的占卜牌系統，源自 19 世紀歐洲，以具體的日常圖像（騎士、房屋、樹木、花束等）組合連讀，而非塔羅的心理原型敍事。雷諾曼的核心讀法是「組合」：兩張或以上的牌放在一起，意義由圖像之間的連結決定，而非逐張獨立解讀。本工具提供六種牌陣，從每日單張快速提示到大藍圖 36 張全局覽視，適合問日常具體事務，如感情進展、工作安排、居住搬遷等。抽牌後複製 AI 資料包，貼至 ChatGPT、Claude 或 Gemini，AI 會按雷諾曼組合連讀邏輯解析，全程免費免登入。
          </p>
        </div>
        <div>
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
        </div>
      </section>
    </>
  )
}

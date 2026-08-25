import TarotTool from './TarotTool'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '免費塔羅牌占卜｜78 張正逆位牌陣',
  description: '免費線上塔羅占卜：78 張韋特塔羅、正逆位、五種牌陣（單張、三張、愛情、二擇一、凱爾特十字），可線上抽牌或錄入實體牌，一鍵複製 AI 解讀資料包貼去 ChatGPT／Claude／Gemini。免登入。',
  path: '/tarot',
})

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '免費塔羅占卜｜命運解決師 陳卓賢',
  url: `${SITE_URL}/tarot`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description: '免費線上塔羅占卜：78 張韋特塔羅、正逆位、五種牌陣（單張、三張、愛情、二擇一、凱爾特十字），可線上抽牌或錄入實體牌，一鍵複製 AI 解讀資料包貼去 ChatGPT／Claude／Gemini。免登入。',
  featureList: ['韋特塔羅 78 張', '正逆位可開關', '五種牌陣（單張至凱爾特十字）', '線上加密隨機抽牌', '實體牌手動錄入', '逐張切換正逆位', 'AI 解讀資料包複製', 'Permalink 重現此局'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HKD' },
  author: { '@type': 'Person', name: '陳卓賢', url: `${SITE_URL}/about` },
}

const faq = [
  { q: '塔羅與雷諾曼有何分別？', a: '塔羅著重原型與心理歷程，適合探索「如何面對此事」；雷諾曼著重具體事象與組合連讀，適合詢問日常實事。兩套系統讀法各異，本站兩個工具均備。' },
  { q: '本人有實體塔羅牌，是否可以使用？', a: '可以。選擇「錄入實體抽牌」，按抽出先後逐張點選，再於名單中切換正逆位，工具將按您的結果排陣並生成資料包。' },
  { q: '凱爾特十字是什麼？', a: '凱爾特十字（Celtic Cross）是最經典的十張牌陣：現況、挑戰、根源、過去、目標、未來、自身態度、外在環境、希望與恐懼、可能結果，適合全面審視一件事時使用。' },
  { q: '一定要使用逆位嗎？', a: '不一定。逆位增加細節，同時亦增加複雜度，初學者可於抽牌前關閉「使用逆位」，全部以正位論。' },
  { q: '將資料包貼給 AI 之後，AI 會否隨意恐嚇？', a: '資料包附有使用規則：不得恐嚇、不得斷言生死、牌面反映的是當下能量而非命定，每個判斷須標明牌面依據。若 AI 輸出的牌與資料包不一致，以資料包為準。' },
  { q: '此工具需要付費嗎？', a: '不需要。塔羅占卜與 AI 資料包全部免費，免登入、免安裝。' },
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
  name: '如何用塔羅牌搭配 AI 解讀',
  description: '在命運解決師平台抽塔羅牌，再複製資料包給 ChatGPT、Claude 或 Gemini 深入解讀，全程免費、免登入。',
  step: [
    { '@type': 'HowToStep', position: 1, name: '選擇牌陣', text: '從單張指引、三張時間線、愛情牌陣、二擇一、凱爾特十字五種牌陣中選擇一種，並決定是否啟用逆位。' },
    { '@type': 'HowToStep', position: 2, name: '抽牌或錄入實體牌', text: '點擊「線上抽牌」讓工具以加密隨機數洗牌，或選擇「錄入實體抽牌」按自己抽出的順序點選各牌並切換正逆位。' },
    { '@type': 'HowToStep', position: 3, name: '複製 AI 解讀資料包', text: '抽牌完成後，選擇解讀方向，點擊「複製資料包」，資料包包含牌陣結構、各位置意義、每張牌的正逆位與關鍵詞，以及 AI 使用規則。' },
    { '@type': 'HowToStep', position: 4, name: '貼至 AI 獲得解讀', text: '將資料包貼至 ChatGPT、Claude 或 Gemini，AI 會按位置連讀成故事，不會逐張獨立交代，亦不會隨意恐嚇。' },
  ],
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '塔羅占卜', item: `${SITE_URL}/tarot` },
  ],
}

export default function TarotPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <TarotTool />
      <section className="max-w-3xl mx-auto px-4 mt-16 pb-20 space-y-10">
        <div>
          <h2 className="text-[#2B241C] text-xl font-bold mb-4">塔羅牌占卜怎麼玩</h2>
          <p className="text-[#5A5247] text-sm leading-relaxed">
            塔羅牌是一套 78 張圖像系統，分為大阿爾克納（22 張原型牌）與小阿爾克納（56 張日常情境牌）。使用時先確立一個具體的問題或處境，選擇適合的牌陣，洗牌後依序翻出對應位置的牌。每個位置有其意義，牌與位置的結合便是解讀的起點。正位代表牌義的直接顯現，逆位（倒轉）則往往指向能量受阻或需要內化的一面。本工具提供五種牌陣，從單張快問快答到凱爾特十字十牌全局，適合不同深度的提問需求，亦可直接使用實體牌錄入結果，配合 AI 資料包深入解讀。
          </p>
          <p className="text-[#5A5247] text-sm leading-relaxed mt-3">
            想比較坊間工具？<a href="/tools-guide" className="text-[#B23E26] hover:underline">睇 2026 免費排盤工具合集 →</a>
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

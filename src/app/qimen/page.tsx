import QimenTool from './QimenTool'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '免費奇門遁甲占卜排盤｜線上起局問事',
  description: '免費奇門遁甲占卜排盤工具，轉盤時家拆補定局，一鍵排出陰陽遁局數、值符值使、九宮天地盤門星神，並一鍵複製 AI 解讀資料包貼去 ChatGPT／Claude／Gemini 深入分析。奇門遁甲占卜免費，免登入、免安裝。',
  path: '/qimen',
})

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '免費奇門遁甲占卜排盤｜命運解決師 陳卓賢',
  url: `${SITE_URL}/qimen`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description: '免費奇門遁甲占卜排盤工具，轉盤時家拆補定局，一鍵排出陰陽遁局數、值符值使、九宮天地盤門星神，並一鍵複製 AI 解讀資料包貼去 ChatGPT／Claude／Gemini 深入分析。奇門遁甲占卜免費，免登入、免安裝。',
  featureList: ['轉盤時家奇門', '拆補定局', '陰陽遁判斷', '值符值使落宮', '九宮天地盤門星神', '空馬刑墓迫標記', '選填年命參照', 'AI 解讀資料包複製', 'Permalink 重現此局'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HKD' },
  author: { '@type': 'Person', name: '陳卓賢', url: `${SITE_URL}/about` },
}

const faq = [
  { q: '奇門遁甲需要輸入出生時間嗎？', a: '不需要。奇門以起局時刻定盤，不需要出生資料；若希望在盤中對照自身，可選填出生年作為年命參照。' },
  { q: '什麼是值符值使？', a: '值符是當旬旬首所配之九星，代表事情的主氣所在；值使是同宮的八門，多與人事及行動相關。工具將列明兩者所落之宮位。' },
  { q: '拆補定局是什麼？', a: '拆補以起局日的符頭（最近的甲日或己日）地支定上中下元：子午卯酉為上元、寅申巳亥為中元、辰戌丑未為下元，再按節氣查局數。本工具固定使用拆補，並於資料包中說明。' },
  { q: '為何中五宮沒有門星神？', a: '轉盤奇門中五宮不安門星神，寄於坤二宮；天禽星寄天芮。工具在中宮及資料包中均會標明「寄坤二宮」。' },
  { q: '將資料包貼給 AI 之後，AI 會否隨意補充？', a: '資料包附有使用規則：以資料包為唯一盤面事實、不得改局重排、未列出的層級須直接說明。實測主流模型均會遵從；若 AI 輸出的盤面與資料包不一致，以資料包為準。' },
  { q: '此工具需要付費嗎？', a: '不需要。奇門排盤與 AI 資料包全部免費，免登入、免安裝。' },
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
  name: '如何用奇門遁甲排盤搭配 AI 分析',
  description: '輸入起局時刻，由本工具自動排出奇門九宮盤，再複製資料包給 ChatGPT、Claude 或 Gemini 解讀，不需出生時間，全程免費。',
  step: [
    { '@type': 'HowToStep', position: 1, name: '輸入起局時刻', text: '在「起局」面板輸入您起念或起事的日期與時辰；如需對照自身可選填出生年。' },
    { '@type': 'HowToStep', position: 2, name: '確認九宮盤', text: '工具自動計算陰陽遁局數、拆補三元、值符值使落宮，並排出九宮天地盤、門星神及各類標記。' },
    { '@type': 'HowToStep', position: 3, name: '複製 AI 解讀資料包', text: '在「交給 AI 解讀」面板點擊複製，資料包包含完整盤面結構、排盤口徑說明及 AI 使用規則。' },
    { '@type': 'HowToStep', position: 4, name: '貼至 AI 獲得解讀', text: '將資料包貼至 ChatGPT、Claude 或 Gemini，AI 會以資料包為唯一盤面事實，不得改局重排，缺少的層級會如實說明。' },
  ],
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '奇門遁甲排盤', item: `${SITE_URL}/qimen` },
  ],
}

export default function QimenPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <QimenTool />
      <section className="max-w-3xl mx-auto px-4 mt-16 pb-20 space-y-10">
        <div>
          <h2 className="text-[#2B241C] text-xl font-bold mb-4">奇門遁甲是什麼</h2>
          <p className="text-[#5A5247] text-sm leading-relaxed">
            奇門遁甲是中國古代術數之一，以時間為軸，將九宮格與天干地支、八門（休生傷杜景死驚開）、九星（天蓬天芮天沖天輔天禽天心天柱天任天英）、九神（值符騰蛇太陰六合白虎玄武九地九天）組合成一個立體的時空分析系統。起局不需要出生資料，只需要起局時刻，由工具自動計算局數、陰陽遁、拆補三元，排出九宮盤面。奇門主要用於判斷當下局勢與行動方向，適合問一件具體的事在此刻的走向、機會方位與行動時機，而非長期命盤分析。排出盤後，複製 AI 解讀資料包，貼至 ChatGPT、Claude 或 Gemini 獲得深度解析。
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

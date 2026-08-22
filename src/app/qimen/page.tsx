import QimenTool from './QimenTool'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '免費奇門遁甲排盤｜轉盤時家一鍵起局',
  description: '免費奇門遁甲排盤：轉盤時家、拆補定局、中五寄坤，一鍵排出陰陽遁局數、值符值使、九宮天地盤門星神，並生成可複製給 ChatGPT／Claude／Gemini 的 AI 解讀資料包。免登入、免安裝。',
  path: '/qimen',
})

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '免費奇門遁甲排盤｜命運解決師 陳卓賢',
  url: `${SITE_URL}/qimen`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description: '免費奇門遁甲排盤：轉盤時家、拆補定局、中五寄坤，一鍵排出陰陽遁局數、值符值使、九宮天地盤門星神，並生成可複製給 ChatGPT／Claude／Gemini 的 AI 解讀資料包。免登入、免安裝。',
  featureList: ['轉盤時家奇門', '拆補定局', '陰陽遁判斷', '值符值使落宮', '九宮天地盤門星神', '空馬刑墓迫標記', '選填年命參照', 'AI 解讀資料包複製', 'Permalink 重現此局'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HKD' },
  author: { '@type': 'Person', name: '陳卓賢', url: `${SITE_URL}/about` },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Q1　奇門遁甲需要輸入出生時間嗎？',
      acceptedAnswer: { '@type': 'Answer', text: '不需要。奇門以起局時刻定盤，不需要出生資料；若希望在盤中對照自身，可選填出生年作為年命參照。' },
    },
    {
      '@type': 'Question',
      name: 'Q2　什麼是值符值使？',
      acceptedAnswer: { '@type': 'Answer', text: '值符是當旬旬首所配之九星，代表事情的主氣所在；值使是同宮的八門，多與人事及行動相關。工具將列明兩者所落之宮位。' },
    },
    {
      '@type': 'Question',
      name: 'Q3　拆補定局是什麼？',
      acceptedAnswer: { '@type': 'Answer', text: '拆補以起局日的符頭（最近的甲日或己日）地支定上中下元：子午卯酉為上元、寅申巳亥為中元、辰戌丑未為下元，再按節氣查局數。本工具固定使用拆補，並於資料包中說明。' },
    },
    {
      '@type': 'Question',
      name: 'Q4　為何中五宮沒有門星神？',
      acceptedAnswer: { '@type': 'Answer', text: '轉盤奇門中五宮不安門星神，寄於坤二宮；天禽星寄天芮。工具在中宮及資料包中均會標明「寄坤二宮」。' },
    },
    {
      '@type': 'Question',
      name: 'Q5　將資料包貼給 AI 之後，AI 會否隨意補充？',
      acceptedAnswer: { '@type': 'Answer', text: '資料包附有使用規則：以資料包為唯一盤面事實、不得改局重排、未列出的層級須直接說明。實測主流模型均會遵從；若 AI 輸出的盤面與資料包不一致，以資料包為準。' },
    },
    {
      '@type': 'Question',
      name: 'Q6　此工具需要付費嗎？',
      acceptedAnswer: { '@type': 'Answer', text: '不需要。奇門排盤與 AI 資料包全部免費，免登入、免安裝。' },
    },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <QimenTool />
    </>
  )
}

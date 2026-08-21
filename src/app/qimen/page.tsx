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
      name: 'Q1　奇門遁甲要唔要輸入出生時間？',
      acceptedAnswer: { '@type': 'Answer', text: '唔需要。奇門以起局時刻定盤，唔使出生資料；如果想喺盤中對照自己，可以選填出生年做年命參照。' },
    },
    {
      '@type': 'Question',
      name: 'Q2　乜嘢係值符值使？',
      acceptedAnswer: { '@type': 'Answer', text: '值符係當旬旬首所帶嘅九星，代表事情嘅主氣所在；值使係同宮嘅八門，多與人事同行動相關。工具會列明兩者落喺邊一宮。' },
    },
    {
      '@type': 'Question',
      name: 'Q3　拆補定局係乜？',
      acceptedAnswer: { '@type': 'Answer', text: '拆補以起局日嘅符頭（最近嘅甲日或己日）地支定上中下元：子午卯酉為上元、寅申巳亥為中元、辰戌丑未為下元，再按節氣查局數。本工具固定用拆補，並喺資料包寫明。' },
    },
    {
      '@type': 'Question',
      name: 'Q4　點解中五宮無門星神？',
      acceptedAnswer: { '@type': 'Answer', text: '轉盤奇門中五宮唔安門星神，寄於坤二宮；天禽星寄天芮。工具喺中宮同資料包都會標明「寄坤二宮」。' },
    },
    {
      '@type': 'Question',
      name: 'Q5　資料包貼畀 AI 之後，AI 會唔會亂補嘢？',
      acceptedAnswer: { '@type': 'Answer', text: '資料包附有使用規則：以資料包為唯一盤面事實、唔准改局重排、未列出嘅層級要直接講明。實測主流模型會照跟；如果 AI 輸出嘅盤面同資料包唔一致，以資料包為準。' },
    },
    {
      '@type': 'Question',
      name: 'Q6　呢個工具需要付費嗎？',
      acceptedAnswer: { '@type': 'Answer', text: '唔需要。奇門排盤同 AI 資料包全部免費，免登入免安裝。' },
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

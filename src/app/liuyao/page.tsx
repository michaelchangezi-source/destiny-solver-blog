import LiuyaoTool from './LiuyaoTool'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '免費六爻排盤｜三錢起卦京房納甲',
  description: '免費六爻排盤：親手搖卦錄入或線上起卦，即時排出本卦變卦、納甲六親、六獸世應、旬空月破伏神，並生成可複製給 ChatGPT／Claude／Gemini 的 AI 解讀資料包。免登入、免安裝。',
  path: '/liuyao',
})

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '免費六爻排盤｜命運解決師 陳卓賢',
  url: `${SITE_URL}/liuyao`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description: '免費六爻排盤：親手搖卦錄入或線上起卦，即時排出本卦變卦、納甲六親、六獸世應、旬空月破伏神，並生成可複製給 ChatGPT／Claude／Gemini 的 AI 解讀資料包。免登入、免安裝。',
  featureList: ['古法三錢起卦', '線上模擬搖卦', '本卦變卦自動裝卦', '納甲六親六獸', '世應旬空月破伏神標記', '伏神自動搵出', 'AI 解讀資料包複製', 'Permalink 重現卦象'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HKD' },
  author: { '@type': 'Person', name: '陳卓賢', url: `${SITE_URL}/about` },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Q1　六爻需要輸入出生時間嗎？',
      acceptedAnswer: { '@type': 'Answer', text: '不需要。六爻以起卦時刻與卦象為準，不需要任何出生資料，所問之事方為主角。' },
    },
    {
      '@type': 'Question',
      name: 'Q2　本人未曾搖過卦，如何入門？',
      acceptedAnswer: { '@type': 'Answer', text: '準備三枚相同的硬幣，心中默想一事，雙手覆著硬幣搖勻後擲於桌上，記錄背面的數量；重複六次，按先後次序由初爻錄至上爻。不便使用硬幣者，可使用「線上模擬搖卦」。' },
    },
    {
      '@type': 'Question',
      name: 'Q3　什麼是世應？',
      acceptedAnswer: { '@type': 'Answer', text: '世爻代表自身（問事人），應爻代表對方或所問之事的另一方。工具按京房八宮構造法自動標出世應位置。' },
    },
    {
      '@type': 'Question',
      name: 'Q4　什麼是伏神？',
      acceptedAnswer: { '@type': 'Answer', text: '當卦中六親不齊（例如問財但卦中無財爻），須至本宮首卦找回所缺的六親，稱為伏神。資料包將列明伏神干支、伏於哪一爻之下、飛神為何。' },
    },
    {
      '@type': 'Question',
      name: 'Q5　將資料包貼給 AI 之後，AI 會否隨意補充？',
      acceptedAnswer: { '@type': 'Answer', text: '資料包附有使用規則：以資料包為唯一卦面事實、不得重新裝卦、未列出的資料須直接說明。若 AI 輸出的卦面與資料包不一致，以資料包為準。' },
    },
    {
      '@type': 'Question',
      name: 'Q6　此工具需要付費嗎？',
      acceptedAnswer: { '@type': 'Answer', text: '不需要。六爻排盤與 AI 資料包全部免費，免登入、免安裝。' },
    },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: '如何用六爻排盤搭配 AI 分析',
  description: '親手搖卦或線上起卦，由本工具排出完整卦象，再複製資料包給 ChatGPT、Claude 或 Gemini 解讀，不需出生時間，全程免費。',
  step: [
    { '@type': 'HowToStep', position: 1, name: '起卦', text: '心中默想一事，以三枚硬幣搖擲六次，記錄每次背面數量，或點擊「線上模擬搖卦」。' },
    { '@type': 'HowToStep', position: 2, name: '錄入爻象', text: '按由初爻至上爻的順序，逐一錄入每次搖出的結果（老陰老陽動爻會自動標記）。' },
    { '@type': 'HowToStep', position: 3, name: '確認卦象並複製資料包', text: '工具自動排出本卦變卦、納甲六親六獸、世應旬空月破伏神。點擊「複製資料包」。' },
    { '@type': 'HowToStep', position: 4, name: '貼至 AI 獲得解讀', text: '將資料包貼至 ChatGPT、Claude 或 Gemini，AI 會以資料包為唯一卦面事實進行解讀，不會重新裝卦或補填未列資料。' },
  ],
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '六爻排盤', item: `${SITE_URL}/liuyao` },
  ],
}

export default function LiuyaoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <LiuyaoTool />
    </>
  )
}

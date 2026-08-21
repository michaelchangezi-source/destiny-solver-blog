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
      name: 'Q1　六爻要唔要輸入出生時間？',
      acceptedAnswer: { '@type': 'Answer', text: '唔需要。六爻以起卦時刻同卦象為準，唔使任何出生資料，所問之事先係主角。' },
    },
    {
      '@type': 'Question',
      name: 'Q2　我未搖過卦，點入手？',
      acceptedAnswer: { '@type': 'Answer', text: '搵三枚一樣嘅硬幣，心入面諗定件事，兩手冚住啲硬幣搖勻擲落枱，記低有幾多個背面；重複六次，按先後次序由初爻錄到上爻。唔方便用硬幣，可以用「線上模擬搖卦」。' },
    },
    {
      '@type': 'Question',
      name: 'Q3　乜嘢係世應？',
      acceptedAnswer: { '@type': 'Answer', text: '世爻代表自己（問事人），應爻代表對方或所問之事嘅另一方。工具按京房八宮構造法自動標出世應位置。' },
    },
    {
      '@type': 'Question',
      name: 'Q4　乜嘢係伏神？',
      acceptedAnswer: { '@type': 'Answer', text: '當卦中六親唔齊（例如問財但卦中無財爻），就要去本宮首卦搵返所缺嘅六親，叫做伏神。資料包會列明伏神干支、伏喺邊一爻之下、飛神係乜。' },
    },
    {
      '@type': 'Question',
      name: 'Q5　資料包貼畀 AI 之後，AI 會唔會亂補嘢？',
      acceptedAnswer: { '@type': 'Answer', text: '資料包附有使用規則：以資料包為唯一卦面事實、唔准重新裝卦、未列出嘅資料要直接講明。如果 AI 輸出嘅卦面同資料包唔一致，以資料包為準。' },
    },
    {
      '@type': 'Question',
      name: 'Q6　呢個工具需要付費嗎？',
      acceptedAnswer: { '@type': 'Answer', text: '唔需要。六爻排盤同 AI 資料包全部免費，免登入免安裝。' },
    },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <LiuyaoTool />
    </>
  )
}

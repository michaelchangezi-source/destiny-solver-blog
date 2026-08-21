import LenormandTool from './LenormandTool'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '免費雷諾曼占卜｜36 張牌陣連讀',
  description: '免費線上雷諾曼占卜：36 張 Petit Lenormand，六種牌陣（每日一張、三張、五張、九宮格、二選一、大藍圖），可線上抽牌或錄入實體牌，一鍵複製 AI 解讀資料包貼去 ChatGPT／Claude／Gemini。免登入。',
  path: '/lenormand',
})

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '免費雷諾曼占卜｜命運解決師 陳卓賢',
  url: `${SITE_URL}/lenormand`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description: '免費線上雷諾曼占卜：36 張 Petit Lenormand，六種牌陣（每日一張、三張、五張、九宮格、二選一、大藍圖），可線上抽牌或錄入實體牌，一鍵複製 AI 解讀資料包貼去 ChatGPT／Claude／Gemini。免登入。',
  featureList: ['Petit Lenormand 36 張', '六種牌陣（每日一張至大藍圖）', '線上加密隨機抽牌', '實體牌手動錄入', '大藍圖 9×4 宮位排列', '指示牌選擇', 'AI 解讀資料包複製', 'Permalink 重現此局'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HKD' },
  author: { '@type': 'Person', name: '陳卓賢', url: `${SITE_URL}/about` },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Q1　雷諾曼有冇逆位？',
      acceptedAnswer: { '@type': 'Answer', text: '傳統雷諾曼唔用逆位，本工具全部以正位論，牌嘅色彩由組合同脈絡決定。' },
    },
    {
      '@type': 'Question',
      name: 'Q2　我有自己副實體牌，可唔可以用？',
      acceptedAnswer: { '@type': 'Answer', text: '可以。揀「錄入實體抽牌」，按你抽出嘅先後順序逐張點選，工具會照你嘅結果排陣同生成資料包（大藍圖除外）。' },
    },
    {
      '@type': 'Question',
      name: 'Q3　大藍圖係乜？',
      acceptedAnswer: { '@type': 'Answer', text: '大藍圖（Grand Tableau）係雷諾曼最完整嘅讀法：36 張牌全部鋪出，9 列 4 行，由指示牌（代表你嘅牌）嘅位置、周圍嘅牌同宮位對應讀出全局。適合想全面睇一段時期運勢嘅時候用。' },
    },
    {
      '@type': 'Question',
      name: 'Q4　乜嘢係指示牌？',
      acceptedAnswer: { '@type': 'Answer', text: '指示牌（Significator）係代表問卜人嘅牌，傳統上男性用男人（28）、女性用女人（29），亦可以自選。大藍圖會以指示牌位置做解讀中心。' },
    },
    {
      '@type': 'Question',
      name: 'Q5　點問先問得好？',
      acceptedAnswer: { '@type': 'Answer', text: '一次聚焦一件事，問開放式問題會比是非題有層次：與其問「我應唔應該辭職」，不如問「如果我留低，接落嚟會點發展」。問題越具體，連讀越貼身。' },
    },
    {
      '@type': 'Question',
      name: 'Q6　呢個工具需要付費嗎？',
      acceptedAnswer: { '@type': 'Answer', text: '唔需要。雷諾曼占卜同 AI 資料包全部免費，免登入免安裝。' },
    },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <LenormandTool />
    </>
  )
}

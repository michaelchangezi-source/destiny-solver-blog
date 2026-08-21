import TarotTool from './TarotTool'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '免費塔羅占卜｜78 張正逆位牌陣',
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

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Q1　塔羅同雷諾曼有咩分別？',
      acceptedAnswer: { '@type': 'Answer', text: '塔羅重原型同心理歷程，適合探索「我點面對呢件事」；雷諾曼重具體事象同組合連讀，適合問日常實事。兩套系統讀法唔同，本站兩個工具都有。' },
    },
    {
      '@type': 'Question',
      name: 'Q2　我有自己副實體塔羅，可唔可以用？',
      acceptedAnswer: { '@type': 'Answer', text: '可以。揀「錄入實體抽牌」，按抽出先後逐張點選，再喺名單度切換正逆位，工具會照你嘅結果排陣同生成資料包。' },
    },
    {
      '@type': 'Question',
      name: 'Q3　凱爾特十字係乜？',
      acceptedAnswer: { '@type': 'Answer', text: '凱爾特十字（Celtic Cross）係最經典嘅十張牌陣：現況、挑戰、根源、過去、目標、未來、自身態度、外在環境、希望與恐懼、可能結果，適合想全面睇一件事嘅時候用。' },
    },
    {
      '@type': 'Question',
      name: 'Q4　一定要用逆位嗎？',
      acceptedAnswer: { '@type': 'Answer', text: '唔一定。逆位增加細節但都增加複雜度，初學者可以喺抽牌前閂咗「使用逆位」，全部以正位論。' },
    },
    {
      '@type': 'Question',
      name: 'Q5　資料包貼畀 AI 之後，AI 會唔會亂咁嚇我？',
      acceptedAnswer: { '@type': 'Answer', text: '資料包附有使用規則：唔准恐嚇、唔准斷生死、牌反映嘅係當下能量唔係命定，每個判斷要標明牌面依據。如果 AI 輸出嘅牌同資料包唔一致，以資料包為準。' },
    },
    {
      '@type': 'Question',
      name: 'Q6　呢個工具需要付費嗎？',
      acceptedAnswer: { '@type': 'Answer', text: '唔需要。塔羅占卜同 AI 資料包全部免費，免登入免安裝。' },
    },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <TarotTool />
    </>
  )
}

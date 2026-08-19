import WesternCalculator from './WesternCalculator'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '免費西洋占星排盤｜本命盤速算',
  description: '免費西洋占星本命盤排盤工具，輸入陽曆生日及出生地，即時計算太陽、月亮、水星等十顆行星的星座位置、上升點及主要相位。排好盤可一鍵生成 AI 解讀資料包，交給 ChatGPT、Claude 或 Gemini 深度分析。香港命運解決師出品，無需註冊。',
  path: '/western',
})

const faq = [
  {
    q: '西洋占星排盤需要準確的出生時間嗎？',
    a: '出生時間主要影響上升點（ASC）和天頂（MC）的計算。太陽、月亮及其他行星的星座位置只需要知道出生日期即可大致確定（月亮每 2.5 天換一個星座，若不知道時間可能有誤差）。如無法確定時間，建議輸入 12:00 作為默認值，並以太陽星座為主要參考。',
  },
  {
    q: '甚麼是上升點（ASC）？',
    a: '上升點（Ascendant）是出生時刻，位於東方地平線上升的黃道星座，代表你呈現給外在世界的面貌、第一印象及身體特徵。上升點與太陽、月亮並列為本命盤最重要的三個位置，合稱「大三元」。',
  },
  {
    q: '四大元素（火土風水）代表甚麼？',
    a: '火象（牡羊、獅子、射手）：熱情主動、充滿活力；土象（金牛、處女、摩羯）：務實穩重、注重物質；風象（雙子、天秤、水瓶）：善於溝通、重視思想；水象（巨蟹、天蠍、雙魚）：感性直覺、情感豐富。五顆內行星（太陽至火星）的元素分佈，反映個人能量的整體傾向。',
  },
  {
    q: '甚麼是行星逆行（℞）？',
    a: '行星逆行是一種視覺現象：從地球角度看，行星似乎在天空中倒退。逆行期間，該行星所代表的能量往往趨於內化、反思或延遲。水星逆行最廣為人知，但金星、火星及外行星逆行同樣具有占星意義。',
  },
  {
    q: '主要相位代表甚麼？',
    a: '相位是兩顆行星之間的角度關係：合相（0°）能量融合、六分相（60°）機遇協作、四分相（90°）張力挑戰、三分相（120°）和諧流暢、對分相（180°）對立整合。相位反映命盤中不同能量如何互動，是占星分析的重要工具。',
  },
  {
    q: '這個工具免費嗎？計算準確嗎？',
    a: '完全免費，無需註冊。行星位置計算基於 Meeus《天文算法》（Astronomical Algorithms）標準天文公式，太陽精度約 0.01°、月亮約 0.5°、行星約 1-2°，對於確定星座位置已完全足夠（行星要移動 30° 才換一個星座）。所有計算在瀏覽器本地完成，本站不會儲存任何出生資料。',
  },
]

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '免費西洋占星排盤 — 命運解決師',
  url: `${SITE_URL}/western`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description: '香港免費西洋占星本命盤排盤工具，輸入陽曆生日及出生地即時計算行星位置、上升點及相位，並一鍵生成 AI 解讀資料包。',
  featureList: ['十顆行星星座位置', '上升點與天頂', '主要相位計算', '元素型態分佈', '逆行狀態標示', 'AI 解讀資料包'],
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
    { '@type': 'ListItem', position: 2, name: '西洋占星排盤', item: `${SITE_URL}/western` },
  ],
}

export default function WesternPage() {
  return (
    <main className="pt-24 pb-20 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <p className="text-[#B23E26]/60 text-[10px] tracking-[0.3em] uppercase">Free Tool</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#B23E26] tracking-wider">
            西洋占星排盤
          </h1>
          <p className="text-[#6B6155] text-sm">輸入陽曆生日及出生地，即時計算本命盤行星位置、上升點及主要相位</p>
        </div>

        <WesternCalculator />

        {/* 說明文字 */}
        <div className="max-w-3xl mx-auto mt-16 space-y-10">
          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">西洋占星本命盤計算甚麼</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              本命盤（Natal Chart）是以出生時刻為基準，記錄天空中各行星在黃道十二星座的位置。工具計算太陽（代表核心自我與人生目的）、月亮（情感本能與內在需求）、水星（思維溝通）、金星（感情與審美）、火星（行動慾望），以及木星、土星、天王星、海王星、冥王星等外行星的星座位置，另附北交點（業力方向）。輸入出生地後，系統進一步計算上升點（ASC）與天頂（MC），完整呈現四個軸點，令命盤分析更精準。主要相位（合、六分、四分、三分、對分）則反映各行星能量如何互動。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">如何把本命盤交給 AI 分析</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              排盤完成後，頁面下方的「交給 AI 解讀」面板會整理一份結構化資料包，涵蓋所有行星位置、上升點、天頂、元素分佈及主要相位。選擇分析方向（命格全覽、感情關係、事業財運或自由提問），按「複製 Prompt＋資料包」，貼入 ChatGPT、Claude 或 Gemini，AI 即可根據本命盤內容進行深度解讀。所有計算在瀏覽器本地完成，資料不會傳送至任何伺服器。
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

import type { Metadata } from 'next'
import CompatCalculator from './CompatCalculator'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: '八字合盤｜干支互動分析',
  description: '輸入兩人出生資料，即時分析雙方四柱的天干五合、地支六合、六沖、六害等干支互動關係。destiny.solver 免費合盤工具。',
  alternates: { canonical: '/compat' },
}

const faq = [
  {
    q: '合盤分析的是什麼？',
    a: '合盤會分別排出雙方的四柱八字，再比對兩人天干地支之間的六種互動關係：天干五合、地支六合、地支三合、地支六沖、地支六害、地支相破，並特別列出雙方日支的對應關係。',
  },
  {
    q: '日支關係為什麼特別重要？',
    a: '日支對應日主自身的宮位，是四柱之中最直接反映兩人日常相處模式的一組對照，所以工具會把日支關係獨立列出，並附上簡短說明。',
  },
  {
    q: '「合」是不是代表適合，「沖」是不是代表不適合？',
    a: '不是。合有聚攏與吸引的一面，亦有羈絆與停滯的一面；沖有張力與衝突的一面，亦有推動變動與釋放的一面，吉凶取決於整體格局，不能單憑合沖二字下判斷。',
  },
  {
    q: '干支互動數量越多，是不是緣分越深？',
    a: '不一定。互動的意義在於類型與位置，尤其是日柱之間的對應，而不是單純比較數量多寡，數量多可以是聚攏，也可以是張力偏多。',
  },
  {
    q: '合盤結果可以判斷這段關係最終好不好嗎？',
    a: '干支互動只是雙方命盤之間眾多對照關係的一部分，完整的緣分判斷仍然需要結合雙方各自的格局、用神與大運流年，合盤工具提供的是初步對照，並非最終結論。',
  },
]

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '八字合盤',
  url: `${SITE_URL}/compat`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description:
    '輸入兩人出生資料，即時分析雙方四柱的天干五合、地支六合、六沖、六害等干支互動關係的免費線上工具。',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HKD' },
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

export default function CompatPage() {
  return (
    <main className="pt-24 pb-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <p className="text-[#B23E26]/60 text-[10px] tracking-[0.3em] uppercase">Free Tool</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#B23E26] tracking-wider">
            八字合盤
          </h1>
          <p className="text-[#6B6155] text-sm">輸入兩人生日，即時分析干支互動關係</p>
        </div>
        <CompatCalculator />

        {/* 工具說明 */}
        <div className="max-w-3xl mx-auto mt-16 space-y-10">
          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">合盤計算什麼</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              輸入雙方的出生年、月、日、時之後，系統會分別排出兩人的四柱八字，再比對雙方天干地支之間的六種互動關係：天干五合、地支六合、地支三合、地支六沖、地支六害、地支相破。天干五合是天干之間兩兩相合的關係，例如甲己合、乙庚合，反映雙方性情上的吸引與牽絆。地支六合是地支兩兩相合，例如子丑合、寅亥合，象徵關係緊密與專注，但過度的合亦可能演變成一種羈絆。地支三合是三個地支聚合成一個新五行局，力量遠勝六合，象徵雙方合作能匯聚成更大的能量場。地支六沖是地支之間相對沖突的關係，例如子午沖、卯酉沖，代表變動與張力。地支六害與地支相破則反映較隱性的耗損與阻滯。工具亦會特別列出雙方的日支關係，因為日支對應日主自身的宮位，是最直接反映兩人相處模式的一組對照。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">如何理解結果</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              合盤結果分為兩部分：雙方命盤與干支互動總覽。雙方命盤並列顯示兩人的四柱，方便直接對照。干支互動總覽首先呈現日支關係，即兩人日柱地支之間的對應，這一組關係最直接反映日常相處的動態；其餘互動則按六種類型分組列出，並標示「合」與「沖害破」的數量對比，合的數量偏多，代表雙方能量傾向聚攏與吸引；沖害破的數量偏多，則代表雙方能量傾向張力與變動。每一組互動旁邊都附有簡短說明，標示這組干支組合具體代表什麼關係。如果日柱地支落在互動之中，工具會特別標示「日柱」，提示這組互動與雙方相處模式關係更直接。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">常見誤解</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              第一個常見誤解，是把「合」等同於好、「沖」等同於壞。合有聚攏與吸引的一面，亦有羈絆與停滯的一面；沖有張力與衝突的一面，亦有推動變動與釋放的一面，吉凶取決於整體格局而非單一互動類型。第二個常見誤解，是以為干支互動數量越多，緣分就越深或越淺。互動的意義在於類型與位置，尤其是日柱之間的對應，而不是單純比較數量多寡。第三個常見誤解，是把合盤結果當成緣分深淺的最終判決。干支互動只是雙方命盤之間眾多對照關係的一部分，完整的緣分判斷仍然需要結合雙方各自的格局、用神與大運流年，合盤工具提供的是初步對照，並非最終結論。
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

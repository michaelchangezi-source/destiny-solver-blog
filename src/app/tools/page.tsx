import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL } from '@/lib/site'

export const metadata = buildMetadata({
  title: '免費算命工具箱｜八字六爻奇門塔羅紫微西洋',
  description: '八個免費命理工具一站齊備：四柱八字、八字合盤、六爻占卜、奇門遁甲、紫微斗數、西洋占星、塔羅占卜、雷諾曼占卜。排準可核對，占卜類工具支援複製 AI 解讀資料包。免登入免安裝。',
  path: '/tools',
})

const faq = [
  {
    q: '全部工具都免費嗎？',
    a: '是，八個工具全部免費，無需付費、無需訂閱。占卜類工具（六爻、奇門、塔羅、雷諾曼）的 AI 解讀資料包複製功能同樣免費。',
  },
  {
    q: '需要登入才能使用嗎？',
    a: '不需要，全部工具免登入即用，排出的結果只在您的裝置上，不會上傳或儲存。',
  },
  {
    q: '排出來的結果可以交給 AI 解讀嗎？',
    a: '占卜類工具（六爻、奇門、塔羅、雷諾曼）設有 AI 解讀資料包，複製後貼去 ChatGPT、Claude 或 Gemini 即可深入分析，是「小事問 AI」的推薦做法。排盤類工具（四柱八字、八字合盤、紫微斗數、西洋占星）涉及成盤人生結構，AI 難以取代人手判斷格局、大運與應期，建議預約深度諮詢。',
  },
  {
    q: '免費算命排盤準嗎？',
    a: '本站排盤工具採用天文精算節氣與傳統算法，四柱八字支援真太陽時校正、天文精算交節時刻，口徑透明可核對。算命的「準」取決於排盤精度加上解讀功力，工具負責前者，後者可配合 AI 解讀資料包或預約人手深度諮詢。',
  },
  {
    q: '排盤跟算命有什麼分別？',
    a: '排盤是把出生資料轉換成命盤結構（四柱、十神、藏干、大運等），相當於「製作地圖」；算命則是根據命盤結構判斷性格傾向、人生節奏與應期，相當於「解讀地圖」。本站工具專注排盤的精度，解讀部分可交由 AI 或命理師處理。',
  },
  {
    q: '手機可以用嗎？',
    a: '可以，全部工具支援手機、平板、桌面電腦，無需安裝任何 app，打開瀏覽器即用。',
  },
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

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '免費命理排盤與占卜工具箱｜命運解決師 陳卓賢',
  description: '八個免費命理工具一站齊備：四柱八字、八字合盤、六爻占卜、奇門遁甲、紫微斗數、西洋占星、塔羅占卜、雷諾曼占卜。占卜類工具支援複製 AI 解讀資料包，免登入、免安裝。',
  url: `${SITE_URL}/tools`,
  numberOfItems: 8,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '四柱八字排盤', url: `${SITE_URL}/bazi`, description: '免費八字排盤工具，即時算出四柱命盤、十神、藏干及大運。' },
    { '@type': 'ListItem', position: 2, name: '八字合婚配對', url: `${SITE_URL}/compat`, description: '免費八字合婚配對工具，輸入兩人生辰即時對照雙方四柱八字的合婚關係。' },
    { '@type': 'ListItem', position: 3, name: '紫微斗數排盤', url: `${SITE_URL}/ziwei`, description: '免費紫微斗數排盤（飛星派），即時排出十二宮命盤、主星強度與大限。' },
    { '@type': 'ListItem', position: 4, name: '西洋占星排盤', url: `${SITE_URL}/western`, description: '免費西洋占星排盤，即時生成本命盤，列出十大行星星座與宮位。' },
    { '@type': 'ListItem', position: 5, name: '六爻占卜排盤', url: `${SITE_URL}/liuyao`, description: '免費六爻占卜排盤，線上起卦問事，附 AI 解讀資料包，可複製給 ChatGPT、Claude 或 Gemini 解讀。' },
    { '@type': 'ListItem', position: 6, name: '奇門遁甲占卜排盤', url: `${SITE_URL}/qimen`, description: '免費奇門遁甲占卜排盤，線上起局問事，附 AI 解讀資料包，可複製給 ChatGPT、Claude 或 Gemini 解讀。' },
    { '@type': 'ListItem', position: 7, name: '塔羅占卜', url: `${SITE_URL}/tarot`, description: '免費線上塔羅占卜，78 張韋特塔羅、五種牌陣，附 AI 解讀資料包。' },
    { '@type': 'ListItem', position: 8, name: '雷諾曼占卜', url: `${SITE_URL}/lenormand`, description: '免費線上雷諾曼占卜，36 張六種牌陣，附 AI 解讀資料包。' },
  ],
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '免費排盤工具箱', item: `${SITE_URL}/tools` },
  ],
}

const PAIPAN_TOOLS = [
  {
    href: '/bazi',
    label: 'Bazi',
    name: '四柱八字',
    char: '命',
    bg: 'bg-[#B23E26]',
    desc: '免費八字排盤工具，即時算出四柱命盤、十神、藏干及大運。支援真太陽時校正、神煞查詢、流年流月時間軸。',
  },
  {
    href: '/compat',
    label: 'Compat',
    name: '八字合婚配對',
    char: '合',
    bg: 'bg-[#7A3A26]',
    desc: '免費八字合婚配對工具，輸入兩人生辰即時對照雙方四柱八字，分析合婚關係與干支互動。',
  },
  {
    href: '/ziwei',
    label: 'Ziwei',
    name: '紫微斗數',
    char: '紫',
    bg: 'bg-[#3D4A6B]',
    desc: '免費紫微斗數排盤（飛星派），輸入農曆生日即時排出十二宮命盤、主星強度、生年四化及大限。',
  },
  {
    href: '/western',
    label: 'Western',
    name: '西洋占星',
    char: '星',
    bg: 'bg-[#2B4A5C]',
    desc: '免費西洋占星排盤，輸入出生資料即時生成本命盤，列出十大行星星座與宮位，並顯示主要相位。',
  },
]

const DIVINATION_TOOLS = [
  {
    href: '/liuyao',
    label: 'Liuyao',
    name: '六爻占卜',
    char: '卦',
    bg: 'bg-[#7A5230]',
    desc: '免費六爻占卜：親手搖卦錄入或線上起卦，即時排出本卦變卦、納甲六親、六獸世應、旬空月破伏神。一鍵複製 AI 解讀資料包。',
  },
  {
    href: '/qimen',
    label: 'Qimen',
    name: '奇門遁甲',
    char: '局',
    bg: 'bg-[#2B4A6B]',
    desc: '免費奇門遁甲排局：轉盤時家、拆補定局，一鍵排出陰陽遁局數、值符值使、九宮天地盤門星神。一鍵複製 AI 解讀資料包。',
  },
  {
    href: '/tarot',
    label: 'Tarot',
    name: '塔羅占卜',
    char: '牌',
    bg: 'bg-[#3D6B5C]',
    desc: '免費線上塔羅占卜：78 張韋特塔羅、正逆位、五種牌陣，可線上抽牌或錄入實體牌，一鍵複製 AI 解讀資料包。',
  },
  {
    href: '/lenormand',
    label: 'Lenormand',
    name: '雷諾曼占卜',
    char: '占',
    bg: 'bg-[#5C3D6B]',
    desc: '免費線上雷諾曼占卜：36 張 Petit Lenormand，六種牌陣，可線上抽牌或錄入實體牌，一鍵複製 AI 解讀資料包。',
  },
]

export default function ToolsPage() {
  return (
    <main className="pt-24 pb-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <p className="text-[#B23E26]/60 text-[10px] tracking-[0.3em] uppercase">Free Tools</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#B23E26] tracking-wider">
            免費命理工具箱
          </h1>
          <p className="text-[#6B6155] text-sm max-w-lg mx-auto">
            八個免費算命排盤與占卜工具，即開即用免登入。排盤精度可核對，占卜類工具附 AI 解讀資料包，複製貼去 ChatGPT 即可問事分析。
          </p>
        </div>

        {/* 排盤類四個工具 */}
        <div className="mb-10">
          <p className="text-[#6B6155] text-[11px] tracking-[0.25em] uppercase mb-4">排盤類 — 命盤結構，適合深度諮詢</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PAIPAN_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group relative flex flex-col rounded-2xl p-6 ${tool.bg} hover:brightness-95 transition-[filter,transform] duration-200 active:scale-[0.98] overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="font-serif font-black text-4xl text-[#FBF7EE] leading-none">{tool.char}</span>
                  <span className="text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full bg-white/15 text-[#FBF7EE]">
                    命盤類
                  </span>
                </div>
                <div>
                  <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.2em] uppercase mb-1">{tool.label}</p>
                  <h2 className="text-[#FBF7EE] font-bold text-base leading-snug mb-2">{tool.name}</h2>
                  <p className="text-[#FBF7EE]/70 text-xs leading-relaxed">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 占卜類四個工具 */}
        <div className="mb-12">
          <p className="text-[#6B6155] text-[11px] tracking-[0.25em] uppercase mb-4">占卜類 — 問事即時，附 AI 解讀資料包</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DIVINATION_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group relative flex flex-col rounded-2xl p-6 ${tool.bg} hover:brightness-95 transition-[filter,transform] duration-200 active:scale-[0.98] overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="font-serif font-black text-4xl text-[#FBF7EE] leading-none">{tool.char}</span>
                  <span className="text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full bg-white/15 text-[#FBF7EE]">
                    AI 資料包
                  </span>
                </div>
                <div>
                  <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.2em] uppercase mb-1">{tool.label}</p>
                  <h2 className="text-[#FBF7EE] font-bold text-base leading-snug mb-2">{tool.name}</h2>
                  <p className="text-[#FBF7EE]/70 text-xs leading-relaxed">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 排盤之後點解讀 */}
        <section className="max-w-3xl mx-auto mb-16 bg-[#FFFFFF] rounded-2xl border border-[#2B241C]/10 p-8">
          <h2 className="text-[#2B241C] text-xl font-bold mb-6">排盤之後點解讀？</h2>
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#B23E26] text-white flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-semibold text-[#2B241C] mb-1">自學入門</p>
                <p className="text-sm text-[#6B6155] leading-relaxed">
                  本站有大量免費文章解釋各術數的基本概念、取象方法與常見誤解。由「什麼是」的入門文開始，配合工具實排，是最省錢的學習路徑。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#B23E26] text-white flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-semibold text-[#2B241C] mb-1">AI 解讀（適合占卜類）</p>
                <p className="text-sm text-[#6B6155] leading-relaxed">
                  六爻、奇門、塔羅、雷諾曼四個占卜工具設有 AI 解讀資料包，複製後貼去 ChatGPT、Claude 或 Gemini，AI 會照結構化資料逐層分析。適合「問一件事」的即時參考。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#B23E26] text-white flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-semibold text-[#2B241C] mb-1">人手深度諮詢（適合排盤類）</p>
                <p className="text-sm text-[#6B6155] leading-relaxed">
                  四柱八字、八字合盤、紫微斗數、西洋占星等命盤涉及格局、大運與應期的立體判斷，AI 難以取代。如想由命盤真正了解自己的能量結構與人生節奏，可以
                  <Link href="/consultation" className="text-[#B23E26] hover:underline ml-0.5">預約一對一深度諮詢 →</Link>
                </p>
              </div>
            </div>
            <p className="text-sm text-[#6B6155] leading-relaxed mt-4">
              想比較坊間工具？<Link href="/tools-guide" className="text-[#B23E26] hover:underline">睇 2026 免費排盤工具合集 →</Link>
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-12">
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
    </main>
  )
}

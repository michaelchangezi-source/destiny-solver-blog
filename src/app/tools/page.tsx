import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL } from '@/lib/site'

export const metadata = buildMetadata({
  title: '免費排盤工具箱｜八字六爻奇門塔羅｜命運解決師 陳卓賢',
  description: '六個免費排盤工具一站齊備：八字四柱、六爻問事、奇門遁甲、紫微斗數、塔羅占卜、雷諾曼占卜。排準可核對，問事類工具支援複製 AI 解讀資料包。免登入免安裝。',
  path: '/tools',
})

const faq = [
  {
    q: '全部工具都免費嗎？',
    a: '是，六個工具全部免費，無需付費、無需訂閱。問事類工具（六爻、奇門、塔羅、雷諾曼）的 AI 解讀資料包複製功能同樣免費。',
  },
  {
    q: '需要登入才能使用嗎？',
    a: '不需要，全部工具免登入即用，排出的結果只在你自己的裝置上，不會上傳或儲存。',
  },
  {
    q: '排出來的結果可以交給 AI 解讀嗎？',
    a: '問事類工具（六爻、奇門、塔羅、雷諾曼）設有 AI 解讀資料包，複製後貼去 ChatGPT、Claude 或 Gemini 即可深入分析，是「小事問 AI」的推薦做法。命盤類工具（八字、紫微斗數）涉及成盤人生結構，AI 難以取代人手判斷格局、大運與應期，建議預約深度諮詢。',
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

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '免費排盤工具箱', item: `${SITE_URL}/tools` },
  ],
}

const TOOLS = [
  {
    href: '/bazi',
    label: 'Bazi',
    name: '八字排盤',
    char: '命',
    bg: 'bg-[#B23E26]',
    desc: '免費八字排盤工具，即時算出四柱命盤、十神、藏干及大運。支援真太陽時校正、神煞查詢、流年流月時間軸。',
    badge: '命盤類',
  },
  {
    href: '/liuyao',
    label: 'Liuyao',
    name: '六爻排盤',
    char: '卦',
    bg: 'bg-[#7A5230]',
    desc: '免費六爻排盤：親手搖卦錄入或線上起卦，即時排出本卦變卦、納甲六親、六獸世應、旬空月破伏神。',
    badge: 'AI 資料包',
  },
  {
    href: '/qimen',
    label: 'Qimen',
    name: '奇門遁甲',
    char: '局',
    bg: 'bg-[#2B4A6B]',
    desc: '免費奇門遁甲排盤：轉盤時家、拆補定局，一鍵排出陰陽遁局數、值符值使、九宮天地盤門星神。',
    badge: 'AI 資料包',
  },
  {
    href: '/ziwei',
    label: 'Ziwei',
    name: '紫微斗數',
    char: '紫',
    bg: 'bg-[#3D4A6B]',
    desc: '免費紫微斗數排盤（飛星派），輸入農曆生日即時排出十二宮命盤、主星強度、生年四化及大限。',
    badge: '命盤類',
  },
  {
    href: '/tarot',
    label: 'Tarot',
    name: '塔羅占卜',
    char: '牌',
    bg: 'bg-[#3D6B5C]',
    desc: '免費線上塔羅占卜：78 張韋特塔羅、正逆位、五種牌陣，可線上抽牌或錄入實體牌，一鍵複製 AI 解讀資料包。',
    badge: 'AI 資料包',
  },
  {
    href: '/lenormand',
    label: 'Lenormand',
    name: '雷諾曼占卜',
    char: '占',
    bg: 'bg-[#5C3D6B]',
    desc: '免費線上雷諾曼占卜：36 張 Petit Lenormand，六種牌陣，可線上抽牌或錄入實體牌，一鍵複製 AI 解讀資料包。',
    badge: 'AI 資料包',
  },
]

export default function ToolsPage() {
  return (
    <main className="pt-24 pb-20 px-4">
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
            免費排盤工具箱
          </h1>
          <p className="text-[#6B6155] text-sm max-w-lg mx-auto">
            排準、可核對、可給 AI 解讀。六個工具免登入即用，問事類工具支援複製資料包貼去 ChatGPT 深入分析。
          </p>
        </div>

        {/* 六個主要工具卡 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group relative flex flex-col rounded-2xl p-6 ${tool.bg} hover:brightness-95 transition-[filter,transform] duration-200 active:scale-[0.98] overflow-hidden`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="font-serif font-black text-4xl text-[#FBF7EE] leading-none">{tool.char}</span>
                <span className="text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full bg-white/15 text-[#FBF7EE]">
                  {tool.badge}
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

        {/* 西洋占星另列 */}
        <div className="mb-12">
          <Link
            href="/western"
            className="flex items-center gap-3 rounded-xl border border-[#2B241C]/10 bg-[#F4EEE1] hover:border-[#B23E26]/30 hover:bg-[#EDE4CE] px-5 py-3.5 transition-colors"
          >
            <span className="font-serif font-black text-xl text-[#2B241C]">星</span>
            <div className="flex-1">
              <span className="font-semibold text-sm text-[#2B241C]">西洋占星排盤</span>
              <span className="ml-2 text-xs text-[#6B6155]">本命盤、行星相位一覽</span>
            </div>
            <span className="text-[#B23E26] text-sm">→</span>
          </Link>
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
                <p className="font-semibold text-[#2B241C] mb-1">AI 解讀（適合問事類）</p>
                <p className="text-sm text-[#6B6155] leading-relaxed">
                  六爻、奇門、塔羅、雷諾曼四個工具設有 AI 解讀資料包，複製後貼去 ChatGPT、Claude 或 Gemini，AI 會照結構化資料逐層分析。適合「問一件事」的即時參考。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#B23E26] text-white flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-semibold text-[#2B241C] mb-1">人手深度諮詢（適合命盤類）</p>
                <p className="text-sm text-[#6B6155] leading-relaxed">
                  八字、紫微等命盤涉及格局、大運與應期的立體判斷，AI 難以取代。如想由命盤真正了解自己的能量結構與人生節奏，可以
                  <Link href="/consultation" className="text-[#B23E26] hover:underline ml-0.5">預約一對一深度諮詢 →</Link>
                </p>
              </div>
            </div>
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

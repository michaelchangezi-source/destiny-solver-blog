import Link from 'next/link'
import { preload } from 'react-dom'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getAllArticles, getLatestArticles, getTopicArticles } from '@/lib/articles'
import { SITE_URL } from '@/lib/site'
import { CRITICAL_FONTS } from '@/lib/font-preload'
import { analyzeDays, ELEMENT_COLOR } from '@/lib/bazi-daily'
import { getSolarTermOnDate } from '@/lib/bazi-calc'
import LatestCard from '@/components/blog/LatestCard'
import InkFlowHero from '@/components/InkFlowHero'
import HomeAnimations from '@/components/HomeAnimations'
import PricingTiers, { CONSULTATION_PRICE } from '@/components/home/PricingTiers'
import SelfQualification from '@/components/home/SelfQualification'
import Commitments from '@/components/home/Commitments'

export const revalidate = 300

// P3-4（2026-08-07 審核）：首頁本身只有 WebSite + Person schema，冇 FAQPage。
// 首頁係品牌詞入口，加 FAQ 係搶 AI Overview／AI 摘要最抵嘅一步。
// q 用完整問法（帶「陳卓賢」全名，供實體識別同同名區分），displayQ 係頁面可見嘅短問法。
// 鐵律：答案必須同頁面可見內容一致，唔可以只寫喺 schema，否則違反 Google 結構化資料規範。
type HomeFaqItem = { q: string; displayQ: string; a: string }
const homeFaq: HomeFaqItem[] = [
  {
    q: '命運解決師（陳卓賢）是誰？',
    displayQ: '命運解決師是誰？',
    a: '陳卓賢是香港的八字命理師，網名「命運解決師（Destiny Solver）」。他曾任職香港財經媒體逾十年，主修經濟統計學，著有七本財經科技著作，其後轉入八字命理，主張命理是認識自己的工具，而不是預測命運的水晶球。',
  },
  {
    q: '八字命理可以看到什麼？',
    displayQ: '八字命理可以看到什麼？',
    a: '八字看到的是一個人的能量結構：性格傾向、天賦所在、精力容易往哪裡流、以及不同階段的環境氣候。它解釋你為何一再遇上同一類處境，而不是替你預告某年某月會發生某件事。',
  },
  {
    q: '「做功、去向、能量交換」三個維度是什麼？',
    displayQ: '「做功、去向、能量交換」是什麼？',
    a: '這是本站解讀命局的三個維度。做功是問命局有沒有在辦事，去向是問這股能量最後流去哪一顆星，能量交換是問付出與收穫之間換到了什麼。三者合起來，可以說明一個命為何有力或無力，而不只是替五行點算數量。',
  },
  {
    q: '這套方法和坊間常說的「身旺身弱」有什麼分別？',
    displayQ: '和坊間「身旺身弱」有什麼分別？',
    a: '身旺身弱把命局化約成一條強弱刻度，容易得出「補某個五行就好」的結論。本站不從強弱入手，而是看命局實際在做什麼功、能量交去哪裡，因此同樣一組八字在不同格局下會有完全不同的解讀。',
  },
  {
    q: '收費諮詢怎樣預約？',
    displayQ: '收費諮詢怎樣預約？',
    a: `一對一深度諮詢每節港幣 ${CONSULTATION_PRICE} 元，可於諮詢頁以 Threads 私訊或電郵預約，提供出生年月日時與所在地即可安排。預約前建議先閱讀諮詢頁的適合與未必適合對照。`,
  },
]

const homeFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/#faq`,
  inLanguage: 'zh-TW',
  mainEntity: homeFaq.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function HomePage() {
  // 首頁 above-the-fold 嘅 serif：hero H1／今日天干／今日能量標題係 900，今日地支係 700。
  // 兩個都要 preload，唔係要等 CSS 解析完先發現要攞（PSI 量到 core-700 排喺關鍵鏈 725ms）。
  // 只喺首頁 preload：其他頁（例如 68 個詞條頁）根本冇 serif 文字，全站 preload 等於白載。
  // 用 react-dom 的 preload 而唔係喺 <head> 寫 <link>，因為 Next 會將 head 內嘅 link 再 hoist 一次，出兩條重複標籤。
  for (const href of CRITICAL_FONTS) {
    preload(href, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  }

  const articles = getAllArticles()
  const latestArticles = getLatestArticles(6)
  const FEATURED_TOPIC_SLUGS = ['topic-03', 'topic-28', 'topic-29', 'topic-01', 'topic-04', 'topic-13', 'topic-32', 'topic-17']
  const allTopics = getTopicArticles()
  const featuredTopics = FEATURED_TOPIC_SLUGS.map(s => allTopics.find(t => t.slug === s)).filter(Boolean)

  // 今日命盤（供 Hero 卡）
  const [today] = analyzeDays(1)
  // 必須轉 HKT 日期再查節氣：Vercel 伺服器在 UTC，new Date() 嘅 getDate() 返回 UTC 日，
  // 但 analyzeDays 用 UTC+8 轉換，兩者需一致，否則 00:00-08:00 HKT 時段會查錯日期
  const _nowHKT = new Date(Date.now() + 8 * 60 * 60 * 1000)
  const solarTerm = getSolarTermOnDate(new Date(Date.UTC(
    _nowHKT.getUTCFullYear(), _nowHKT.getUTCMonth(), _nowHKT.getUTCDate()
  )))

  return (
    <>
      <HomeAnimations />

      {/* ── Hero（淺色底 + 漣漪）── */}
      <InkFlowHero
        today={{
          stem: today.dayPillar.stem,
          branch: today.dayPillar.branch,
          energyTitle: today.energyTitle,
          dateLabel: today.dateLabel,
          weekday: today.weekday,
          accent: ELEMENT_COLOR[today.dayPillar.element],
          yi: today.yi.map((y) => y.item),
          buYi: today.buYi.map((b) => b.item),
          solarTerm,
        }}
      />

      {/* ── Threads（social proof，數字放大做主角）── */}
      <section className="reveal border-y border-[#B23E26]/15 bg-[#F4EEE1] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-center sm:text-left">
            <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden ring-1 ring-[#B23E26]/30">
              <Image src="/images/avatar.png" alt="陳卓賢 @destiny.solver" fill sizes="64px" className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2 flex-wrap">
                <p className="text-[#2B241C] font-bold text-base">命運解決師｜陳卓賢</p>
                <span className="text-[#8A8071]">·</span>
                <p className="text-[#B23E26] font-semibold text-sm">@destiny.solver</p>
              </div>
              <p className="text-[#5A5247] text-sm leading-relaxed max-w-lg">
                每日分享命理洞察、實案分析與五行思考。在 Threads 了解最新動態。
              </p>
            </div>
            <div className="flex-shrink-0 text-center sm:text-right">
              <p className="font-serif text-4xl sm:text-5xl font-black text-[#B23E26] leading-none">100萬+</p>
              <p className="text-[#6B6155] text-xs mt-1 mb-3">每月 Threads 瀏覽量</p>
              <a
                href="https://www.threads.com/@destiny.solver"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-[#2B241C]/20 hover:border-[#B23E26] hover:text-[#B23E26] text-[#2B241C] font-bold text-sm px-6 py-2.5 rounded-lg transition-[color,border-color,transform] duration-200 active:scale-[0.97] whitespace-nowrap"
              >
                在 Threads 跟蹤
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 排盤工具四格（§8）── */}
      <section className="reveal max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-1">FREE TOOLS</p>
          <h2 className="font-serif text-[#2B241C] text-2xl font-bold">排盤工具</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 八字排盤 */}
          <Link href="/bazi" className="group flex flex-col rounded-2xl p-6 sm:p-8 bg-[#B23E26] hover:opacity-90 transition-[opacity,transform] duration-200 active:scale-[0.98]">
            <span className="font-serif font-black text-5xl sm:text-6xl text-[#FBF7EE] leading-none mb-auto">命</span>
            <div className="mt-8">
              <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.25em] uppercase mb-1">Bazi</p>
              <h3 className="text-[#FBF7EE] font-bold text-base sm:text-lg leading-snug">八字排盤</h3>
              <p className="text-[#FBF7EE]/70 text-xs mt-1.5 leading-relaxed hidden sm:block">排出四柱、格局、大運流年</p>
            </div>
          </Link>
          {/* 八字合盤 */}
          <Link href="/compat" className="group flex flex-col rounded-2xl p-6 sm:p-8 bg-[#7A5230] hover:opacity-90 transition-[opacity,transform] duration-200 active:scale-[0.98]">
            <span className="font-serif font-black text-5xl sm:text-6xl text-[#FBF7EE] leading-none mb-auto">合</span>
            <div className="mt-8">
              <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.25em] uppercase mb-1">Compatibility</p>
              <h3 className="text-[#FBF7EE] font-bold text-base sm:text-lg leading-snug">八字合盤</h3>
              <p className="text-[#FBF7EE]/70 text-xs mt-1.5 leading-relaxed hidden sm:block">分析雙方干支合沖刑害</p>
            </div>
          </Link>
          {/* 紫微斗數 */}
          <Link href="/ziwei" className="group flex flex-col rounded-2xl p-6 sm:p-8 bg-[#2B4A6B] hover:opacity-90 transition-[opacity,transform] duration-200 active:scale-[0.98]">
            <span className="font-serif font-black text-5xl sm:text-6xl text-[#FBF7EE] leading-none mb-auto">紫</span>
            <div className="mt-8">
              <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.25em] uppercase mb-1">Zi Wei</p>
              <h3 className="text-[#FBF7EE] font-bold text-base sm:text-lg leading-snug">紫微斗數</h3>
              <p className="text-[#FBF7EE]/70 text-xs mt-1.5 leading-relaxed hidden sm:block">飛星派十二宮命盤及四化</p>
            </div>
          </Link>
          {/* 西洋占星 */}
          <Link href="/western" className="group flex flex-col rounded-2xl p-6 sm:p-8 bg-[#3D6B5C] hover:opacity-90 transition-[opacity,transform] duration-200 active:scale-[0.98]">
            <span className="font-serif font-black text-5xl sm:text-6xl text-[#FBF7EE] leading-none mb-auto">星</span>
            <div className="mt-8">
              <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.25em] uppercase mb-1">Western</p>
              <h3 className="text-[#FBF7EE] font-bold text-base sm:text-lg leading-snug">西洋占星</h3>
              <p className="text-[#FBF7EE]/70 text-xs mt-1.5 leading-relaxed hidden sm:block">行星星座位置、上升點及相位</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── 最新文章 ── */}
      {latestArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="reveal flex items-end justify-between mb-8">
            <div>
              <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-1">LATEST</p>
              <h2 className="font-serif text-[#2B241C] text-2xl font-bold">最新文章</h2>
            </div>
            <Link href="/latest" className="text-[#8A8071] hover:text-[#B23E26] text-sm transition-colors flex items-center gap-1">
              全部最新 <ArrowRight size={13} />
            </Link>
          </div>
          <div className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <LatestCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* ── 系統學八字（精選 topic 教學）── */}
      {featuredTopics.length > 0 && (
        <section className="reveal max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-1">LEARN</p>
              <h2 className="font-serif text-[#2B241C] text-2xl font-bold">系統學八字</h2>
            </div>
            <Link href="/latest#教學" className="text-[#8A8071] hover:text-[#B23E26] text-sm transition-colors flex items-center gap-1">
              全部教學 <ArrowRight size={13} />
            </Link>
          </div>
          <div className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTopics.map((topic) => {
              if (!topic) return null
              const num = topic.slug.replace('topic-', '').padStart(2, '0')
              return (
                <Link
                  key={topic.slug}
                  href={`/articles/${topic.slug}`}
                  className="group flex gap-3 rounded-lg border border-[color:var(--border-card)] bg-[#FBF7EE] hover:border-[#B23E26]/40 hover:shadow-[0_2px_12px_rgba(178,62,38,0.08)] p-4 transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-md bg-[#B23E26]/[0.08] flex items-center justify-center mt-0.5">
                    <span className="text-[#B23E26] text-xs font-bold font-serif">{num}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#B23E26] font-semibold tracking-widest mb-1 truncate">{topic.category}</p>
                    <p className="text-[#2B241C] text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[#B23E26] transition-colors">
                      {topic.title}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── 諮詢方案（P2-1：三層定價上首頁，做價格錨定）── */}
      <section className="reveal max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-1">PRICING</p>
          <h2 className="font-serif text-[#2B241C] text-2xl font-bold mb-3">命理諮詢方案</h2>
          <p className="text-[#6B6155] text-sm leading-relaxed max-w-lg mx-auto">
            透過命盤分析，協助你看清方向，做出更適合自己的決策。
          </p>
        </div>
        <PricingTiers />
        <div className="text-center mt-8">
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 text-[#B23E26] hover:text-[#C9461F] font-bold text-sm transition-colors"
          >
            查看完整諮詢說明與預約流程 <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── 自我篩選（P2-2：適合／未必適合雙欄對照）── */}
      <section className="reveal border-y border-[#2B241C]/10 bg-[#F4EEE1] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-[#2B241C] text-2xl font-bold mb-3">這個諮詢適合你嗎？</h2>
            <p className="text-[#6B6155] text-sm leading-relaxed max-w-lg mx-auto">
              與其事後失望，不如先看清楚。以下兩欄請對照著讀。
            </p>
          </div>
          <SelfQualification />
        </div>
      </section>

      {/* ── 明文承諾（P2-3）── */}
      <section className="reveal max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-serif text-[#2B241C] text-2xl font-bold">我的三個承諾</h2>
        </div>
        <Commitments />
      </section>

      {/* ── 常見問題（P3-4：與上方 homeFaqJsonLd 逐字一致，供 AI 摘要引用）── */}
      <section className="reveal border-t border-[#2B241C]/10 bg-[#F4EEE1] py-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-[#2B241C] text-2xl font-bold">常見問題</h2>
          </div>
          <div className="space-y-3">
            {homeFaq.map((item, i) => (
              <details
                key={i}
                open={i === 0}
                className="group rounded-md border border-[color:var(--border-card)] bg-[#FBF7EE] shadow-[var(--shadow-card)] px-5 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[#2B241C] font-semibold text-[0.95rem]">
                  {item.displayQ}
                  <span className="text-[#B23E26] text-lg leading-none transition-transform group-open:rotate-45">
                    ＋
                  </span>
                </summary>
                <p className="mt-3 text-[#5A5247] text-sm leading-[1.9]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}

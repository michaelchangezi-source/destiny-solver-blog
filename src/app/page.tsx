import Link from 'next/link'
import { preload } from 'react-dom'
import Image from 'next/image'
import { ArrowRight, Clock } from 'lucide-react'
import { getAllArticles, getLatestArticles, getTopicArticles } from '@/lib/articles'
import { SITE_URL } from '@/lib/site'
import { CRITICAL_FONTS } from '@/lib/font-preload'
import { analyzeDays, ELEMENT_COLOR } from '@/lib/bazi-daily'
import { getSolarTermOnDate } from '@/lib/bazi-calc'
import { formatDate } from '@/lib/utils'
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
  const allTopics = getTopicArticles()
  const featuredTopics = allTopics.slice(0, 8)

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
      <section className="border-y border-[#B23E26]/15 bg-[#F4EEE1] py-10">
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

      {/* ── 免費排盤工具四格 ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[#B23E26] text-xs font-serif font-semibold tracking-widest mb-1">排盤</p>
            <h2 className="font-serif text-[#2B241C] text-2xl font-bold">免費排盤工具</h2>
          </div>
          <Link href="/tools" className="text-sm text-[#B23E26] font-semibold hover:underline whitespace-nowrap">
            查看全部工具 →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 八字排盤 — 羅盤線稿 */}
          <Link href="/bazi" className="group relative flex flex-col rounded-2xl p-6 sm:p-8 bg-[#B23E26] hover:brightness-95 transition-[filter,transform] duration-200 active:scale-[0.98] overflow-hidden">
            <svg aria-hidden="true" className="pointer-events-none absolute -right-5 -top-5 opacity-[0.14]" width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="65" cy="65" r="60" stroke="white" strokeWidth="1.5"/>
              <circle cx="65" cy="65" r="46" stroke="white" strokeWidth="1"/>
              <circle cx="65" cy="65" r="32" stroke="white" strokeWidth="1"/>
              <circle cx="65" cy="65" r="9" stroke="white" strokeWidth="1.5"/>
              <line x1="65" y1="5" x2="65" y2="125" stroke="white" strokeWidth="0.75"/>
              <line x1="5" y1="65" x2="125" y2="65" stroke="white" strokeWidth="0.75"/>
              <line x1="22" y1="22" x2="108" y2="108" stroke="white" strokeWidth="0.5"/>
              <line x1="108" y1="22" x2="22" y2="108" stroke="white" strokeWidth="0.5"/>
              <line x1="65" y1="5" x2="95" y2="18" stroke="white" strokeWidth="0.5"/>
              <line x1="65" y1="5" x2="35" y2="18" stroke="white" strokeWidth="0.5"/>
              <line x1="125" y1="65" x2="112" y2="95" stroke="white" strokeWidth="0.5"/>
              <line x1="125" y1="65" x2="112" y2="35" stroke="white" strokeWidth="0.5"/>
            </svg>
            <span className="relative font-serif font-black text-5xl sm:text-6xl text-[#FBF7EE] leading-none mb-auto">命</span>
            <div className="relative mt-8">
              <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.25em] uppercase mb-1">Bazi</p>
              <h3 className="text-[#FBF7EE] font-bold text-base sm:text-lg leading-snug">八字排盤</h3>
              <p className="text-[#FBF7EE]/70 text-xs mt-1.5 leading-relaxed hidden sm:block">排出四柱、格局、大運流年</p>
            </div>
          </Link>
          {/* 八字合盤 — 雙環線稿 */}
          <Link href="/compat" className="group relative flex flex-col rounded-2xl p-6 sm:p-8 bg-[#7A5230] hover:brightness-95 transition-[filter,transform] duration-200 active:scale-[0.98] overflow-hidden">
            <svg aria-hidden="true" className="pointer-events-none absolute -right-8 -top-4 opacity-[0.15]" width="130" height="110" viewBox="0 0 130 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="55" r="42" stroke="white" strokeWidth="1.5"/>
              <circle cx="80" cy="55" r="42" stroke="white" strokeWidth="1.5"/>
              <circle cx="50" cy="55" r="28" stroke="white" strokeWidth="0.75"/>
              <circle cx="80" cy="55" r="28" stroke="white" strokeWidth="0.75"/>
              <circle cx="50" cy="55" r="5" stroke="white" strokeWidth="1"/>
              <circle cx="80" cy="55" r="5" stroke="white" strokeWidth="1"/>
            </svg>
            <span className="relative font-serif font-black text-5xl sm:text-6xl text-[#FBF7EE] leading-none mb-auto">合</span>
            <div className="relative mt-8">
              <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.25em] uppercase mb-1">Compatibility</p>
              <h3 className="text-[#FBF7EE] font-bold text-base sm:text-lg leading-snug">八字合盤</h3>
              <p className="text-[#FBF7EE]/70 text-xs mt-1.5 leading-relaxed hidden sm:block">分析雙方干支合沖刑害</p>
            </div>
          </Link>
          {/* 紫微斗數 — 北斗七星線稿 */}
          <Link href="/ziwei" className="group relative flex flex-col rounded-2xl p-6 sm:p-8 bg-[#2B4A6B] hover:brightness-95 transition-[filter,transform] duration-200 active:scale-[0.98] overflow-hidden">
            <svg aria-hidden="true" className="pointer-events-none absolute right-2 top-2 opacity-[0.18]" width="110" height="90" viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="10" y1="72" x2="30" y2="68" stroke="white" strokeWidth="1" strokeLinecap="round"/>
              <line x1="30" y1="68" x2="52" y2="62" stroke="white" strokeWidth="1" strokeLinecap="round"/>
              <line x1="52" y1="62" x2="68" y2="52" stroke="white" strokeWidth="1" strokeLinecap="round"/>
              <line x1="68" y1="52" x2="72" y2="36" stroke="white" strokeWidth="1" strokeLinecap="round"/>
              <line x1="52" y1="62" x2="55" y2="44" stroke="white" strokeWidth="1" strokeLinecap="round"/>
              <line x1="55" y1="44" x2="72" y2="36" stroke="white" strokeWidth="1" strokeLinecap="round"/>
              <line x1="72" y1="36" x2="88" y2="22" stroke="white" strokeWidth="1" strokeLinecap="round"/>
              <line x1="88" y1="22" x2="100" y2="10" stroke="white" strokeWidth="1" strokeLinecap="round"/>
              <circle cx="10" cy="72" r="2.5" fill="white"/>
              <circle cx="30" cy="68" r="2.5" fill="white"/>
              <circle cx="52" cy="62" r="3" fill="white"/>
              <circle cx="55" cy="44" r="2.5" fill="white"/>
              <circle cx="68" cy="52" r="2" fill="white"/>
              <circle cx="72" cy="36" r="2.5" fill="white"/>
              <circle cx="88" cy="22" r="2" fill="white"/>
              <circle cx="100" cy="10" r="2" fill="white"/>
            </svg>
            <span className="relative font-serif font-black text-5xl sm:text-6xl text-[#FBF7EE] leading-none mb-auto">紫</span>
            <div className="relative mt-8">
              <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.25em] uppercase mb-1">Zi Wei</p>
              <h3 className="text-[#FBF7EE] font-bold text-base sm:text-lg leading-snug">紫微斗數</h3>
              <p className="text-[#FBF7EE]/70 text-xs mt-1.5 leading-relaxed hidden sm:block">飛星派十二宮命盤及四化</p>
            </div>
          </Link>
          {/* 西洋占星 — 十二宮星盤線稿 */}
          <Link href="/western" className="group relative flex flex-col rounded-2xl p-6 sm:p-8 bg-[#3D6B5C] hover:brightness-95 transition-[filter,transform] duration-200 active:scale-[0.98] overflow-hidden">
            <svg aria-hidden="true" className="pointer-events-none absolute -right-5 -top-5 opacity-[0.14]" width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="65" cy="65" r="60" stroke="white" strokeWidth="1.5"/>
              <circle cx="65" cy="65" r="46" stroke="white" strokeWidth="1"/>
              <circle cx="65" cy="65" r="32" stroke="white" strokeWidth="0.75"/>
              {Array.from({length: 12}).map((_, i) => {
                const a = (i * 30 - 90) * Math.PI / 180
                const x1 = 65 + 46 * Math.cos(a)
                const y1 = 65 + 46 * Math.sin(a)
                const x2 = 65 + 60 * Math.cos(a)
                const y2 = 65 + 60 * Math.sin(a)
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1.2"/>
              })}
              {Array.from({length: 12}).map((_, i) => {
                const a = (i * 30 + 15 - 90) * Math.PI / 180
                const x1 = 65 + 46 * Math.cos(a)
                const y1 = 65 + 46 * Math.sin(a)
                const x2 = 65 + 53 * Math.cos(a)
                const y2 = 65 + 53 * Math.sin(a)
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.75"/>
              })}
              <circle cx="65" cy="65" r="5" stroke="white" strokeWidth="1"/>
            </svg>
            <span className="relative font-serif font-black text-5xl sm:text-6xl text-[#FBF7EE] leading-none mb-auto">星</span>
            <div className="relative mt-8">
              <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.25em] uppercase mb-1">Western</p>
              <h3 className="text-[#FBF7EE] font-bold text-base sm:text-lg leading-snug">西洋占星</h3>
              <p className="text-[#FBF7EE]/70 text-xs mt-1.5 leading-relaxed hidden sm:block">行星星座位置、上升點及相位</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── 免費占卜工具四格（AI 資料包）── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[#B23E26] text-xs font-serif font-semibold tracking-widest mb-1">占問</p>
            <h2 className="font-serif text-[#2B241C] text-2xl font-bold">免費占卜工具</h2>
          </div>
          <Link href="/tools" className="text-sm text-[#B23E26] font-semibold hover:underline whitespace-nowrap">
            查看全部工具 →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 六爻排盤 — 六爻線稿 */}
          <Link href="/liuyao" className="group relative flex flex-col rounded-2xl p-6 sm:p-8 bg-[#3A326B] hover:brightness-95 transition-[filter,transform] duration-200 active:scale-[0.98] overflow-hidden">
            <svg aria-hidden="true" className="pointer-events-none absolute right-3 top-4 opacity-[0.18]" width="72" height="90" viewBox="0 0 72 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="4" y1="8" x2="68" y2="8" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <line x1="4" y1="22" x2="68" y2="22" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <line x1="4" y1="36" x2="68" y2="36" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <line x1="4" y1="54" x2="30" y2="54" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <line x1="42" y1="54" x2="68" y2="54" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <line x1="4" y1="68" x2="30" y2="68" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <line x1="42" y1="68" x2="68" y2="68" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <line x1="4" y1="82" x2="30" y2="82" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <line x1="42" y1="82" x2="68" y2="82" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <span className="relative font-serif font-black text-5xl sm:text-6xl text-[#FBF7EE] leading-none mb-auto">卦</span>
            <div className="relative mt-8">
              <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.25em] uppercase mb-1">Liuyao</p>
              <h3 className="text-[#FBF7EE] font-bold text-base sm:text-lg leading-snug">六爻排盤</h3>
              <p className="text-[#FBF7EE]/70 text-xs mt-1.5 leading-relaxed hidden sm:block">納甲六親、六獸、句空，附 AI 資料包</p>
            </div>
          </Link>
          {/* 奇門遁甲 — 九宮格線稿 */}
          <Link href="/qimen" className="group relative flex flex-col rounded-2xl p-6 sm:p-8 bg-[#2C4E5C] hover:brightness-95 transition-[filter,transform] duration-200 active:scale-[0.98] overflow-hidden">
            <svg aria-hidden="true" className="pointer-events-none absolute -right-3 -top-3 opacity-[0.17]" width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="100" height="100" stroke="white" strokeWidth="1.5"/>
              <line x1="38" y1="5" x2="38" y2="105" stroke="white" strokeWidth="1"/>
              <line x1="72" y1="5" x2="72" y2="105" stroke="white" strokeWidth="1"/>
              <line x1="5" y1="38" x2="105" y2="38" stroke="white" strokeWidth="1"/>
              <line x1="5" y1="72" x2="105" y2="72" stroke="white" strokeWidth="1"/>
              <circle cx="55" cy="55" r="11" stroke="white" strokeWidth="1.5"/>
            </svg>
            <span className="relative font-serif font-black text-5xl sm:text-6xl text-[#FBF7EE] leading-none mb-auto">局</span>
            <div className="relative mt-8">
              <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.25em] uppercase mb-1">Qimen</p>
              <h3 className="text-[#FBF7EE] font-bold text-base sm:text-lg leading-snug">奇門遁甲</h3>
              <p className="text-[#FBF7EE]/70 text-xs mt-1.5 leading-relaxed hidden sm:block">九宮天地盤、八門星神，附 AI 資料包</p>
            </div>
          </Link>
          {/* 塔羅占卜 — 三張牌線稿 */}
          <Link href="/tarot" className="group relative flex flex-col rounded-2xl p-6 sm:p-8 bg-[#5C3554] hover:brightness-95 transition-[filter,transform] duration-200 active:scale-[0.98] overflow-hidden">
            <svg aria-hidden="true" className="pointer-events-none absolute right-0 top-2 opacity-[0.16]" width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="20" width="50" height="75" rx="4" stroke="white" strokeWidth="1.5" transform="rotate(-10 31 57)"/>
              <rect x="22" y="14" width="50" height="75" rx="4" stroke="white" strokeWidth="1.5"/>
              <rect x="36" y="18" width="50" height="75" rx="4" stroke="white" strokeWidth="1.5" transform="rotate(10 61 55)"/>
            </svg>
            <span className="relative font-serif font-black text-5xl sm:text-6xl text-[#FBF7EE] leading-none mb-auto">牌</span>
            <div className="relative mt-8">
              <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.25em] uppercase mb-1">Tarot</p>
              <h3 className="text-[#FBF7EE] font-bold text-base sm:text-lg leading-snug">塔羅占卜</h3>
              <p className="text-[#FBF7EE]/70 text-xs mt-1.5 leading-relaxed hidden sm:block">78 張韋特牌、五種牌陣，附 AI 資料包</p>
            </div>
          </Link>
          {/* 雷諾曼占卜 — 菱形線稿 */}
          <Link href="/lenormand" className="group relative flex flex-col rounded-2xl p-6 sm:p-8 bg-[#3D5840] hover:brightness-95 transition-[filter,transform] duration-200 active:scale-[0.98] overflow-hidden">
            <svg aria-hidden="true" className="pointer-events-none absolute -right-4 -top-4 opacity-[0.17]" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 6 L114 60 L60 114 L6 60 Z" stroke="white" strokeWidth="1.5"/>
              <path d="M60 26 L94 60 L60 94 L26 60 Z" stroke="white" strokeWidth="1"/>
              <circle cx="60" cy="60" r="13" stroke="white" strokeWidth="1.5"/>
              <circle cx="60" cy="6" r="2.5" fill="white"/>
              <circle cx="114" cy="60" r="2.5" fill="white"/>
              <circle cx="60" cy="114" r="2.5" fill="white"/>
              <circle cx="6" cy="60" r="2.5" fill="white"/>
            </svg>
            <span className="relative font-serif font-black text-5xl sm:text-6xl text-[#FBF7EE] leading-none mb-auto">占</span>
            <div className="relative mt-8">
              <p className="text-[#FBF7EE]/60 text-[10px] tracking-[0.25em] uppercase mb-1">Lenormand</p>
              <h3 className="text-[#FBF7EE] font-bold text-base sm:text-lg leading-snug">雷諾曼占卜</h3>
              <p className="text-[#FBF7EE]/70 text-xs mt-1.5 leading-relaxed hidden sm:block">36 張 Lenormand、六種牌陣，附 AI 資料包</p>
            </div>
          </Link>
        </div>
        <p className="text-[#5A5247] text-sm mt-5 leading-relaxed">
          想比較坊間工具？<Link href="/tools-guide" className="text-[#B23E26] hover:underline">睇 2026 免費排盤工具合集 →</Link>
        </p>
      </section>

      {/* ── 最新文章（editorial list，去卡片化）── */}
      {latestArticles.length > 0 && (
        <section className="border-y border-[color:var(--border-card)] bg-[#FBF7EE]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[#B23E26] text-xs font-serif font-semibold tracking-widest mb-1">近作</p>
                <h2 className="font-serif text-[#2B241C] text-2xl font-bold">最新文章</h2>
              </div>
              <Link href="/latest" className="border-b border-[#B23E26] text-[#B23E26] text-sm font-bold whitespace-nowrap">
                全部最新
              </Link>
            </div>
            <style>{`@media(min-width:640px){.article-thumb-grid{grid-template-columns:160px 1fr}}`}</style>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
              {latestArticles.map((article, i) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className={`group grid gap-4 sm:gap-5 py-5 ${
                    i === 0
                      ? 'lg:col-span-2 grid-cols-[108px_1fr] sm:grid-cols-[minmax(260px,0.45fr)_1fr] border-t-2 border-[#2B241C]'
                      : 'grid-cols-[108px_1fr] article-thumb-grid border-t border-[color:var(--border-card)]'
                  }`}
                >
                  <div className={`relative overflow-hidden bg-[#161310] ${i === 0 ? 'min-h-[108px] sm:min-h-[220px]' : ''}`} style={i > 0 ? { aspectRatio: '1/1' } : undefined}>
                    {article.coverImage ? (
                      <>
                        <Image src={article.coverImage} alt={article.title} fill sizes={i === 0 ? '(max-width: 640px) 108px, 45vw' : '160px'} className="object-cover" style={{ objectPosition: i === 0 ? 'center 38%' : 'center 40%', transform: i > 0 ? 'scale(1.5)' : undefined }} />
                        {i > 0 && <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(22,19,16,0.7), transparent 40%, rgba(22,19,16,0.5))' }} />}
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2B241C] to-[#161310]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="inline-flex border border-[#B23E26]/35 rounded-full px-2.5 py-0.5 text-[#B23E26] text-[11px] font-bold tracking-[0.08em]">
                      {article.category}
                    </span>
                    <h3 className={`text-[#2B241C] font-bold leading-snug mt-2 mb-1.5 group-hover:text-[#B23E26] transition-colors line-clamp-2 ${
                      i === 0 ? 'text-xl sm:text-2xl' : 'text-base'
                    }`}>
                      {article.title}
                    </h3>
                    <p className="text-[#6B6155] text-sm leading-relaxed line-clamp-2 hidden sm:block">{article.excerpt}</p>
                    <div className="flex items-center gap-3 text-[#6B6155] text-xs mt-3">
                      <span className="flex items-center gap-1"><Clock size={11} />{article.readingTime}</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 系統學八字（目錄式列表）── */}
      {featuredTopics.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#B23E26] text-xs font-serif font-semibold tracking-widest mb-1">入門</p>
              <h2 className="font-serif text-[#2B241C] text-2xl font-bold">系統學八字</h2>
            </div>
            <Link href="/latest#教學" className="border-b border-[#B23E26] text-[#B23E26] text-sm font-bold whitespace-nowrap">
              全部教學
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-11 border-t-2 border-[#2B241C]">
            {featuredTopics.map((topic, index) => {
              if (!topic) return null
              const num = String(index + 1).padStart(2, '0')
              return (
                <Link
                  key={topic.slug}
                  href={`/articles/${topic.slug}`}
                  className="group grid grid-cols-[46px_1fr_auto] items-center gap-3.5 border-b border-[color:var(--border-card)] py-4 transition-colors"
                >
                  <span className="text-[#B23E26] font-serif text-xl font-bold">{num}</span>
                  <span className="min-w-0">
                    <span className="text-[#6B6155] text-[10px] tracking-widest block">{topic.category}</span>
                    <span className="text-[#2B241C] text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[#B23E26] transition-colors block">{topic.title}</span>
                  </span>
                  <span className="text-[#6B6155] group-hover:text-[#B23E26] transition-colors" aria-hidden="true">→</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── 諮詢方案（P2-1：三層定價上首頁，做價格錨定）── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-[#B23E26] text-xs font-serif font-semibold tracking-widest mb-1">諮詢</p>
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
      <section className="border-y border-[#2B241C]/10 bg-[#F4EEE1] py-16">
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
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-serif text-[#2B241C] text-2xl font-bold">我的三個承諾</h2>
        </div>
        <Commitments />
      </section>

      {/* ── 常見問題（P3-4：與上方 homeFaqJsonLd 逐字一致，供 AI 摘要引用）── */}
      <section className="border-t border-[#2B241C]/10 bg-[#F4EEE1] py-16">
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

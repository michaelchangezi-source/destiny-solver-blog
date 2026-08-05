import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getAllArticles, getAllCategories, getLatestArticles } from '@/lib/articles'
import { analyzeDays, ELEMENT_COLOR } from '@/lib/bazi-daily'
import { getSolarTermOnDate } from '@/lib/bazi-calc'
import CategoryWheel from '@/components/ui/CategoryWheel'
import LatestCard from '@/components/blog/LatestCard'
import HomeMotion from '@/components/HomeMotion'
import InkFlowHero from '@/components/InkFlowHero'
import PricingTiers from '@/components/home/PricingTiers'
import SelfQualification from '@/components/home/SelfQualification'
import Commitments from '@/components/home/Commitments'

export const revalidate = 300

export default function HomePage() {
  const articles = getAllArticles()
  const categories = getAllCategories()
  const latestArticles = getLatestArticles(6)

  // 今日命盤（供 Hero 卡）
  const [today] = analyzeDays(1)
  const solarTerm = getSolarTermOnDate(new Date())

  return (
    <>
      <HomeMotion />

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

      {/* ── Bazi Compat Calculator banner（§8 上移至最新文章之前）── */}
      <section className="reveal max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Link href="/compat" className="group block bg-[#F4EEE1] border border-[color:var(--border-card)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)] hover:border-[#B23E26]/40 rounded-lg p-10 sm:p-14 relative overflow-hidden transition-colors duration-200">
          <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight size={20} className="text-[#B23E26]" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-8 relative">
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex flex-col items-center justify-center bg-[#B23E26]">
              <span className="font-serif font-black text-4xl sm:text-5xl text-[#FBF7EE] leading-none">合</span>
              <span className="text-[#FBF7EE]/70 text-[10px] tracking-widest mt-1">盤</span>
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-[#2B241C] text-2xl sm:text-3xl font-black mb-3 group-hover:text-[#B23E26] transition-colors">
                免費八字合盤
              </h2>
              <p className="text-[#6B6155] text-sm leading-relaxed max-w-lg">
                輸入兩人出生年月日時，即時分析雙方四柱的天干五合、地支六合、六沖、六害等干支互動關係，看懂你們之間的命理契合度。
              </p>
            </div>
          </div>
        </Link>
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

      {/* ── Categories wheel（系統學習路徑入口）── */}
      {categories.length > 0 && (
        <section className="reveal border-y border-[#2B241C]/10 bg-[#F4EEE1] py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-serif text-[#2B241C] text-2xl font-bold">系統學習路徑</h2>
              </div>
              <Link href="/categories" className="text-[#8A8071] hover:text-[#B23E26] text-sm transition-colors flex items-center gap-1">
                全部分類 <ArrowRight size={13} />
              </Link>
            </div>
            <CategoryWheel categories={categories} />
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

    </>
  )
}

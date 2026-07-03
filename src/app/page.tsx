import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getAllArticles, getAllCategories, getLatestArticles } from '@/lib/articles'
import { analyzeDays, ELEMENT_COLOR } from '@/lib/bazi-daily'
import CategoryWheel from '@/components/ui/CategoryWheel'
import LatestCard from '@/components/blog/LatestCard'
import HomeMotion from '@/components/HomeMotion'
import InkFlowHero from '@/components/InkFlowHero'

export const revalidate = 3600

export default function HomePage() {
  const articles = getAllArticles()
  const categories = getAllCategories()
  const latestArticles = getLatestArticles(6)

  // 今日命盤（供 Hero 卡）
  const [today] = analyzeDays(1)

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
                className="inline-block border border-[#2B241C]/20 hover:border-[#B23E26] hover:text-[#B23E26] text-[#2B241C] font-bold text-sm px-6 py-2.5 rounded-lg transition-all duration-200 active:scale-[0.97] whitespace-nowrap"
              >
                在 Threads 跟蹤
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bazi Compat Calculator banner（§8 上移至最新文章之前）── */}
      <section className="reveal max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Link href="/compat" className="group block bg-[#F4EEE1] border border-[#2B241C]/10 hover:border-[#B23E26]/40 rounded-3xl p-10 sm:p-14 relative overflow-hidden transition-all duration-200 hover:shadow-[0_18px_44px_-20px_rgba(178,62,38,0.25)]">
          <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight size={20} className="text-[#B23E26]" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-8 relative">
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center bg-[#B23E26]">
              <span className="font-serif font-black text-4xl sm:text-5xl text-[#FBF7EE] leading-none">合</span>
              <span className="text-[#FBF7EE]/70 text-[10px] tracking-widest mt-1">盤</span>
            </div>
            <div className="flex-1">
              <p className="text-[#B23E26] text-xs font-semibold tracking-[0.35em] uppercase mb-2">Free Tool</p>
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
                <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-1">LEARNING PATH</p>
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

      {/* ── CTA Consultation（深色 --ink 區，節奏對比）── */}
      <section className="reveal max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-[#161310] rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="relative w-16 h-16 mx-auto mb-6 rounded-full overflow-hidden ring-2 ring-[#E8A86E]/40">
            <Image src="/images/avatar.png" alt="命運解決師" fill sizes="64px" className="object-cover" />
          </div>
          <p className="text-[#E8A86E] text-xs font-semibold tracking-[0.3em] uppercase mb-4">一對一命理諮詢</p>
          <h2 className="font-serif text-[#F4EEE1] text-3xl sm:text-4xl font-black mb-4">
            準備好認識<br className="sm:hidden" /><span className="text-[#E8A86E]">真實的自己</span>了嗎？
          </h2>
          <p className="text-[#F4EEE1]/70 max-w-lg mx-auto mb-8 leading-relaxed text-sm">
            深度八字命理分析，解讀你的能量結構、格局層次與人生時機。
            <br />
            讓命理成為你的決策工具，而非焦慮的來源。
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 bg-[#E0552C] hover:bg-[#C9461F] text-[#FBF7EE] font-bold px-8 py-4 rounded-lg transition-all duration-200 active:scale-[0.97]"
          >
            了解諮詢服務 <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}

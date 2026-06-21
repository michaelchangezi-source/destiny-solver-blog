import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getAllArticles, getAllCategories, getLatestArticles } from '@/lib/articles'
import { analyzeDays, ELEMENT_COLOR } from '@/lib/bazi-daily'
import CategoryBadge from '@/components/ui/CategoryBadge'
import LatestCard from '@/components/blog/LatestCard'
import HomeMotion from '@/components/HomeMotion'
import InkFlowHero from '@/components/InkFlowHero'

export const revalidate = 3600

const LEARNING_STAGES = [
  {
    no: '01',
    title: '認識天干地支',
    desc: '甲乙丙丁…十天干；子丑寅卯…十二地支。理解八字的字母表。',
    cat: '八字基礎',
    slug: 'basics',
  },
  {
    no: '02',
    title: '掌握干支關係',
    desc: '刑、沖、合、害。地支之間的動態關係，決定命局的張力。',
    cat: '干支詳解',
    slug: 'ganzhi',
  },
  {
    no: '03',
    title: '讀懂十神體系',
    desc: '比劫、食傷、財星、官殺、印綬。這是命理的語言骨架。',
    cat: '十神應用',
    slug: 'shishen',
  },
  {
    no: '04',
    title: '判斷格局清純度',
    desc: '命局的結構決定人的層次與模式。清純與雜亂各有其象。',
    cat: '命盤格局',
    slug: 'patterns',
  },
  {
    no: '05',
    title: '解讀大運流年',
    desc: '人生時序如何運作？為什麼有人在某個年份突破，另一個停滯？',
    cat: '大運流年',
    slug: 'dayun',
  },
]

export default function HomePage() {
  const articles = getAllArticles()
  const categories = getAllCategories()
  const latestArticles = getLatestArticles(6)

  // 今日命盤（供 Hero 卡）
  const [today] = analyzeDays(1)

  return (
    <>
      <HomeMotion />

      {/* ── Hero（水墨流光）── */}
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

      {/* ── Threads ── */}
      <section className="reveal border-y border-[#B23E26]/20 bg-[#B23E26]/[0.04] py-10">
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
                <span className="text-[#8A8071] text-[11px] border border-[#2B241C]/15 px-2 py-0.5 rounded-full">
                  月瀏覽 100萬+
                </span>
              </div>
              <p className="text-[#5A5247] text-sm leading-relaxed max-w-lg">
                每日分享命理洞察、實案分析與五行思考。在 Threads 了解最新動態。
              </p>
            </div>
            <a
              href="https://www.threads.com/@destiny.solver"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-[#B23E26] hover:bg-[#96321E] text-[#F7F1E5] font-bold text-sm px-7 py-3.5 rounded transition-all hover:shadow-[0_10px_24px_-10px_rgba(178,62,38,0.55)] active:scale-[0.97] whitespace-nowrap"
            >
              在 Threads 跟蹤
            </a>
          </div>
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

      {/* ── Learning Path ── */}
      <section className="bg-[#2B241C]/[0.04] border-b border-[#2B241C]/10 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="reveal flex items-center justify-between mb-8">
            <div>
              <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-1">LEARNING PATH</p>
              <h2 className="font-serif text-[#2B241C] text-2xl font-bold">系統學習路徑</h2>
            </div>
            <Link href="/categories" className="text-[#8A8071] hover:text-[#B23E26] text-sm transition-colors flex items-center gap-1">
              全部分類 <ArrowRight size={13} />
            </Link>
          </div>
          <div className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {LEARNING_STAGES.map((stage) => (
              <Link
                key={stage.no}
                href={`/categories/${stage.slug}`}
                className="group relative bg-[#FBF7EE] border border-[#2B241C]/10 hover:border-[#B23E26]/40 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-16px_rgba(178,62,38,0.3)] rounded p-5 transition-all duration-300"
              >
                <p className="font-serif text-2xl font-black text-[#B23E26]/25 group-hover:text-[#B23E26]/55 leading-none mb-3 transition-colors">{stage.no}</p>
                <h3 className="text-[#2B241C] font-bold text-sm mb-2 group-hover:text-[#B23E26] transition-colors leading-snug">
                  {stage.title}
                </h3>
                <p className="text-[#6B6155] text-xs leading-relaxed">{stage.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bazi Calculator CTA ── */}
      <section className="reveal max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Link href="/bazi" className="group block border border-[#B23E26]/25 hover:border-[#B23E26]/60 rounded p-10 sm:p-14 relative overflow-hidden transition-all hover:shadow-[0_18px_40px_-22px_rgba(178,62,38,0.35)]">
          <div className="absolute right-8 bottom-0 text-[200px] font-black text-[#B23E26] opacity-[0.04] leading-none select-none pointer-events-none font-serif">命</div>
          <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight size={20} className="text-[#B23E26]" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-8">
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 border border-[#B23E26]/40 rounded flex flex-col items-center justify-center bg-[#B23E26]/[0.06]">
              <span className="font-serif font-black text-4xl sm:text-5xl text-[#B23E26] leading-none">八</span>
              <span className="text-[#B23E26]/60 text-[10px] tracking-widest mt-1">字</span>
            </div>
            <div className="flex-1">
              <p className="text-[#B23E26] text-xs font-semibold tracking-[0.35em] uppercase mb-2">Free Tool</p>
              <h2 className="font-serif text-[#2B241C] text-2xl sm:text-3xl font-black mb-3 group-hover:text-[#B23E26] transition-colors">
                免費八字排盤
              </h2>
              <p className="text-[#5A5247] text-sm leading-relaxed max-w-lg">
                輸入出生年月日時，即時排出四柱命盤、十神及十個大運。讀懂你的命局結構，是認識自己的第一步。
              </p>
            </div>
          </div>
        </Link>
      </section>

      {/* ── Categories strip ── */}
      {categories.length > 0 && (
        <section className="reveal border-y border-[#2B241C]/10 py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <CategoryBadge key={cat} category={cat} linkable showNumber={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Consultation ── */}
      <section className="reveal max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="border border-[#B23E26]/25 rounded p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute right-8 bottom-0 font-serif text-[180px] font-black text-[#B23E26] opacity-[0.04] leading-none select-none pointer-events-none">
            命
          </div>
          <p className="text-[#B23E26] text-xs font-semibold tracking-[0.3em] uppercase mb-4">一對一命理諮詢</p>
          <h2 className="font-serif text-[#2B241C] text-3xl sm:text-4xl font-black mb-4">
            準備好認識<br className="sm:hidden" />真實的自己了嗎？
          </h2>
          <p className="text-[#5A5247] max-w-lg mx-auto mb-8 leading-relaxed text-sm">
            深度八字命理分析，解讀你的能量結構、格局層次與人生時機。讓命理成為你的決策工具，而非焦慮的來源。
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 bg-[#B23E26] hover:bg-[#96321E] text-[#F7F1E5] font-bold px-8 py-4 rounded transition-all hover:shadow-[0_12px_28px_-10px_rgba(178,62,38,0.55)] active:scale-[0.97]"
          >
            了解諮詢服務 <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}

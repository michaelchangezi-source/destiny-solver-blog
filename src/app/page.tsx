import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getAllArticles, getAllCategories } from '@/lib/articles'
import ArticleCard from '@/components/blog/ArticleCard'
import CategoryBadge from '@/components/ui/CategoryBadge'

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
  const startHere = articles.slice(0, 3)
  const latest = articles.slice(3, 9)
  const categories = getAllCategories()

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Background watermarks */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-10 left-10 text-[200px] font-black text-white leading-none opacity-[0.04] md:opacity-[0.07]">甲</div>
          <div className="absolute bottom-20 right-16 text-[160px] font-black text-[#C9A84C] leading-none opacity-[0.04] md:opacity-[0.06]">命</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-black text-white leading-none opacity-[0.025] md:opacity-[0.04]">乾</div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-24">

            {/* ── Left: Text ── */}
            <div className="flex-1">
              {/* Eyebrow — mobile shows small avatar inline */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-full overflow-hidden ring-1 ring-[#C9A84C]/25 flex-shrink-0 lg:hidden">
                  <img src="/images/avatar.png" alt="陳卓賢" className="w-full h-full object-cover" />
                </div>
                <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.35em] uppercase">
                  命運解決師 · Destiny Solver · @destiny.solver
                </p>
              </div>

              <h1 className="font-serif text-white text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-6">
                用命理<br />
                <span className="text-[#C9A84C]">讀懂你</span><br />
                這個人
              </h1>
              <p className="text-white/55 text-lg leading-relaxed mb-10 max-w-lg">
                不是預測命運，是認識自己。透過八字命理的框架，看見你的能量結構、人生格局與時勢流動。
              </p>

              {/* Inline stats */}
              <div className="flex flex-wrap items-center gap-8 mb-10 text-white/40 text-sm">
                <div>
                  <span className="text-white font-black text-2xl mr-1.5">{articles.length}+</span>深度文章
                </div>
                <div className="w-px h-5 bg-white/15" />
                <div>
                  <span className="text-white font-black text-2xl mr-1.5">3.5K+</span>Threads 追蹤者
                </div>
                <div className="w-px h-5 bg-white/15" />
                <div>
                  <span className="text-white font-black text-2xl mr-1.5">免費</span>開放閱讀
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/categories"
                  className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8963B] text-[#0F0F2D] font-bold px-7 py-3.5 rounded transition-colors"
                >
                  從這裡開始 <ArrowRight size={18} />
                </Link>
                <Link
                  href="/consultation"
                  className="flex items-center gap-2 border border-white/20 hover:border-[#C9A84C]/60 text-white/70 hover:text-white font-medium px-7 py-3.5 rounded transition-colors"
                >
                  預約諮詢
                </Link>
              </div>
            </div>

            {/* ── Right: Avatar (desktop only) ── */}
            <div className="hidden lg:flex flex-shrink-0 items-center justify-center">
              <div className="relative">
                {/* Ambient glow */}
                <div className="absolute -inset-8 rounded-full bg-[#C9A84C]/[0.07] blur-3xl pointer-events-none" />
                {/* Avatar */}
                <div className="relative w-64 h-64 xl:w-72 xl:h-72 rounded-full overflow-hidden ring-1 ring-[#C9A84C]/25">
                  <img
                    src="/images/avatar.png"
                    alt="陳卓賢 @destiny.solver"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Name tag */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#0A0A20] border border-white/10 rounded px-4 py-2 whitespace-nowrap">
                  <p className="text-white text-xs font-semibold text-center">陳卓賢</p>
                  <p className="text-[#C9A84C] text-[10px] text-center tracking-wider">@destiny.solver</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Learning Path ── */}
      <section className="bg-white/3 border-y border-white/8 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[#C9A84C] text-xs font-semibold tracking-widest mb-1">LEARNING PATH</p>
              <h2 className="font-serif text-white text-2xl font-bold">系統學習路徑</h2>
            </div>
            <Link href="/categories" className="text-white/40 hover:text-[#C9A84C] text-sm transition-colors flex items-center gap-1">
              全部分類 <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {LEARNING_STAGES.map((stage) => (
              <Link
                key={stage.no}
                href={`/categories/${stage.slug}`}
                className="group bg-[#0A0A20] border border-white/8 hover:border-[#C9A84C]/40 rounded-md p-5 transition-all"
              >
                <p className="text-[#C9A84C]/60 font-mono text-xs mb-3">{stage.no}</p>
                <h3 className="text-white font-bold text-sm mb-2 group-hover:text-[#C9A84C] transition-colors leading-snug">
                  {stage.title}
                </h3>
                <p className="text-white/35 text-xs leading-relaxed">{stage.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── From Here ── */}
      {startHere.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-white text-2xl font-bold">從這裡開始</h2>
            <Link href="/articles" className="text-white/40 hover:text-[#C9A84C] text-sm flex items-center gap-1 transition-colors">
              全部文章 <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {startHere.map((article, i) => (
              <ArticleCard key={article.slug} article={article} featured index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── Categories strip ── */}
      {categories.length > 0 && (
        <section className="border-y border-white/8 py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <CategoryBadge key={cat} category={cat} linkable />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Articles ── */}
      {latest.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-serif text-white text-2xl font-bold mb-8">最新文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {latest.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── Threads ── */}
      <section className="border-y border-white/8 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 text-center sm:text-left">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-[#C9A84C]/30">
                <img src="/images/avatar.png" alt="@destiny.solver" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">@destiny.solver</p>
                <p className="text-white/35 text-xs">Threads · 3.5K 追蹤者</p>
              </div>
            </div>
            <p className="text-white/40 text-sm flex-1">
              每日分享命理洞察、實案分析與五行思考——在 Threads 跟蹤最新動態。
            </p>
            <a
              href="https://www.threads.com/@destiny.solver"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 border border-white/20 hover:border-[#C9A84C]/50 text-white/55 hover:text-[#C9A84C] text-sm px-5 py-2.5 rounded transition-colors whitespace-nowrap"
            >
              在 Threads 跟蹤
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA Consultation ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="border border-[#C9A84C]/25 rounded-sm p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute right-8 bottom-0 text-[180px] font-black text-[#C9A84C] opacity-[0.04] leading-none select-none pointer-events-none">
            命
          </div>
          <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase mb-4">一對一命理諮詢</p>
          <h2 className="font-serif text-white text-3xl sm:text-4xl font-black mb-4">
            準備好認識<br className="sm:hidden" />真實的自己了嗎？
          </h2>
          <p className="text-white/50 max-w-lg mx-auto mb-8 leading-relaxed text-sm">
            深度八字命理分析，解讀你的能量結構、格局層次與人生時機。讓命理成為你的決策工具，而非焦慮的來源。
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8963B] text-[#0F0F2D] font-bold px-8 py-4 rounded transition-colors"
          >
            了解諮詢服務 <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}

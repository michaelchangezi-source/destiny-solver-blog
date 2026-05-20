import Link from 'next/link'
import { ArrowRight, BookOpen, Calendar, MessageCircle } from 'lucide-react'
import { getAllArticles, getAllCategories } from '@/lib/articles'
import ArticleCard from '@/components/blog/ArticleCard'
import CategoryBadge from '@/components/ui/CategoryBadge'

export default function HomePage() {
  const articles = getAllArticles()
  const featured = articles.slice(0, 3)
  const latest = articles.slice(3, 9)
  const categories = getAllCategories()

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
          <div className="absolute top-10 left-10 text-[200px] font-black text-white leading-none">甲</div>
          <div className="absolute bottom-20 right-16 text-[160px] font-black text-[#C9A84C] leading-none">命</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-black text-white leading-none opacity-50">乾</div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-[#C9A84C] text-sm font-semibold tracking-[0.3em] uppercase mb-6">
              命運解決師 · Destiny Solver
            </p>
            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              用命理<br />
              <span className="text-[#C9A84C]">讀懂你</span><br />
              這個人
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md">
              不是預測命運，是認識自己。<br />
              透過八字命理的框架，看見你的能量結構、人生格局與時勢流動。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/articles"
                className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8963B] text-[#0F0F2D] font-bold px-6 py-3 rounded-full transition-colors"
              >
                開始閱讀 <ArrowRight size={18} />
              </Link>
              <Link
                href="/consultation"
                className="flex items-center gap-2 border border-white/20 hover:border-[#C9A84C]/60 text-white/80 hover:text-white font-medium px-6 py-3 rounded-full transition-colors"
              >
                預約諮詢
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BookOpen, value: `${articles.length}+`, label: '深度文章' },
              { icon: Calendar, value: '7年+', label: '命理研究' },
              { icon: MessageCircle, value: '3.5K+', label: 'Threads 追蹤' },
              { icon: ArrowRight, value: '免費', label: '開放閱讀' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-[#C9A84C]/30 transition-colors"
              >
                <stat.icon className="mx-auto mb-2 text-[#C9A84C]" size={24} />
                <p className="text-white text-2xl font-black">{stat.value}</p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Articles ── */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white text-2xl font-bold">精選文章</h2>
            <Link href="/articles" className="text-[#C9A84C] text-sm flex items-center gap-1 hover:gap-2 transition-all">
              全部文章 <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((article) => (
              <ArticleCard key={article.slug} article={article} featured />
            ))}
          </div>
        </section>
      )}

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section className="bg-white/3 border-y border-white/10 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-white text-xl font-bold mb-6 text-center">文章分類</h2>
            <div className="flex flex-wrap gap-3 justify-center">
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
          <h2 className="text-white text-2xl font-bold mb-8">最新文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {latest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* ── Follow on Threads ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="relative overflow-hidden bg-[#0A0A20] border border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Decorative glyph */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[140px] font-black text-white/3 leading-none select-none pointer-events-none">
            緣
          </div>
          <div className="relative">
            <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
              最新動態 · Follow Me
            </p>
            <h2 className="text-white text-2xl sm:text-3xl font-black mb-3">
              追蹤 Threads，<br className="sm:hidden" />掌握最新命理洞見
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              文章以外，我每日在 Threads 分享八字斷語、流年觀察與命理小知識。
              想看最新內容，歡迎追蹤。
            </p>
          </div>
          <a
            href="https://www.threads.com/@destiny.solver"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex-shrink-0 flex items-center gap-3 bg-white hover:bg-white/90 text-[#0F0F2D] font-bold px-7 py-4 rounded-full transition-colors text-base shadow-lg"
          >
            {/* Threads logo SVG */}
            <svg width="20" height="20" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M141.537 88.988C140.71 88.5771 139.87 88.1787 139.019 87.793C137.537 59.1956 122.081 43.4156 97.594 43.2598C97.4701 43.2591 97.3468 43.2591 97.2234 43.2591C82.8746 43.2591 70.5896 49.3477 63.1259 60.285L75.8284 69.2416C81.3741 61.2494 89.9544 59.1946 97.2351 59.1946C97.3252 59.1946 97.4153 59.1949 97.5051 59.1953C107.687 59.2594 115.381 62.2922 120.36 68.3138C123.996 72.6591 126.398 78.6046 127.523 86.0643C118.978 84.6065 109.683 84.1765 99.7348 84.7556C76.2866 86.0996 61.4284 99.2776 62.3635 118.166C62.8379 127.752 67.7461 135.965 76.1609 141.242C83.2459 145.74 92.4173 147.929 101.956 147.417C114.613 146.733 124.591 141.886 131.546 132.027C136.818 124.474 140.084 114.754 141.408 102.595C147.317 106.065 151.756 110.87 154.186 116.893C158.379 127.156 158.605 144.057 146.066 156.573C135.085 167.534 121.866 172.289 101.944 172.434C79.9319 172.265 63.2893 165.356 52.4748 151.91C42.3175 139.31 37.0661 120.892 36.886 97.0456C37.0661 73.1984 42.3175 54.7801 52.4748 42.1804C63.2893 28.7342 79.9319 21.8251 101.944 21.6562C124.097 21.8261 141.001 28.7636 151.993 42.2574C157.423 49.0198 161.491 57.6641 164.114 67.8806L179.405 63.9202C176.236 51.2179 171.199 40.3721 164.332 31.5025C150.35 13.5371 129.886 4.28417 101.994 4.0625C74.1747 4.28217 53.8811 13.5528 40.1217 31.4781C27.8765 47.5732 21.5978 70.3204 21.3867 97.0256V97.1049C21.5978 123.81 27.8765 146.558 40.1217 162.652C53.8811 180.578 74.1747 189.848 101.994 190.068C126.848 189.869 143.578 183.458 157.039 170.024C174.212 152.885 173.665 130.963 168.142 117.219C164.196 107.398 156.43 99.2921 141.537 88.988ZM100.866 131.489C90.4394 132.056 79.5971 127.437 79.0771 117.685C78.693 110.348 84.0511 102.178 100.819 101.218C102.872 101.099 104.888 101.04 106.87 101.04C113.137 101.04 118.989 101.639 124.311 102.808C122.476 124.647 112.161 130.895 100.866 131.489Z" fill="currentColor"/>
            </svg>
            @destiny.solver
          </a>
        </div>
      </section>

      {/* ── CTA Consultation ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 border border-[#C9A84C]/30 rounded-3xl p-10 text-center">
          <p className="text-[#C9A84C] text-sm font-semibold tracking-widest mb-4">一對一命理諮詢</p>
          <h2 className="text-white text-3xl font-black mb-4">準備好認識真實的自己了嗎？</h2>
          <p className="text-white/60 max-w-lg mx-auto mb-8 leading-relaxed">
            透過深度八字命理分析，解讀你的能量結構、格局層次與人生時機，讓命理成為你的決策工具。
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8963B] text-[#0F0F2D] font-bold px-8 py-4 rounded-full transition-colors text-lg"
          >
            了解諮詢服務 <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  )
}

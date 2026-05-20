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

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getAllArticles, getAllCategories } from '@/lib/articles'
import { analyzeDays, ELEMENT_COLOR } from '@/lib/bazi-daily'
import type { Element } from '@/lib/bazi-daily'
import CategoryBadge from '@/components/ui/CategoryBadge'

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

  // 當日能量
  const [today] = analyzeDays(1)
  const mainColor = ELEMENT_COLOR[today.dominantElements[0]]
  const hasChong = today.interactions.some(i => i.type === '沖')
  const hasHe = today.interactions.some(i => i.type === '合')

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-10 left-10 text-[200px] font-black text-white leading-none opacity-[0.04] md:opacity-[0.07]">甲</div>
          <div className="absolute bottom-20 right-16 text-[160px] font-black text-[#C9A84C] leading-none opacity-[0.04] md:opacity-[0.06]">命</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-black text-white leading-none opacity-[0.025] md:opacity-[0.04]">乾</div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-24">

            {/* Left: Text */}
            <div className="flex-1">
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

            {/* Right: Avatar (desktop) */}
            <div className="hidden lg:flex flex-shrink-0 items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-[#C9A84C]/[0.07] blur-3xl pointer-events-none" />
                <div className="relative w-64 h-64 xl:w-72 xl:h-72 rounded-full overflow-hidden ring-1 ring-[#C9A84C]/25">
                  <img src="/images/avatar.png" alt="陳卓賢 @destiny.solver" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#0A0A20] border border-white/10 rounded px-4 py-2 whitespace-nowrap">
                  <p className="text-white text-xs font-semibold text-center">陳卓賢</p>
                  <p className="text-[#C9A84C] text-[10px] text-center tracking-wider">@destiny.solver</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 當日能量 ── */}
      <section className="border-y border-white/8 py-10" style={{ background: `${mainColor}06` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">

            {/* 日柱 + 基本信息 */}
            <div className="flex items-center gap-5 flex-shrink-0">
              {/* 日柱字 */}
              <div
                className="flex flex-col items-center justify-center w-16 h-20 rounded border flex-shrink-0"
                style={{ borderColor: `${mainColor}50`, background: `${mainColor}12` }}
              >
                <span className="font-serif font-black text-4xl leading-none" style={{ color: mainColor }}>
                  {today.dayPillar.stem}
                </span>
                <span className="font-serif font-bold text-3xl leading-none text-white/75">
                  {today.dayPillar.branch}
                </span>
              </div>

              {/* 標題區 */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold tracking-[0.3em] text-white/35 uppercase">TODAY</span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/35 text-[11px]">{today.dateLabel} {today.weekday}</span>
                </div>
                <p className="font-serif text-white font-black text-xl leading-snug" style={{ color: mainColor }}>
                  {today.energyTitle}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {/* 三柱小標 */}
                  {[
                    { label: '年', pillar: today.yearPillar },
                    { label: '月', pillar: today.monthPillar },
                    { label: '日', pillar: today.dayPillar },
                  ].map(({ label, pillar }) => (
                    <span key={label} className="text-[11px] text-white/40">
                      {label}
                      <span className="font-semibold ml-0.5" style={{ color: ELEMENT_COLOR[pillar.element] }}>
                        {pillar.stem}{pillar.branch}
                      </span>
                    </span>
                  ))}
                  {hasChong && (
                    <span className="text-[10px] border rounded-full px-1.5 py-0.5 text-[#E06B50] border-[#E06B50]/30">沖</span>
                  )}
                  {hasHe && (
                    <span className="text-[10px] border rounded-full px-1.5 py-0.5 text-[#5CAD7A] border-[#5CAD7A]/30">合</span>
                  )}
                </div>
              </div>
            </div>

            {/* 分隔線（桌面） */}
            <div className="hidden lg:block w-px h-20 bg-white/10 flex-shrink-0" />

            {/* 宜 */}
            <div className="flex-1">
              <p className="text-[#5CAD7A] text-[10px] font-semibold tracking-widest mb-2">今日宜</p>
              <div className="flex flex-wrap gap-2">
                {today.yi.slice(0, 5).map((y, i) => (
                  <span
                    key={i}
                    className="text-xs text-white/65 border border-white/10 rounded-full px-3 py-1"
                  >
                    {y.item}
                  </span>
                ))}
              </div>
            </div>

            {/* 不宜 */}
            <div className="flex-1 lg:max-w-[220px]">
              <p className="text-[#E06B50] text-[10px] font-semibold tracking-widest mb-2">今日不宜</p>
              <div className="flex flex-wrap gap-2">
                {today.buYi.slice(0, 3).map((b, i) => (
                  <span
                    key={i}
                    className="text-xs text-white/50 border border-white/8 rounded-full px-3 py-1"
                  >
                    {b.item}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/daily"
              className="flex-shrink-0 flex items-center gap-2 border font-semibold text-sm px-5 py-3 rounded transition-colors hover:text-white whitespace-nowrap"
              style={{
                borderColor: `${mainColor}50`,
                color: mainColor,
              }}
            >
              完整分析 <ArrowRight size={15} />
            </Link>

          </div>
        </div>
      </section>

      {/* ── Learning Path ── */}
      <section className="bg-white/3 border-b border-white/8 py-14">
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

      {/* ── Bazi Calculator CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Link href="/bazi" className="group block border border-[#C9A84C]/25 hover:border-[#C9A84C]/60 rounded-sm p-10 sm:p-14 relative overflow-hidden transition-colors">
          <div className="absolute right-8 bottom-0 text-[200px] font-black text-[#C9A84C] opacity-[0.04] leading-none select-none pointer-events-none font-serif">命</div>
          <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight size={20} className="text-[#C9A84C]" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-8">
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 border border-[#C9A84C]/40 rounded flex flex-col items-center justify-center bg-[#C9A84C]/[0.06]">
              <span className="font-serif font-black text-4xl sm:text-5xl text-[#C9A84C] leading-none">八</span>
              <span className="text-[#C9A84C]/60 text-[10px] tracking-widest mt-1">字</span>
            </div>
            <div className="flex-1">
              <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.35em] uppercase mb-2">Free Tool</p>
              <h2 className="font-serif text-white text-2xl sm:text-3xl font-black mb-3 group-hover:text-[#C9A84C] transition-colors">
                免費八字排盤
              </h2>
              <p className="text-white/50 text-sm leading-relaxed max-w-lg">
                輸入出生年月日時，即時排出四柱命盤、十神及十個大運。讀懂你的命局結構，是認識自己的第一步。
              </p>
            </div>
          </div>
        </Link>
      </section>

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

      {/* ── Threads ── */}
      <section className="border-y border-[#C9A84C]/20 bg-[#C9A84C]/[0.04] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#C9A84C]/40 flex-shrink-0">
              <img src="/images/avatar.png" alt="@destiny.solver" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2 flex-wrap">
                <p className="text-white font-bold text-base">陳卓賢</p>
                <span className="text-white/30">·</span>
                <p className="text-[#C9A84C] font-semibold text-sm">@destiny.solver</p>
                <span className="text-white/40 text-[11px] border border-white/15 px-2 py-0.5 rounded-full">
                  3.5K 追蹤者
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-lg">
                每日分享命理洞察、實案分析與五行思考。在 Threads 了解最新動態。
              </p>
            </div>
            <a
              href="https://www.threads.com/@destiny.solver"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-[#C9A84C] hover:bg-[#B8963B] text-[#0F0F2D] font-bold text-sm px-7 py-3.5 rounded transition-colors whitespace-nowrap"
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

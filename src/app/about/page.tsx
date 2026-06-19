import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Users, CalendarDays, MessageCircle, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: '關於我',
  description: '香港八字命理師陳卓賢，融合東方命理與現代心理學，用命理幫助你認識真實的自己。',
  alternates: { canonical: '/about' },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: '陳卓賢',
  alternateName: '命運解決師',
  url: 'https://destiny-solver-blog.vercel.app/about',
  jobTitle: '八字命理師',
  description: '香港八字命理研究者與諮詢師，融合東方命理與現代心理學，用命理幫助人認識真實的自己。',
  image: 'https://destiny-solver-blog.vercel.app/images/avatar.png',
  email: 'michaelchan.gezi@gmail.com',
  sameAs: [
    'https://www.threads.com/@destiny.solver',
    'https://www.instagram.com/destiny.solver',
  ],
  knowsAbout: ['八字命理', '五行哲學', '十神', '大運流年', '吠陀占星', '中國傳統命理'],
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://destiny-solver-blog.vercel.app/about',
  },
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* ── Header ── */}
      <div className="mb-16">
        <p className="text-[#B23E26] text-xs font-semibold tracking-[0.35em] uppercase mb-4">ABOUT</p>
        <h1 className="font-serif text-[#2B241C] text-4xl sm:text-5xl font-black mb-6 leading-tight">
          關於<br />
          <span className="text-[#B23E26]">陳卓賢</span>
        </h1>
        <p className="text-[#6B6155] text-lg leading-relaxed max-w-xl">
          命理不是算命，是一套關於人的深度語言。
        </p>
      </div>

      {/* ── Identity block ── */}
      <div className="border border-[#2B241C]/10 rounded-md p-8 mb-12 relative overflow-hidden">
        <div className="absolute right-6 bottom-0 text-[150px] font-black text-[#B23E26]/[0.04] leading-none select-none pointer-events-none">
          命
        </div>
        <div className="relative">
          <div className="mb-6">
            <h2 className="text-[#2B241C] text-2xl font-bold mb-1">陳卓賢</h2>
            <p className="text-[#B23E26] text-sm tracking-wider">命運解決師 · @destiny.solver · 香港</p>
          </div>
          <div className="space-y-4 text-[#5A5247] leading-relaxed text-[15px]">
            <p>
              香港的八字命理研究者與諮詢師。我的核心信念是：
              <strong className="text-[#3A332A]"> 命理是認識自己的工具，而非預測命運的水晶球。</strong>
            </p>
            <p>
              多年來，我深入研究八字、吠陀占星與五行哲學，將東方古典智慧與現代心理學框架結合，
              幫助學員和客戶看見自身的能量結構、格局層次，以及如何在人生不同的時間節點做出更好的決策。
            </p>
            <p>
              我相信，真正的命理諮詢應該讓你離開時比來時更清晰、更有力量——而不是更焦慮、更依賴。
            </p>
          </div>
        </div>
      </div>

      {/* ── Core belief quote ── */}
      <div className="mb-14">
        <blockquote className="border-l-2 border-[#B23E26] pl-6 py-2">
          <p className="font-serif text-[#3A332A] italic text-xl sm:text-2xl leading-relaxed">
            「命理告訴你你是誰，<br className="sm:hidden" />不是你會怎樣。」
          </p>
        </blockquote>
      </div>

      {/* ── Highlights ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
        {[
          {
            icon: BookOpen,
            value: '38+',
            title: '深度文章',
            desc: '從十天干地支到大運流年，系統建立你的八字框架',
          },
          {
            icon: Users,
            value: '100萬+',
            title: 'Threads 月瀏覽量',
            desc: '每日在 Threads 分享命理洞察，每月逾百萬次瀏覽',
          },
          {
            icon: CalendarDays,
            value: '每週',
            title: '更新命理文章',
            desc: '每週穩定發布深度命理文章，持續為你建立八字知識體系',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-[#FBF7EE] border border-[#2B241C]/10 rounded-md p-6 text-center"
          >
            <item.icon className="mx-auto mb-3 text-[#B23E26]" size={24} />
            <p className="text-[#2B241C] font-black text-2xl mb-1">{item.value}</p>
            <p className="text-[#5A5247] font-semibold text-sm mb-2">{item.title}</p>
            <p className="text-[#8A8071] text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Philosophy ── */}
      <div className="mb-14">
        <h2 className="font-serif text-[#2B241C] text-2xl font-bold mb-8">命理哲學</h2>
        <div className="space-y-6">
          {[
            {
              title: '命理是地形圖，不是命令書',
              body: '八字告訴你的能量結構——你的優勢、盲點、與人互動的模式，以及在不同時間節點的機遇與挑戰。但怎麼走，永遠是你自己決定的。',
            },
            {
              title: '類象思維，而非死記公式',
              body: '我的教學方式著重「類象思維」：不背公式，而是學會用五行的象去理解人事物，讓命理成為一套可以活用的思維系統。',
            },
            {
              title: '清醒的認識，比模糊的安慰更有價值',
              body: '真正的命理諮詢應該讓你離開時更清晰、更有力量。我不會用模稜兩可的說法讓你感覺良好——我希望你帶著具體的視角和行動方向回去。',
            },
          ].map((p) => (
            <div key={p.title} className="border-l border-[#2B241C]/10 pl-6">
              <h3 className="text-[#2B241C] font-semibold mb-2">{p.title}</h3>
              <p className="text-[#6B6155] text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Connect ── */}
      <div className="mb-14">
        <h2 className="font-serif text-[#2B241C] text-2xl font-bold mb-6">聯絡方式</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://www.threads.com/@destiny.solver"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-[#2B241C]/15 hover:border-[#B23E26]/50 text-[#6B6155] hover:text-[#B23E26] px-5 py-3 rounded text-sm transition-colors"
          >
            <MessageCircle size={16} />
            Threads @destiny.solver
          </a>
          <a
            href="mailto:michaelchan.gezi@gmail.com"
            className="flex items-center gap-2 border border-[#2B241C]/15 hover:border-[#B23E26]/50 text-[#6B6155] hover:text-[#B23E26] px-5 py-3 rounded text-sm transition-colors"
          >
            <Mail size={16} />
            michaelchan.gezi@gmail.com
          </a>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="border border-[#B23E26]/20 rounded-sm p-8 sm:p-10 text-center relative overflow-hidden">
        <div className="absolute right-4 bottom-0 text-[120px] font-black text-[#B23E26]/[0.04] leading-none select-none pointer-events-none">
          解
        </div>
        <h2 className="font-serif text-[#2B241C] text-2xl font-bold mb-3">想開始認識自己的命盤？</h2>
        <p className="text-[#6B6155] mb-6 text-sm leading-relaxed">
          從免費深度文章開始，或直接預約一對一命盤解讀。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/categories"
            className="flex items-center gap-2 bg-[#B23E26] hover:bg-[#96321E] text-[#F7F1E5] font-bold px-6 py-3 rounded transition-colors text-sm"
          >
            開始閱讀 <ArrowRight size={15} />
          </Link>
          <Link
            href="/consultation"
            className="flex items-center gap-2 border border-[#2B241C]/15 hover:border-[#B23E26]/50 text-[#5A5247] hover:text-[#2B241C] font-medium px-6 py-3 rounded transition-colors text-sm"
          >
            預約諮詢
          </Link>
        </div>
      </div>
    </div>
  )
}

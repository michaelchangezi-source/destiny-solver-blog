import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: '關於我',
  description: '香港八字命理師陳卓賢，融合東方命理與現代心理學，用命理幫助你認識真實的自己。',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-16 text-center">
        <p className="text-[#C9A84C] text-sm font-semibold tracking-widest mb-4">ABOUT</p>
        <h1 className="text-white text-4xl sm:text-5xl font-black mb-6">關於我</h1>
        <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
          命理不是算命，是一套關於人的深度語言。
        </p>
      </div>

      {/* Bio */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-16 h-16 bg-[#C9A84C]/20 border border-[#C9A84C]/30 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#C9A84C] text-2xl font-black">陳</span>
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold">陳卓賢</h2>
            <p className="text-[#C9A84C] text-sm tracking-wider">命運解決師 · @destiny.solver</p>
          </div>
        </div>
        <div className="space-y-4 text-white/65 leading-relaxed">
          <p>
            我是陳卓賢，香港的八字命理研究者與諮詢師。我的核心信念是：
            <strong className="text-white">命理是認識自己的工具，而非預測命運的水晶球。</strong>
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

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon: BookOpen,
            title: '系統教學',
            desc: '38+ 篇深度文章，從十天干地支到大運流年，系統建立你的八字框架',
          },
          {
            icon: Award,
            title: '媒體認可',
            desc: '曾獲媒體報導，並在多個平台進行命理講座與 AI 教育分享',
          },
          {
            icon: Users,
            title: '社群陪伴',
            desc: '在 Threads 建立 3,500+ 人的命理社群，每日分享命理洞察',
          },
        ].map((item) => (
          <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-[#C9A84C]/30 transition-colors">
            <item.icon className="mx-auto mb-3 text-[#C9A84C]" size={28} />
            <h3 className="text-white font-bold mb-2">{item.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Philosophy */}
      <div className="mb-16">
        <h2 className="text-white text-2xl font-bold mb-6">我的命理哲學</h2>
        <div className="space-y-6 text-white/65 leading-relaxed">
          <blockquote className="border-l-4 border-[#C9A84C] pl-6 bg-white/5 py-4 pr-4 rounded-r-xl">
            <p className="text-white/80 italic text-lg">
              「命理告訴你你是誰，不是你會怎樣。」
            </p>
          </blockquote>
          <p>
            八字命理的核心，是五行的能量結構分析。每個人的出生時刻，記錄了一組獨特的天干地支組合，
            構成了你的能量藍圖——你的優勢、盲點、與人互動的模式，以及在不同時間節點的機遇與挑戰。
          </p>
          <p>
            我的教學方式著重「類象思維」：不背公式，而是學會用五行的象去理解人事物，
            讓命理成為一套可以活用的思維系統。
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-br from-[#C9A84C]/15 to-transparent border border-[#C9A84C]/25 rounded-3xl p-10">
        <h2 className="text-white text-2xl font-bold mb-3">想開始認識自己的命盤？</h2>
        <p className="text-white/50 mb-6">從免費文章開始，或直接預約一對一深度解讀。</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/articles"
            className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8963B] text-[#0F0F2D] font-bold px-6 py-3 rounded-full transition-colors"
          >
            開始閱讀 <ArrowRight size={16} />
          </Link>
          <Link
            href="/consultation"
            className="flex items-center gap-2 border border-white/20 hover:border-[#C9A84C]/60 text-white/80 font-medium px-6 py-3 rounded-full transition-colors"
          >
            預約諮詢
          </Link>
        </div>
      </div>
    </div>
  )
}

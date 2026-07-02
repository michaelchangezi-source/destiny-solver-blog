import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, Instagram, ArrowRight } from 'lucide-react'

/**
 * 文章末「關於作者」框（B1 / E-E-A-T）。
 * 每篇都讓讀者與答案引擎見到作者實體（陳卓賢），連去 /about 權威頁，強化信任訊號。
 */
export default function AuthorBio() {
  return (
    <aside className="mt-12 border border-[#2B241C]/10 rounded-2xl bg-[#F4EEE1] p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
        <Link href="/about" className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-full overflow-hidden ring-1 ring-[#B23E26]/25">
          <Image
            src="/images/avatar.png"
            alt="陳卓賢 @destiny.solver"
            fill
            sizes="80px"
            className="object-cover"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-[#6B6155] text-[11px] font-semibold tracking-[0.25em] uppercase mb-1">關於作者</p>
          <Link href="/about" className="inline-flex items-baseline gap-2 group">
            <span className="text-[#2B241C] text-lg font-bold group-hover:text-[#B23E26] transition-colors">陳卓賢</span>
            <span className="text-[#B23E26] text-xs tracking-wider">命運解決師 · 香港八字命理師</span>
          </Link>
          <p className="text-[#5A5247] text-sm leading-relaxed mt-2">
            深入八字、十神、大運流年與盲派命理，以「做功、去向、能量交換」三維度解讀命局。主張命理是認識自己的工具，而非預測命運的水晶球。
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm">
            <a
              href="https://www.threads.com/@destiny.solver"
              target="_blank"
              rel="me noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#6B6155] hover:text-[#B23E26] transition-colors"
            >
              <MessageCircle size={14} /> Threads
            </a>
            <a
              href="https://www.instagram.com/destiny.solver"
              target="_blank"
              rel="me noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#6B6155] hover:text-[#B23E26] transition-colors"
            >
              <Instagram size={14} /> Instagram
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-[#B23E26] font-semibold hover:gap-1.5 transition-all"
            >
              認識作者 <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}

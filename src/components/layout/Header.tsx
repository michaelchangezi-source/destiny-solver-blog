'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { CATEGORY_ORDER, CATEGORY_SLUGS } from '@/types'

export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/95 backdrop-blur-sm border-b border-[#2B241C]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo：公仔頭像升格做 logo mark（§2） */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative w-[38px] h-[38px] flex-shrink-0 rounded-full overflow-hidden border-[1.5px] border-[#B23E26]/25">
            <Image src="/images/avatar.png" alt="命運解決師" fill sizes="38px" className="object-cover" />
          </span>
          <div className="leading-tight">
            <p className="text-[#2B241C] text-sm font-semibold tracking-widest">命運解決師</p>
            <p className="text-[#8A8071] text-[10px] tracking-widest uppercase">Destiny Solver</p>
          </div>
        </Link>

        {/* Desktop Nav：文章／每日能量／排盤工具／關於我／立即諮詢（§6） */}
        <nav className="hidden md:flex items-center gap-7">
          {/* 文章：hover 兩欄分類選單 */}
          <div className="group nav-dropdown-trigger relative flex items-center h-16">
            <Link
              href="/latest"
              className={`flex items-center gap-1 text-sm tracking-wide transition-colors duration-200 ${
                isActive('/latest') || isActive('/articles') || isActive('/categories')
                  ? 'text-[#B23E26]'
                  : 'text-[#5A5247] hover:text-[#B23E26]'
              }`}
            >
              文章 <span className="text-[10px] text-[#8A8071]">▾</span>
            </Link>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute top-full left-1/2 -translate-x-1/2 z-[60] bg-[#FFFFFF] border border-[#2B241C]/10 rounded-xl p-2.5 grid grid-cols-2 gap-0.5 w-[300px] shadow-[0_28px_70px_-16px_rgba(43,36,28,0.45)]">
              {CATEGORY_ORDER.map((cat) => (
                <Link
                  key={cat}
                  href={`/categories/${CATEGORY_SLUGS[cat]}`}
                  className="px-3.5 py-2 rounded-lg text-[13.5px] text-[#2B241C] whitespace-nowrap hover:bg-[#F4EEE1] hover:text-[#B23E26] transition-colors"
                >
                  {cat}
                </Link>
              ))}
              <Link
                href="/latest"
                className="col-span-2 border-t border-[#2B241C]/10 mt-1.5 pt-2.5 text-center font-bold text-[#B23E26] text-[13px]"
              >
                全部最新文章 →
              </Link>
            </div>
          </div>

          <Link
            href="/daily"
            className={`text-sm tracking-wide transition-colors duration-200 ${
              isActive('/daily') ? 'text-[#B23E26]' : 'text-[#5A5247] hover:text-[#B23E26]'
            }`}
          >
            每日能量
          </Link>

          {/* 排盤工具：hover 單欄選單 */}
          <div className="group nav-dropdown-trigger relative flex items-center h-16">
            <Link
              href="/bazi"
              className={`flex items-center gap-1 text-sm tracking-wide transition-colors duration-200 ${
                isActive('/bazi') || isActive('/compat') ? 'text-[#B23E26]' : 'text-[#5A5247] hover:text-[#B23E26]'
              }`}
            >
              排盤工具 <span className="text-[10px] text-[#8A8071]">▾</span>
            </Link>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute top-full left-1/2 -translate-x-1/2 z-[60] bg-[#FFFFFF] border border-[#2B241C]/10 rounded-xl p-2.5 flex flex-col gap-0.5 w-[180px] shadow-[0_28px_70px_-16px_rgba(43,36,28,0.45)]">
              <Link href="/bazi" className="px-3.5 py-2 rounded-lg text-[13.5px] text-[#2B241C] whitespace-nowrap hover:bg-[#F4EEE1] hover:text-[#B23E26] transition-colors">
                免費八字排盤
              </Link>
              <Link href="/compat" className="px-3.5 py-2 rounded-lg text-[13.5px] text-[#2B241C] whitespace-nowrap hover:bg-[#F4EEE1] hover:text-[#B23E26] transition-colors">
                八字合盤
              </Link>
            </div>
          </div>

          <Link
            href="/about"
            className={`text-sm tracking-wide transition-colors duration-200 ${
              isActive('/about') ? 'text-[#B23E26]' : 'text-[#5A5247] hover:text-[#B23E26]'
            }`}
          >
            關於我
          </Link>

          <Link
            href="/articles"
            aria-label="搜尋文章"
            className={`transition-colors duration-200 ${
              isActive('/articles') ? 'text-[#B23E26]' : 'text-[#5A5247] hover:text-[#B23E26]'
            }`}
          >
            <Search size={18} />
          </Link>

          <Link
            href="/consultation"
            className="bg-[#E0552C] hover:bg-[#C9461F] text-[#FBF7EE] text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 active:scale-[0.97]"
          >
            立即諮詢
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#2B241C] hover:text-[#B23E26]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu：hamburger 展開（唔用 hover） */}
      {open && (
        <div className="md:hidden bg-[#FAFAF8] border-t border-[#2B241C]/10 px-4 py-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          <Link href="/latest" onClick={() => setOpen(false)} className="text-base tracking-wide text-[#5A5247] hover:text-[#B23E26] transition-colors font-semibold">
            文章
          </Link>
          <div className="grid grid-cols-2 gap-2 pl-3">
            {CATEGORY_ORDER.map((cat) => (
              <Link
                key={cat}
                href={`/categories/${CATEGORY_SLUGS[cat]}`}
                onClick={() => setOpen(false)}
                className="text-[13px] text-[#6B6155] hover:text-[#B23E26] transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>

          <Link href="/daily" onClick={() => setOpen(false)} className="text-base tracking-wide text-[#5A5247] hover:text-[#B23E26] transition-colors">
            每日能量
          </Link>

          <span className="text-base tracking-wide text-[#5A5247] font-semibold">排盤工具</span>
          <div className="flex flex-col gap-2 pl-3">
            <Link href="/bazi" onClick={() => setOpen(false)} className="text-[13px] text-[#6B6155] hover:text-[#B23E26] transition-colors">
              免費八字排盤
            </Link>
            <Link href="/compat" onClick={() => setOpen(false)} className="text-[13px] text-[#6B6155] hover:text-[#B23E26] transition-colors">
              八字合盤
            </Link>
          </div>

          <Link href="/about" onClick={() => setOpen(false)} className="text-base tracking-wide text-[#5A5247] hover:text-[#B23E26] transition-colors">
            關於我
          </Link>
          <Link
            href="/articles"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-base tracking-wide text-[#5A5247] hover:text-[#B23E26] transition-colors"
          >
            <Search size={16} /> 搜尋文章
          </Link>
          <Link
            href="/consultation"
            onClick={() => setOpen(false)}
            className="bg-[#E0552C] text-[#FBF7EE] text-sm font-semibold px-4 py-3 rounded-lg text-center mt-2"
          >
            立即諮詢
          </Link>
        </div>
      )}
    </header>
  )
}

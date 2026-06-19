'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/latest', label: '最新文章' },
  { href: '/daily', label: '每日能量' },
  { href: '/bazi', label: '八字排盤' },
  { href: '/compat', label: '八字合盤' },
  { href: '/categories', label: '學習路徑' },
  { href: '/about', label: '關於我' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F4EEE1]/95 backdrop-blur-sm border-b border-[#2B241C]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-[#B23E26] text-2xl font-bold tracking-wider">命</span>
          <div className="leading-tight">
            <p className="text-[#2B241C] text-sm font-semibold tracking-widest">命運解決師</p>
            <p className="text-[#8A8071] text-[10px] tracking-widest uppercase">Destiny Solver</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#5A5247] hover:text-[#B23E26] text-sm tracking-wide transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/consultation"
            className="bg-[#B23E26] hover:bg-[#96321E] text-[#F7F1E5] text-sm font-semibold px-4 py-2 rounded transition-colors duration-200"
          >
            立即諮詢
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#3A332A] hover:text-[#2B241C]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#F4EEE1] border-t border-[#2B241C]/10 px-4 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[#5A5247] hover:text-[#B23E26] text-base tracking-wide transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/consultation"
            onClick={() => setOpen(false)}
            className="bg-[#B23E26] text-[#F7F1E5] text-sm font-semibold px-4 py-3 rounded text-center mt-2"
          >
            立即諮詢
          </Link>
        </div>
      )}
    </header>
  )
}

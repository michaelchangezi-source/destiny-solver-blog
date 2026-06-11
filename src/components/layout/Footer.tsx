import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1E1A15] border-t border-white/10 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#CC5C3F] text-2xl font-bold">命</span>
              <span className="text-white font-semibold tracking-widest">命運解決師</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              用命理讀懂你這個人：<br />
              不是預測命運，是認識自己。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-4 tracking-wide">快速連結</h4>
            <ul className="space-y-2">
              {[
                { href: '/categories', label: '學習路徑' },
                { href: '/about', label: '關於我' },
                { href: '/consultation', label: '預約諮詢' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-[#CC5C3F] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-4 tracking-wide">聯絡我</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.threads.com/@destiny.solver"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-[#CC5C3F] text-sm transition-colors flex items-center gap-2"
                >
                  <span>Threads @destiny.solver</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:michaelchan.gezi@gmail.com"
                  className="text-white/50 hover:text-[#CC5C3F] text-sm transition-colors"
                >
                  michaelchan.gezi@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/30 text-xs">
          © {new Date().getFullYear()} 命運解決師｜陳卓賢. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

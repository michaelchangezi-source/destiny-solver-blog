import Link from 'next/link'
import SubscribeForm from '@/components/SubscribeForm'

export default function Footer() {
  return (
    <footer className="bg-[#FBF7EE] border-t border-[#2B241C]/10 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* 電郵訂閱 */}
        <div className="mb-10 pb-10 border-b border-[#2B241C]/10 flex flex-col md:flex-row md:items-center gap-5 md:gap-10">
          <div className="md:flex-1">
            <h4 className="text-[#2B241C] font-semibold tracking-wide mb-1">訂閱命理電子報</h4>
            <p className="text-[#6B6155] text-sm leading-relaxed">
              新文章與每日能量，直接送到你的信箱。不發廣告，隨時可退訂。
            </p>
          </div>
          <div className="md:w-[380px]">
            <SubscribeForm variant="compact" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#B23E26] text-2xl font-bold">命</span>
              <span className="text-[#2B241C] font-semibold tracking-widest">命運解決師</span>
            </div>
            <p className="text-[#6B6155] text-sm leading-relaxed">
              用命理讀懂你這個人：<br />
              不是預測命運，是認識自己。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[#3A332A] text-sm font-semibold mb-4 tracking-wide">快速連結</h4>
            <ul className="space-y-2">
              {[
                { href: '/articles', label: '搜尋文章' },
                { href: '/categories', label: '學習路徑' },
                { href: '/about', label: '關於我' },
                { href: '/consultation', label: '預約諮詢' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#6B6155] hover:text-[#B23E26] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/feed.xml"
                  className="text-[#6B6155] hover:text-[#B23E26] text-sm transition-colors"
                >
                  RSS 訂閱
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[#3A332A] text-sm font-semibold mb-4 tracking-wide">聯絡我</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.threads.com/@destiny.solver"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="text-[#6B6155] hover:text-[#B23E26] text-sm transition-colors flex items-center gap-2"
                >
                  <span>Threads @destiny.solver</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/destiny.solver"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="text-[#6B6155] hover:text-[#B23E26] text-sm transition-colors flex items-center gap-2"
                >
                  <span>Instagram @destiny.solver</span>
                </a>
              </li>
              <li>
                <a
                  href="https://blog.ulifestyle.com.hk/destinysolver"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="text-[#6B6155] hover:text-[#B23E26] text-sm transition-colors flex items-center gap-2"
                >
                  <span>U Blog 命運解決師</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:michaelchan.gezi@gmail.com"
                  className="text-[#6B6155] hover:text-[#B23E26] text-sm transition-colors"
                >
                  michaelchan.gezi@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2B241C]/10 mt-10 pt-6 text-center text-[#6B6155] text-xs space-y-1">
          <p>© {new Date().getFullYear()} 命運解決師｜陳卓賢. All rights reserved.</p>
          <p>本站所有文章為陳卓賢原創，版權所有。歡迎引用，惟須註明作者及原文連結，未經授權不得全文轉載。</p>
        </div>
      </div>
    </footer>
  )
}

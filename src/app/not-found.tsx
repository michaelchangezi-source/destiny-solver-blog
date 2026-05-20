import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-[#C9A84C] text-8xl font-black opacity-20 mb-6">404</span>
      <h1 className="text-white text-2xl font-bold mb-3">找不到這個頁面</h1>
      <p className="text-white/40 mb-8">也許這個命局尚未顯現。</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8963B] text-[#0F0F2D] font-bold px-6 py-3 rounded-full transition-colors"
      >
        <ArrowLeft size={16} /> 返回首頁
      </Link>
    </div>
  )
}

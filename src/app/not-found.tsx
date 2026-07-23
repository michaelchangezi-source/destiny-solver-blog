import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-[#B23E26] text-8xl font-black opacity-20 mb-6">404</span>
      <h1 className="text-[#2B241C] text-2xl font-bold mb-3">找不到這個頁面</h1>
      <p className="text-[#8A8071] mb-8">也許這個命局尚未顯現。</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#E0552C] hover:bg-[#C9461F] text-[#F7F1E5] font-bold px-6 py-3 rounded-full transition-[background-color,box-shadow,transform] hover:shadow-[0_10px_24px_-10px_rgba(178,62,38,0.55)] active:scale-[0.97]"
      >
        <ArrowLeft size={16} /> 返回首頁
      </Link>
    </div>
  )
}

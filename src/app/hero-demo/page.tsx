import type { Metadata } from 'next'
import InkFlowHero from '@/components/InkFlowHero'

// Demo 頁：唔俾搜尋引擎收錄，唔影響正式 SEO。
export const metadata: Metadata = {
  title: '水墨流光 Hero Demo',
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
}

export default function HeroDemoPage() {
  return <InkFlowHero />
}

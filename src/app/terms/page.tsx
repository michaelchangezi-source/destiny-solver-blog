import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: '服務條款',
  description: '命運解決師網站的使用條款：內容版權、免費工具的使用範圍，以及一對一諮詢服務的說明。',
  alternates: { canonical: '/terms' },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '服務條款', item: `${SITE_URL}/terms` },
  ],
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <h1 className="text-[#2B241C] text-3xl sm:text-4xl font-bold mb-3">服務條款</h1>
      <p className="text-[#8A8071] text-sm mb-10">最後更新：2026 年 8 月 6 日</p>

      <div className="space-y-8 text-[#3A332A] text-sm leading-[1.9]">
        <section>
          <p>
            使用命運解決師網站（destinysolver.com）及其提供的一對一諮詢服務，即表示你同意以下條款。
            本站內容性質與適用範圍，另見
            <Link href="/disclaimer" className="text-[#B23E26] hover:underline">
              免責聲明
            </Link>
            。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">一、內容版權</h2>
          <p>
            本站所有文章、圖片與原創命理分析框架，版權均屬陳卓賢所有。歡迎閱讀、分享及引用，
            惟引用時須註明作者「陳卓賢（命運解決師）」並附上原文連結，未經授權不得全文轉載或作商業用途。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">二、免費工具</h2>
          <p>
            八字排盤、合盤、日運等免費工具僅供參考，計算結果的準確度取決於你輸入的出生日期時間是否正確
            （尤其出生時辰不確定時，命盤判讀可能有落差）。工具結果不構成任何形式的專業意見，使用完全免費，不涉及收費。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">三、一對一諮詢服務</h2>
          <p>
            服務內容、方案與收費請以
            <Link href="/consultation" className="text-[#B23E26] hover:underline">
              預約諮詢頁面
            </Link>
            當時列出的資訊為準。預約經 Threads 私訊、Instagram 私訊或電郵進行，並非透過本站表單提交。
          </p>
          <p className="mt-3">
            付款時點與方式、改期安排、諮詢後追問次數等細節，現階段以雙方預約溝通時直接確認為準，
            日後整理成文字版本後會補充在本頁。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">四、服務性質</h2>
          <p>
            一對一諮詢是命理師的個人專業觀點分享，並非算命保證、醫療診斷、法律意見或財務建議，
            不對你日後基於諮詢內容所作的任何決定負責。詳見
            <Link href="/disclaimer" className="text-[#B23E26] hover:underline">
              免責聲明
            </Link>
            。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">五、條款更新</h2>
          <p>本條款如有重大修訂，會更新頁首日期；服務範圍或收費如有變動，會於網站相關頁面公佈。</p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">六、聯絡我們</h2>
          <p>
            如對本條款有任何疑問，歡迎電郵至{' '}
            <a href="mailto:michaelchan.gezi@gmail.com" className="text-[#B23E26] hover:underline">
              michaelchan.gezi@gmail.com
            </a>
            。
          </p>
        </section>
      </div>
    </div>
  )
}

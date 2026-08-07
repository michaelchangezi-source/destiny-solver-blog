import Link from 'next/link'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '免責聲明',
  description: '命運解決師網站內容性質說明：命理觀點整理與個人心得分享，不構成醫療、法律、財務或心理健康專業意見。',
  path: '/disclaimer',
})

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '免責聲明', item: `${SITE_URL}/disclaimer` },
  ],
}

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <h1 className="text-[#2B241C] text-3xl sm:text-4xl font-bold mb-3">免責聲明</h1>
      <p className="text-[#8A8071] text-sm mb-10">最後更新：2026 年 8 月 6 日</p>

      <div className="space-y-8 text-[#3A332A] text-sm leading-[1.9]">
        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">內容性質</h2>
          <p>
            本站（destinysolver.com）內容，包括文章、免費排盤／合盤／日運工具的輸出結果，以及一對一諮詢服務，
            都是傳統命理學觀點的整理、分析框架與個人心得分享，屬於自我認識與參考的工具。
            這些內容不構成醫療、法律、財務或心理健康方面的專業意見，也不能取代任何持牌專業人士的評估與建議。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">健康相關內容</h2>
          <p>
            本站部分文章（尤其「健康命理」分類）會討論五行、十神與身體臟腑的傳統對應觀點，
            這些說法源自命理學說，並非醫學診斷，也沒有經過醫療專業審核。
            命理分析不能用來判斷疾病、預測病情或死亡時間，更不可作為治療或化解疾病的依據。
            身體如有任何實際不適，請優先諮詢合資格醫生或其他醫療專業人員。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">財務、法律與重大人生決定</h2>
          <p>
            命理分析中涉及財運、事業或人生時機的判斷，僅供思考參考，不構成投資、財務或法律意見。
            移民、置業、創業、訴訟等重大決定，請諮詢相關領域的持牌專業人士（如律師、認可財務顧問），
            不應單憑命理分析作出決定。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">情緒與心理健康</h2>
          <p>
            如你正經歷情緒困擾、長期壓力或其他心理健康問題，命理分析不能替代專業輔導或治療。
            請盡快聯絡合資格的醫護人員、輔導員或相關支援機構尋求協助。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">一對一諮詢服務</h2>
          <p>
            一對一命理諮詢是命理師陳卓賢的個人專業觀點分享，分析基於你提供的出生資料與所述事件，
            結果不保證必然應驗，也不對你日後基於諮詢內容所作的決定承擔法律責任。
            服務詳情請參閱
            <Link href="/consultation" className="text-[#B23E26] hover:underline">
              預約諮詢頁面
            </Link>
            。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">聯絡我們</h2>
          <p>
            如對本聲明有任何疑問，歡迎電郵至{' '}
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

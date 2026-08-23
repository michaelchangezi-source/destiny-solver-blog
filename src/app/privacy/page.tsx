import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '私隱政策',
  description: '命運解決師網站如何處理你的個人資料：電子報訂閱、網站流量統計，以及排盤工具的資料處理方式。',
  path: '/privacy',
})

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '私隱政策', item: `${SITE_URL}/privacy` },
  ],
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <h1 className="text-[#2B241C] text-3xl sm:text-4xl font-bold mb-3">私隱政策</h1>
      <p className="text-[#8A8071] text-sm mb-10">最後更新：2026 年 8 月 6 日</p>

      <div className="space-y-8 text-[#3A332A] text-sm leading-[1.9]">
        <section>
          <p>
            本頁如實說明命運解決師網站（destinysolver.com，營運者：陳卓賢）實際處理個人資料的方式。
            本站規模小，收集的資料本身亦不多，以下逐項列明。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">一、電子報訂閱</h2>
          <p>
            訂閱電子報時，本站會收集你的電郵地址，連同你當時的訪客 IP 位址，一併傳送至第三方電郵服務商
            Buttondown 儲存及處理，用於發送新文章通知與每日能量電郵。IP 位址只用作防止濫發訂閱的防火牆判斷，
            不作其他用途。你可以隨時透過電郵內的退訂連結取消訂閱，退訂後 Buttondown 會停止保留你的訂閱狀態。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">二、網站流量統計</h2>
          <p>
            本站使用 Vercel Analytics 收集匿名網站使用數據（例如瀏覽頁面、大致地區、裝置類型），
            用於了解整體網站表現。此工具不使用追蹤式 Cookie，亦不會用來識別個別訪客身份。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">三、排盤／合盤／日運工具</h2>
          <p>
            免費八字排盤、合盤、日運等工具，所有出生日期時間的計算都在你的瀏覽器內完成，不會傳送到本站伺服器。
            工具內的「命盤收藏」功能，同樣只把資料儲存在您瀏覽器的本機儲存空間（localStorage），
            本站無法讀取、查看或備份這些資料；清除瀏覽器資料或更換裝置，會令您本機儲存的命盤記錄一併消失。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">四、預約一對一諮詢</h2>
          <p>
            本站目前並無內置預約表單。如你透過 Threads 私訊、Instagram 私訊或電郵聯絡預約諮詢，
            你提供的出生資料及對話內容，會分別經由 Meta（Threads / Instagram）或你所使用的電郵服務商處理及儲存，
            受該平台自身的私隱政策約束，不會經過本網站伺服器，本站亦不會另行備份這些對話內容。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">五、第三方服務</h2>
          <p>本站依賴以下第三方服務營運，資料處理受各自的私隱政策約束：</p>
          <ul className="mt-2 space-y-1.5 list-disc list-inside">
            <li>Vercel — 網站託管與流量統計</li>
            <li>Buttondown — 電子報發送與訂閱名單管理</li>
            <li>Meta（Threads / Instagram）— 社交聯絡與私訊預約</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">六、查詢與刪除資料</h2>
          <p>
            如你想查詢、更正或要求刪除本站經 Buttondown 保存的電郵訂閱資料，歡迎電郵至{' '}
            <a href="mailto:michaelchan.gezi@gmail.com" className="text-[#B23E26] hover:underline">
              michaelchan.gezi@gmail.com
            </a>{' '}
            聯絡，會盡快處理。
          </p>
        </section>

        <section>
          <h2 className="text-[#2B241C] text-lg font-bold mb-2">七、政策更新</h2>
          <p>
            本頁內容如有重大變動，會更新頁首日期。如你對個人資料私隱有進一步的法律查詢，建議諮詢合資格法律專業人士。
          </p>
        </section>
      </div>
    </div>
  )
}

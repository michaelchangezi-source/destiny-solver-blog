import { analyzeDays } from '@/lib/bazi-daily'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'
import DailyMeClient from './_components/DailyMeClient'
import type { DayFeedItem } from './_components/DailyMeClient'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: '今日對你｜以你的日柱對照當日流日的每日提示',
  description:
    '輸入出生年月日，計出你的日柱，對照當日流日干支，得出今日這股氣對你是甚麼關係，以及宜與不宜。免費，無需註冊，只儲存日柱不儲存生日。',
  path: '/daily/me',
})

const faq = [
  {
    q: '為甚麼只需要出生年月日，不需要時辰？',
    a: '本功能只用日柱，而日柱由曆日決定，與時辰無關，所以不需要時辰。命理典籍的立場是寧缺不濫，寧可只推六個字，也不要靠猜時辰來補足，因此我們不會要求你猜一個時辰。',
  },
  {
    q: '這是不是在幫我論命？',
    a: '不是。這裡只做日級的引動提示，也就是今日這股氣往哪個方向推你。單憑一柱不足以論命，性格、富貴層次、姻緣、健康這一類判斷，都不是一個日柱答得到的。',
  },
  {
    q: '這個和黃曆上的宜忌有甚麼分別？',
    a: '黃曆的宜忌多以建除十二神與二十八宿為準，本功能則以八字的五行生剋為根本。典籍的立場是五行為根本，建除與宿曜屬於枝葉，兩者衝突時以五行家為準，所以同一天的結論未必一樣。',
  },
  {
    q: '你們會儲存我的出生日期嗎？',
    a: '不會。系統計出日柱之後，只把日柱那兩個字存在你自己的瀏覽器裡，出生日期本身不會被儲存，也不會傳送到任何伺服器。清除瀏覽器資料就會回到輸入畫面。',
  },
  {
    q: '每日甚麼時候換一次？',
    a: '一律以香港時間的曆日為準，過了香港時間的午夜就會換成新一日。不論你身在哪個時區，同一日看到的都是同一個答案。',
  },
  {
    q: '和日運能量那一頁有甚麼分別？',
    a: '日運能量算的是流年、流月、流日三柱的大環境能量，所有人看到的都一樣。這一頁則把當日流日對照你自己的日柱，因此不同日柱的人，同一天看到的結果並不相同。',
  },
]

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '今日對你',
  url: `${SITE_URL}/daily/me`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description:
    '輸入出生年月日計出日柱，對照當日流日干支，得出今日的關係定性與宜忌的免費線上工具。',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HKD' },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '日運能量', item: `${SITE_URL}/daily` },
    { '@type': 'ListItem', position: 3, name: '今日對你', item: `${SITE_URL}/daily/me` },
  ],
}

export default function DailyMePage() {
  // 流日干支的唯一來源是 bazi-daily.ts，與首頁 hero 及 /daily 共用（§3.4）。
  // 傳三日：頁面有 revalidate 快取，快取有可能跨過香港午夜，由 client 挑正確一日。
  const feed: DayFeedItem[] = analyzeDays(3).map(d => ({
    date: `${d.date.getUTCFullYear()}-${String(d.date.getUTCMonth() + 1).padStart(2, '0')}-${String(d.date.getUTCDate()).padStart(2, '0')}`,
    stem: d.dayPillar.stem,
    branch: d.dayPillar.branch,
    label: `${d.dateLabel} ${d.weekday}`,
  }))

  return (
    <div className="pb-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <p className="text-[#B23E26] text-xs font-semibold tracking-[0.35em] uppercase mb-2">DAILY FOR YOU</p>
        <h1 className="font-serif text-[#2B241C] text-4xl font-black mb-3">今日對你</h1>
        <p className="text-[#6B6155] text-sm max-w-2xl leading-relaxed">
          輸入出生年月日，系統計出你的日柱，再對照當日的流日干支，得出今日這股氣對你是甚麼關係，以及宜與不宜。以香港時間為準，免費，無需註冊。
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <DailyMeClient feed={feed} />
      </section>

      {/* 工具說明 */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 space-y-10">
        <div>
          <h2 className="text-[#2B241C] text-xl font-bold mb-4">這裡在算甚麼</h2>
          <p className="text-[#5A5247] text-sm leading-relaxed">
            系統做的事只有三步。第一步，由你的出生年月日計出日柱，也就是代表你本人的那一組干支。第二步，取當日的流日干支，這一組每日換一次，全世界的人都一樣。第三步，把兩組干支放在一起，看當日的天干對你的日干是甚麼關係，當日的地支對你的日支是甚麼關係，前者決定今日這股氣的性質，後者決定它以甚麼方式落到你身上，兩者相乘得出八十種組合，再對應到一句定性與宜忌。日柱本身如果屬於幾種特別的組合，會另外補一句說明。整個判斷是查表得出的，同一日、同一個日柱，答案永遠一樣。
          </p>
        </div>

        <div>
          <h2 className="text-[#2B241C] text-xl font-bold mb-4">這裡不算甚麼</h2>
          <p className="text-[#5A5247] text-sm leading-relaxed">
            日柱只是四柱其中一柱，能夠答的問題有限。典籍的講法是不能單以一柱論命，把單柱的斷語生搬硬套，十次有九次會差。因此這裡不會判斷你是甚麼人，不會講富貴層次或財運高低，也不會斷姻緣、健康與生死。流日在大運、流年、流月、流日這條鏈的最末端，力量在於引動而不在於決定，所以你不會在這裡看到今日一定會怎樣這一類講法。要答一世的問題，需要年月日時四柱齊全，其中時辰是缺不得的一柱。
          </p>
        </div>

        <div>
          <h2 className="text-[#2B241C] text-xl font-bold mb-4">和黃曆的分別</h2>
          <p className="text-[#5A5247] text-sm leading-relaxed">
            坊間的每日宜忌多數出自黃曆，以建除十二神與二十八宿為判斷依據，而且不論是誰，同一天看到的宜忌都一樣。本功能走的是另一條路，用的是八字的五行生剋，而且必定要對照你自己的日柱，因此同一天不同人看到的結果並不相同。典籍在這一點上的立場相當明確，五行是根本，建除與宿曜是枝葉，兩者說法衝突的時候，以五行家為準。
          </p>
        </div>

        <div>
          <h2 className="text-[#2B241C] text-xl font-bold mb-6">常見問題</h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="bg-[#F4EEE1] rounded-lg p-6">
                <p className="text-[#B23E26] text-xs font-semibold tracking-widest mb-2">Q{i + 1}</p>
                <h3 className="text-[#2B241C] font-semibold mb-3">{item.q}</h3>
                <p className="text-[#6B6155] text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

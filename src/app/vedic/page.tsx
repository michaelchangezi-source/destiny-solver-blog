import VedicCalculator from './VedicCalculator'
import { SITE_URL } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: '免費印度占星排盤（吠陀占星）｜十六分盤與大運',
  absoluteTitle: '免費印度占星排盤（吠陀占星）｜十六分盤與大運｜命運解決師 陳卓賢',
  description: '免費印度占星（吠陀占星 Jyotish）排盤：輸入出生日期時間地點，以 Lahiri 恆星黃道計算上升星座、九曜、二十七宿、D1 至 D60 十六分盤（含 D9 婚姻、D10 事業、D24 學業）及 Vimshottari 大運。行星精度對照 Swiss Ephemeris 驗證，城市時區含歷史夏令時間。免登入、免安裝。',
  path: '/vedic',
})

const faq = [
  {
    q: '印度占星和西洋占星有什麼分別？',
    a: '四大分別：一、黃道不同（恆星 vs 回歸），行星位置相差約 24 度；二、吠陀用整宮制及二十七宿，宿的地位與星座同等重要；三、吠陀有十六分盤，同一顆星在不同分盤各有崗位；四、吠陀有 Vimshottari 大運，時間推演是體系核心。西洋占星則長於心理描寫與相位分析，兩者各有所長。',
  },
  {
    q: '出生時間不準確會怎樣？',
    a: '上升星座約每兩小時換一個，出生時間差半小時，上升與整張宮位圖都可能移位；D60 等高階分盤更是每兩分鐘就變一格。如果只知道大概時間，建議輸入 12:00，以不依賴上升的資訊（太陽、月亮星座、二十七宿、大運序）為主要參考。',
  },
  {
    q: '羅睺、計都是什麼？',
    a: '羅睺（Rahu）與計都（Ketu）是月亮軌道與黃道的兩個交點，不是實體行星，永遠相差 180 度。印度占星視之為業力軸線：羅睺代表今生渴求與放大，計都代表前世慣性與放下。這對名字經由佛經傳入中國，唐代《宿曜經》已有記載，所以中文名沿用「羅睺」「計都」。',
  },
  {
    q: '這個工具排得準嗎？',
    a: '行星位置由 VSOP87D 與 ELP 天文級數即時計算，並以 Swiss Ephemeris（國際占星軟件通用的天文引擎）作標準，在 1900 至 2100 年抽樣對照驗證，行星誤差遠小於一個宿步。時區方面，城市選單按 IANA 歷史時區資料庫自動判定，包括香港 1941 至 1979 年的夏令時間，避免了上升點因時區錯一小時而偏移 15 度的常見錯誤。',
  },
  {
    q: '為什麼沒有天王星、海王星、冥王星？',
    a: '古典印度占星只用肉眼可見的七曜加羅睺計都，二十七宿、分盤與大運的規則全部圍繞九曜設計，外行星在這套體系內沒有崗位。想看外行星，可以用本站的西洋占星排盤。',
  },
  {
    q: '這個工具需要付費嗎？',
    a: '不需要。吠陀占星排盤完全免費，免登入免安裝，計算全部在你的瀏覽器本地完成，本站不會儲存你的出生資料。',
  },
]

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '免費印度占星排盤｜命運解決師 陳卓賢',
  url: `${SITE_URL}/vedic`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  description: '免費印度占星（吠陀占星 Jyotish）排盤工具，輸入出生日期時間地點，以 Lahiri 恆星黃道計算上升星座、九曜、二十七宿、十六分盤及 Vimshottari 大運。',
  featureList: ['九曜行星恆星黃道位置', '二十七宿與宿步', '十六分盤（D1 至 D60）', 'Vimshottari 大運時間表', '南印度式與北印度式盤面', '出生 Panchanga（五要素）', '歷史夏令時間自動判定'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HKD' },
  author: { '@type': 'Person', name: '陳卓賢', url: `${SITE_URL}/about` },
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
    { '@type': 'ListItem', position: 2, name: '印度占星排盤', item: `${SITE_URL}/vedic` },
  ],
}

export default function VedicPage() {
  return (
    <main className="pt-24 pb-20 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <p className="text-[#B23E26]/60 text-[10px] tracking-[0.3em] uppercase">Free Tool</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#B23E26] tracking-wider">
            免費印度占星排盤
          </h1>
          <p className="text-[#6B6155] text-sm">印度占星（又稱吠陀占星，梵文 Jyotish）以恆星黃道看本命：輸入出生日期、時間及地點，即時排出上升（Lagna）、九曜行星、二十七宿、十六分盤（D1／D9／D10／D24…）與 Vimshottari 大運時間表。所有計算在瀏覽器本地完成，本站不會儲存任何出生資料。</p>
        </div>

        <VedicCalculator />

        <div className="max-w-3xl mx-auto mt-16 space-y-10">
          {/* 諮詢橋樑 */}
          <section className="bg-[#F4EEE1] border border-[rgba(43,36,28,0.14)] rounded-[14px] p-4 text-[14.5px]">
            排盤只是第一步。吠陀命盤看的是一生結構：大運何時轉、分盤強弱如何疊、二十七宿的性情底色，要成盤合讀才有意義。想深入了解自己的命盤，歡迎預約人手深度諮詢。
            <br />
            <a href="/consultation" className="inline-block mt-2 text-[#B23E26] font-bold">預約八字深度諮詢 →</a>
          </section>

          {/* 排盤口徑與邊界 */}
          <section className="bg-white border border-[rgba(43,36,28,0.14)] rounded-[14px] p-[18px_16px] shadow-[0_1px_2px_rgba(43,36,28,0.04),0_4px_12px_rgba(43,36,28,0.06)]">
            <details>
              <summary className="cursor-pointer text-[14px] text-[#6B6155]">排盤口徑與邊界（供核對）</summary>
              <div className="text-[13.5px] text-[#6B6155] mt-2 leading-[1.9]">
                <p className="m-0 mb-1.5">所有口徑固定如下，方便你或任何解讀者核對：</p>
                <p className="m-0 mb-1.5">
                  ・黃道：恆星黃道（sidereal），ayanamsa 用 Lahiri（Chitrapaksha，印度官方曆算標準），與 Swiss Ephemeris 同口徑。<br />
                  ・行星：古典九曜（日月火水木金土＋羅睺計都），不出天王星海王星冥王星。羅睺預設真交點（可切平均交點），計都恆與羅睺對沖 180°。<br />
                  ・宮制：整宮制（Whole Sign），上升所在星座即第一宮。<br />
                  ・分盤：十六分盤按《BPHS》主流口徑；D2 Hora 用 Parashara 日月二分法；D30 用不等分法。個別分盤各派有變體，以本卡聲明為準。<br />
                  ・大運：Vimshottari，以出生月亮所在宿起運，年長 365.25 日；顯示至副運（Antardasha）層。<br />
                  ・Panchanga：tithi／yoga／karana 以出生瞬間日月黃經計；vara（曜日）以當地日出為界，日出取視太陽上緣（−0°50′）。<br />
                  ・時區：城市選單按 IANA 歷史時區資料庫自動判定（包括香港 1941–1979 夏令時間、中國 1986–1991 夏令時間等）；手動輸入模式用固定時差。夏令時間切換時段出生請用手動輸入指定時差。不用真太陽時（與本站其他排盤工具一致）。<br />
                  ・精度：引擎以 VSOP87D＋ELP 級數自建，對照 Swiss Ephemeris 2.10（Lahiri）在 1900–2100 年抽樣驗證：行星（日水金火木土）&lt; 3″、月亮 &lt; 12″、平均交點 &lt; 0.2″、真交點 &lt; 0.03°、上升點 &lt; 1″（皆為最大誤差）。支援出生年份 1900–2026，緯度 ±66° 內。<br />
                  ・邊界：不出吉凶斷語、不出流年過運（transit）、不出 Ashtakavarga 與 Shadbala 分數。判斷交給你和你信任的解讀者。
                </p>
              </div>
            </details>
          </section>

          {/* SEO 內文 */}
          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">印度占星排盤計算什麼</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              印度占星（Jyotish），又稱吠陀占星，是印度傳統的占星體系，與西洋占星最大的分別在於黃道：西洋用回歸黃道（以春分點為零度），印度占星用恆星黃道（以恆星背景為準），兩者目前相差約 24 度（即 ayanamsa）。工具以 Lahiri ayanamsa 計算上升點（Lagna）與九曜（太陽、月亮、火星、水星、木星、金星、土星、羅睺、計都）的恆星黃道位置，標出每顆星所在的星座、度數、二十七宿（Nakshatra）與宿步（Pada），並以整宮制排出十二宮。行星位置由天文級數即時計算，並經 Swiss Ephemeris 標準對照驗證。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">為什麼我的太陽星座在這裡不同了？</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              因為量度的尺不同。恆星黃道與回歸黃道相差約 24 度，所以大約八成人在吠陀盤中的太陽星座，會比西洋盤退後一個星座（例如西洋獅子座變吠陀巨蟹座）。這不是計錯，而是兩套體系各有自己的參照系：西洋占星以季節（春分點）為準，吠陀占星以恆星天空為準。同一個人可以有兩張盤，讀法不同，不必二選一。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">十六分盤（Varga）怎樣看</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              分盤是吠陀占星的獨門工具：把每個星座再細分，將行星投射到十六張副盤，每張盤主管一個人生領域。最常用的有 D9（Navamsa，配偶婚姻與後半生底力，行星在 D9 的強弱視為「內在真實力量」）、D10（Dasamsa，事業成就與社會地位）、D24（Siddhamsa，學業與知識）、D30（Trimsamsa，災厄與考驗）。本工具十六張分盤（D1 至 D60）齊備，點選盤上方的分盤標籤即可切換；高階分盤（如 D60）每 0.5 度換一格，對出生時間非常敏感，時間不準時請以 D1、D9 為主。
            </p>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">Vimshottari 大運是什麼</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed">
              Vimshottari Dasha 是吠陀占星最通用的大運系統：以出生時月亮所在的宿決定起始行星，九曜輪流值年，一個循環共 120 年（如金星 20 年、土星 19 年、羅睺 18 年）。每個大運（Mahadasha）之內再細分九段副運（Antardasha），大運定主題、副運定節奏。工具會列出你由出生起的完整大運時間表，並以硃紅標示你現在正行的大運與副運，方便對照人生轉折。
            </p>
          </section>

          {/* FAQ */}
          <section>
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
          </section>

          {/* 延伸閱讀 */}
          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-4">延伸閱讀</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="/articles/post-20260828-06" className="text-[#B23E26] hover:underline">印度占星是什麼？和西洋占星有什麼分別</a></li>
              <li><a href="/articles/post-20260828-07" className="text-[#B23E26] hover:underline">恆星黃道與 Ayanamsa 是什麼？為什麼我的太陽星座退後了一個</a></li>
              <li><a href="/articles/post-20260828-08" className="text-[#B23E26] hover:underline">二十七宿（Nakshatra）是什麼？印度占星的月亮星座系統</a></li>
              <li><a href="/articles/post-20260828-09" className="text-[#B23E26] hover:underline">Navamsa（D9）九分盤怎樣看？印度占星最重要的分盤</a></li>
              <li><a href="/articles/post-20260828-10" className="text-[#B23E26] hover:underline">Vimshottari 大運怎樣看？印度占星的 120 年時間表</a></li>
              <li><a href="/articles/post-20260828-11" className="text-[#B23E26] hover:underline">羅睺計都是什麼？真交點與平均交點有什麼分別</a></li>
              <li><a href="/articles/post-20260828-12" className="text-[#B23E26] hover:underline">印度占星可以叫 ChatGPT 分析嗎？AI 做得到與做不到的事</a></li>
            </ul>
          </section>

          {/* 頁腳免責 */}
          <footer className="mt-9 text-[12.5px] text-[#6B6155] border-t border-[rgba(43,36,28,0.14)] pt-3.5">
            本工具只出可核對的盤面結構，不出吉凶斷語；解讀屬命理參考，不構成專業意見。<br />
            © 2026 命運解決師 陳卓賢．本頁文案、引擎（DSVED）與介面均為原創作品，受版權保護；歡迎分享連結，未經授權請勿複製轉載。
          </footer>
        </div>
      </div>
    </main>
  )
}

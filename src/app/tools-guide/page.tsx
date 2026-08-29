import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL } from '@/lib/site'

export const metadata = buildMetadata({
  title: '2026 免費線上排盤工具合集：八字、六爻、奇門、紫微、塔羅（香港適用）',
  description: '2026 年最完整的免費線上排盤工具比較：八字四柱、六爻占卜、奇門遁甲、紫微斗數、塔羅牌、雷諾曼。排準、可核對、問事類支援 AI 解讀資料包，免登入免安裝。',
  path: '/tools-guide',
})

const faq = [
  {
    q: '免費排盤工具準確嗎？',
    a: '準確度取決於工具的算法口徑是否透明可核對。本站工具的節氣引擎採用天文精算法（VSOP87D），與香港天文台廿四節氣公佈時刻誤差在一分鐘內；其他口徑（六爻納甲、奇門局數）均在頁面列明，方便自行核對。',
  },
  {
    q: '網上排盤與手機 App 哪一種較好用？',
    a: '各有優勝之處。網站版毋須下載、毋須更新，直接在瀏覽器開即用，適合臨時查閱；手機 App 通常有本機保存紀錄，適合長期追蹤。如果需要複製資料包貼給 AI，網站版在複製貼上流程上更順暢。',
  },
  {
    q: '排盤結果可以貼給 ChatGPT 解讀嗎？',
    a: '問事類工具（六爻、奇門、塔羅、雷諾曼）有結構化 AI 解讀資料包，一鍵複製後直接貼給 ChatGPT、Claude 或 Gemini 即可。命盤類工具（八字、紫微）涉及格局、大運與應期的立體判斷，AI 難以取代人手分析，建議預約深度諮詢。',
  },
  {
    q: '為什麼不同網站排出的結果有差異？',
    a: '排盤口徑差異是主因。八字的節氣時刻（影響月柱）、奇門的拆補或置閏法、六爻的換日時間（23:00 或 00:00），各站設定不同都會導致結果不同。選擇工具時，優先看口徑是否透明列明，才能核對對錯。',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '2026 免費線上排盤工具合集',
  numberOfItems: 8,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '八字排盤', url: `${SITE_URL}/bazi` },
    { '@type': 'ListItem', position: 2, name: '紫微斗數排盤', url: `${SITE_URL}/ziwei` },
    { '@type': 'ListItem', position: 3, name: '西洋占星排盤', url: `${SITE_URL}/western` },
    { '@type': 'ListItem', position: 4, name: '印度占星排盤', url: `${SITE_URL}/vedic` },
    { '@type': 'ListItem', position: 5, name: '六爻排盤', url: `${SITE_URL}/liuyao` },
    { '@type': 'ListItem', position: 6, name: '奇門遁甲排盤', url: `${SITE_URL}/qimen` },
    { '@type': 'ListItem', position: 7, name: '塔羅占卜', url: `${SITE_URL}/tarot` },
    { '@type': 'ListItem', position: 8, name: '雷諾曼占卜', url: `${SITE_URL}/lenormand` },
  ],
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '排盤工具箱', item: `${SITE_URL}/tools` },
    { '@type': 'ListItem', position: 3, name: '免費排盤工具合集', item: `${SITE_URL}/tools-guide` },
  ],
}

const COMPARISON = [
  { tool: '八字排盤', site: '命運解決師', free: '完全免費', login: '免登入', caliber: '透明（口徑卡列明節氣算法）', ai: '不適用（命盤類建議人手諮詢）', mobile: '良好', href: '/bazi' },
  { tool: '六爻排盤', site: '命運解決師', free: '完全免費', login: '免登入', caliber: '透明（京房納甲、換日 23:00 等逐條列明）', ai: '可複製 AI 資料包', mobile: '良好', href: '/liuyao' },
  { tool: '奇門遁甲', site: '命運解決師', free: '完全免費', login: '免登入', caliber: '透明（拆補法、寄宮等口徑列明）', ai: '可複製 AI 資料包', mobile: '良好', href: '/qimen' },
  { tool: '塔羅占卜', site: '命運解決師', free: '完全免費', login: '免登入', caliber: '透明（逆位解釋方式列明）', ai: '可複製 AI 資料包', mobile: '良好', href: '/tarot' },
  { tool: '雷諾曼占卜', site: '命運解決師', free: '完全免費', login: '免登入', caliber: '透明（組合連讀方式列明）', ai: '可複製 AI 資料包', mobile: '良好', href: '/lenormand' },
  { tool: '紫微斗數', site: '命運解決師', free: '完全免費', login: '免登入', caliber: '透明（飛星派口徑）', ai: '不適用（命盤類建議人手諮詢）', mobile: '良好', href: '/ziwei' },
  { tool: '西洋占星', site: '命運解決師', free: '完全免費', login: '免登入', caliber: '透明（行星度數可核對）', ai: '不適用（命盤類建議人手諮詢）', mobile: '良好', href: '/western' },
  { tool: '印度占星', site: '命運解決師', free: '完全免費', login: '免登入', caliber: '透明（Lahiri ayanamsa、交點口徑列明）', ai: '不適用（命盤類建議人手諮詢）', mobile: '良好', href: '/vedic' },
  { tool: '八字排盤', site: '元亨利貞', free: '大部分免費', login: '部分功能需登入', caliber: '部分口徑未說明', ai: '不支援', mobile: '一般' },
  { tool: '占星排盤', site: 'Astralium', free: '免費', login: '免登入', caliber: '說明較少', ai: '不支援', mobile: '良好' },
]

export default function ToolsGuidePage() {
  return (
    <main className="pt-24 pb-20 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-[#B23E26]/60 text-[10px] tracking-[0.3em] uppercase mb-2">排盤工具指南</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#2B241C] leading-tight mb-4">
            2026 免費線上排盤工具合集
          </h1>
          <p className="text-[#6B6155] text-sm leading-relaxed mb-1">
            八字、六爻、奇門、紫微、塔羅（香港適用）
          </p>
        </div>

        {/* 開場 */}
        <section className="mb-10 prose-sm text-[#5A5247] leading-relaxed space-y-3">
          <p>
            網上免費排盤工具多，但質素參差。挑選工具時，三個最重要的標準是：一、口徑透明可核對，算法清楚列明讓你知道結果是怎樣得出的；二、免登入免安裝，不需要交出個人資料或等待下載；三、輸出格式方便給 AI 解讀，結構化資料讓你可以直接貼去 ChatGPT 或 Claude 深入分析。
          </p>
          <p>
            以下按術數類別整理 2026 年可用的免費排盤工具，誠實收錄本站工具及他站選項，供你按需選擇。
          </p>
        </section>

        {/* 逐術數一節 */}
        <div className="space-y-10 mb-12">

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-3">八字排盤</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed mb-4">
              八字工具的核心是節氣算法：月柱以節氣交節時刻分界，算法不同直接影響月柱結果。合格的工具應列明節氣時刻的計算方式，以及真太陽時是否校正。
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-[#2B241C]/10 bg-[#FFFDF8] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#2B241C] text-sm">命運解決師八字速算</span>
                  <Link href="/bazi" className="text-xs text-[#B23E26] font-semibold hover:underline">試用 →</Link>
                </div>
                <p className="text-xs text-[#6B6155] leading-relaxed">採用天文精算節氣（VSOP87D），與香港天文台廿四節氣誤差在一分鐘內。支援真太陽時校正、神煞、流年流月時間軸、大運起運。深度分析可預約人手諮詢。</p>
              </div>
              <div className="rounded-xl border border-[#2B241C]/10 bg-[#FFFDF8] p-4">
                <span className="font-semibold text-[#2B241C] text-sm">元亨利貞八字排盤</span>
                <p className="text-xs text-[#6B6155] leading-relaxed mt-1">老牌排盤站，界面較舊，部分功能需登入。算法口徑未完整說明，適合快速查閱，但核對難度較高。</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-3">六爻排盤</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed mb-4">
              六爻工具的合格條件：支援京房納甲裝卦、自動標出六親六獸世應旬空月破伏神，以及清楚說明換日時間（23:00 還是 00:00）。只出卦象不給口徑的工具，解讀時難以自我核對。
            </p>
            <div className="rounded-xl border border-[#2B241C]/10 bg-[#FFFDF8] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#2B241C] text-sm">命運解決師六爻排盤</span>
                <Link href="/liuyao" className="text-xs text-[#B23E26] font-semibold hover:underline">試用 →</Link>
              </div>
              <p className="text-xs text-[#6B6155] leading-relaxed">口徑逐條列明（京房納甲、換日 23:00、月建節氣月支），支援實體搖卦錄入與線上起卦，可生成結構化 AI 解讀資料包，是目前可給 AI 解讀的六爻工具中口徑最透明的選項。</p>
            </div>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-3">奇門遁甲排盤</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed mb-4">
              奇門工具的合格條件：能正確處理陰陽遁、三元與拆補定局，並標出空馬刑墓迫等重要訊號。起局方法（拆補或置閏）會影響局數，工具應清楚說明採用哪種口徑。
            </p>
            <div className="rounded-xl border border-[#2B241C]/10 bg-[#FFFDF8] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#2B241C] text-sm">命運解決師奇門遁甲</span>
                <Link href="/qimen" className="text-xs text-[#B23E26] font-semibold hover:underline">試用 →</Link>
              </div>
              <p className="text-xs text-[#6B6155] leading-relaxed">採用轉盤時家拆補法，口徑透明列明，支援年命配盤、空馬刑墓迫標記，可生成 AI 解讀資料包，目前香港地區少數可核對口徑的奇門工具。</p>
            </div>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-3">紫微斗數排盤</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed mb-4">
              紫微工具需注意飛星派或安星法的分別，以及農曆輸入是否正確處理閏月。命盤類工具輸出的是命局結構，建議配合人手解讀而非直接交給 AI。
            </p>
            <div className="rounded-xl border border-[#2B241C]/10 bg-[#FFFDF8] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#2B241C] text-sm">命運解決師紫微斗數</span>
                <Link href="/ziwei" className="text-xs text-[#B23E26] font-semibold hover:underline">試用 →</Link>
              </div>
              <p className="text-xs text-[#6B6155] leading-relaxed">飛星派口徑，輸入農曆生日即時排出十二宮命盤、主星強度、生年四化及大限，適合入門了解自身命格，深度分析建議預約人手諮詢。</p>
            </div>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-3">塔羅牌</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed mb-4">
              塔羅工具需要支援正逆位、提供牌陣位置意義，以及說明逆位的解釋口徑（受阻、內化、延遲等，各家定義不同）。能給 AI 解讀的工具，輸出格式要包含牌陣位置與每張牌的關鍵詞。
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-[#2B241C]/10 bg-[#FFFDF8] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#2B241C] text-sm">命運解決師塔羅占卜</span>
                  <Link href="/tarot" className="text-xs text-[#B23E26] font-semibold hover:underline">試用 →</Link>
                </div>
                <p className="text-xs text-[#6B6155] leading-relaxed">78 張韋特塔羅、正逆位可開關，五種牌陣（單張、三張、愛情、二擇一、凱爾特十字），逆位口徑列明（受阻、內化、延遲、過度），可生成 AI 解讀資料包，目前香港少數支援 AI 資料包的塔羅工具。</p>
              </div>
              <div className="rounded-xl border border-[#2B241C]/10 bg-[#FFFDF8] p-4">
                <span className="font-semibold text-[#2B241C] text-sm">Astralium 塔羅</span>
                <p className="text-xs text-[#6B6155] leading-relaxed mt-1">介面美觀，支援多種牌陣，免登入。但算法口徑說明較少，不支援直接輸出給 AI 解讀的資料包。</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-3">西洋占星排盤</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed mb-4">
              西洋占星以回歸黃道為準，算法的關鍵在於行星位置精度。工具應清楚顯示上升點與各行星度數，供核對。
            </p>
            <div className="rounded-xl border border-[#2B241C]/10 bg-[#FFFDF8] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#2B241C] text-sm">命運解決師西洋占星</span>
                <Link href="/western" className="text-xs text-[#B23E26] font-semibold hover:underline">試用 →</Link>
              </div>
              <p className="text-xs text-[#6B6155] leading-relaxed">即時生成本命盤，列出十大行星星座位置、上升點與天頂、主要相位及元素型態分佈。深度分析建議人手諮詢。</p>
            </div>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-3">印度占星（吠陀）排盤</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed mb-4">
              印度占星（吠陀）排盤工具要合格，先看三樣：有沒有聲明 ayanamsa 版本（恆星黃道的口徑核心）、有沒有處理出生地的歷史夏令時間、分盤齊不齊。
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-[#2B241C]/10 bg-[#FFFDF8] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#2B241C] text-sm">命運解決師印度占星排盤</span>
                  <Link href="/vedic" className="text-xs text-[#B23E26] font-semibold hover:underline">試用 →</Link>
                </div>
                <p className="text-xs text-[#6B6155] leading-relaxed">Lahiri 口徑與交點口徑全部寫明、D1 至 D60 十六分盤齊備、大運顯示至副運層，並自動處理香港 1941 至 1979 年等歷史夏令時間；免費免登入。</p>
              </div>
              <div className="rounded-xl border border-[#2B241C]/10 bg-[#FFFDF8] p-4">
                <span className="font-semibold text-[#2B241C] text-sm">Prokerala</span>
                <p className="text-xs text-[#6B6155] leading-relaxed mt-1">印度老牌排盤站，Lahiri 口徑，功能全面，惟介面為英文。</p>
              </div>
              <div className="rounded-xl border border-[#2B241C]/10 bg-[#FFFDF8] p-4">
                <span className="font-semibold text-[#2B241C] text-sm">知命占星</span>
                <p className="text-xs text-[#6B6155] leading-relaxed mt-1">中文介面，附多張分盤，口徑聲明較簡。</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[#2B241C] text-xl font-bold mb-3">雷諾曼</h2>
            <p className="text-[#5A5247] text-sm leading-relaxed mb-4">
              雷諾曼工具需支援六種以上牌陣（三張、九宮格等），並說明組合連讀而非逐張解牌的解讀方式。給 AI 解讀時，AI 資料包應包含相鄰牌組合的說明提示。
            </p>
            <div className="rounded-xl border border-[#2B241C]/10 bg-[#FFFDF8] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#2B241C] text-sm">命運解決師雷諾曼占卜</span>
                <Link href="/lenormand" className="text-xs text-[#B23E26] font-semibold hover:underline">試用 →</Link>
              </div>
              <p className="text-xs text-[#6B6155] leading-relaxed">36 張 Petit Lenormand，六種牌陣（每日一張、三張、五張、九宮格、二選一、大藍圖），資料包強調組合連讀而非逐張解，可生成 AI 解讀資料包，適合希望善用 AI 解牌的用戶。</p>
            </div>
          </section>
        </div>

        {/* 比較表 */}
        <section className="mb-12">
          <h2 className="text-[#2B241C] text-xl font-bold mb-4">工具比較表</h2>
          <div className="overflow-x-auto rounded-xl border border-[#2B241C]/10">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#F4EEE1]">
                  <th className="px-4 py-3 font-semibold text-[#2B241C]">工具</th>
                  <th className="px-4 py-3 font-semibold text-[#2B241C]">網站</th>
                  <th className="px-4 py-3 font-semibold text-[#2B241C]">免費程度</th>
                  <th className="px-4 py-3 font-semibold text-[#2B241C]">登入要求</th>
                  <th className="px-4 py-3 font-semibold text-[#2B241C]">口徑說明</th>
                  <th className="px-4 py-3 font-semibold text-[#2B241C]">可給 AI 解讀</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className="border-t border-[#2B241C]/10">
                    <td className="px-4 py-3 text-[#2B241C] font-medium whitespace-nowrap">
                      {row.href ? <Link href={row.href} className="text-[#B23E26] hover:underline">{row.tool}</Link> : row.tool}
                    </td>
                    <td className="px-4 py-3 text-[#5A5247]">{row.site}</td>
                    <td className="px-4 py-3 text-[#5A5247]">{row.free}</td>
                    <td className="px-4 py-3 text-[#5A5247]">{row.login}</td>
                    <td className="px-4 py-3 text-[#5A5247]">{row.caliber}</td>
                    <td className="px-4 py-3 text-[#5A5247]">{row.ai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 排盤之後點解讀 */}
        <section className="mb-12 bg-[#FFFDF8] rounded-2xl border border-[#2B241C]/10 p-8">
          <h2 className="text-[#2B241C] text-xl font-bold mb-4">排盤之後如何解讀？</h2>
          <p className="text-[#5A5247] text-sm leading-relaxed mb-4">
            排出結果後有三條路可以走：
          </p>
          <ul className="space-y-3 text-sm text-[#5A5247] leading-relaxed">
            <li>
              <span className="font-semibold text-[#2B241C]">自學：</span>
              本站有大量免費文章從入門到進階，配合工具實排是最省錢的學習方式。
              <Link href="/latest" className="ml-1 text-[#B23E26] hover:underline">瀏覽文章 →</Link>
            </li>
            <li>
              <span className="font-semibold text-[#2B241C]">AI 解讀（適合問事類）：</span>
              六爻、奇門、塔羅、雷諾曼四個工具設有 AI 資料包，複製後貼去 ChatGPT 或 Claude 即可深入分析。
              <Link href="/tools" className="ml-1 text-[#B23E26] hover:underline">查看問事工具 →</Link>
            </li>
            <li>
              <span className="font-semibold text-[#2B241C]">人手諮詢（適合命盤類）：</span>
              八字、紫微斗數等命盤涉及格局、大運與應期的立體判斷，AI 難以取代人手解讀。
              <Link href="/consultation" className="ml-1 text-[#B23E26] hover:underline">預約深度諮詢 →</Link>
            </li>
          </ul>
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
      </div>
    </main>
  )
}

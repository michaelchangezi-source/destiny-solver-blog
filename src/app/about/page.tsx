import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen, Users, CalendarDays, MessageCircle, Mail, Instagram, Linkedin } from 'lucide-react'
import { SITE_URL, PERSON, PERSON_ID } from '@/lib/site'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  absoluteTitle: '關於陳卓賢｜命運解決師．香港八字命理師',
  title: '關於陳卓賢',
  description:
    '陳卓賢，網名「命運解決師」，香港八字命理師、前財經媒體資深編輯，著有七本財經科技著作，兩度獲香港出版雙年獎及誠品年度暢銷書肯定，主修經濟統計學。深入八字、十神、大運流年，用命理幫助你認識真實的自己。',
  path: '/about',
  type: 'profile',
})

// ProfilePage 是 Google 為「人物／創作者個人頁」建議的型別，
// mainEntity 指向 lib/site 的統一 Person 實體，是 Google／AI 認識「陳卓賢是誰」的權威頁。
const profileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/about`,
  url: `${SITE_URL}/about`,
  name: '關於陳卓賢｜命運解決師',
  inLanguage: 'zh-TW',
  mainEntity: PERSON,
}

// 實體型 FAQ：直接回答「陳卓賢是誰」一類查詢，把「陳卓賢＋命運解決師＋命理＋八字」
// 的共現寫進結構化資料，利於 AI 引用與同名區分。需與頁面可見問答一致。
// q / a 保持全名，供 FAQPage JSON-LD 實體識別；displayQ / displayA 供頁面可見顯示
// 型別要明寫：唔寫嘅話 TS 會由實際資料逐個元素推斷出唔同嘅物件型別，
// 令下面用 `'X' in item` 做收窄時，分支有機會被推斷成 never 而報錯
// （2026-08-05 就係咁 build fail 咗）。明寫型別之後，displayQ／displayA
// 屬選填，將來加一條冇 displayA 嘅 FAQ 都唔會再爆。
type AboutFaqItem = { q: string; a: string; displayQ?: string; displayA?: string }
const aboutFaq: AboutFaqItem[] = [
  {
    q: '陳卓賢（命運解決師）是誰？',
    displayQ: '命運解決師是誰？',
    a: '陳卓賢是香港的八字命理師，網名「命運解決師（Destiny Solver）」。他曾任職香港財經媒體逾十年（明報、經濟日報），主修經濟統計學（HKUST 碩士、CUHK 學士），著有七本財經科技著作，兩度獲香港出版雙年獎及誠品年度暢銷書肯定，其後深入八字、十神、大運流年與做功體系，主張命理是認識自己的工具，而非預測命運的水晶球。',
  },
  {
    q: '陳卓賢提供什麼命理服務？',
    displayQ: '提供什麼命理服務？',
    a: '陳卓賢提供一對一八字命理諮詢，涵蓋命格整體解讀、性格與天賦、大運流年時機，以及事業、感情、健康等人生議題的深度分析，並在個人網站、Threads 與 Instagram 持續發表命理文章。',
    displayA: '提供一對一八字命理諮詢，涵蓋命格整體解讀、性格與天賦、大運流年時機，以及事業、感情、健康等人生議題的深度分析，並在個人網站、Threads 與 Instagram 持續發表命理文章。',
  },
  {
    q: '陳卓賢的八字分析方法有什麼特色？',
    displayQ: '八字分析方法有什麼特色？',
    a: '他以「做功、去向、能量交換」三個維度解讀命局，重視類象思維與格局結構，不使用模稜兩可的說法，主張清醒的認識比模糊的安慰更有價值。',
  },
]

const aboutFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: aboutFaq.map(({ q, a }) => ({
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
    { '@type': 'ListItem', position: 2, name: '關於陳卓賢', item: `${SITE_URL}/about` },
  ],
}

const booksJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: '22世紀不再七不思議之科技經濟與產業趨勢',
    author: { '@id': PERSON_ID },
    publisher: { '@type': 'Organization', name: '格子盒作室' },
    inLanguage: 'zh-HK',
    genre: ['商業', '科技趨勢'],
    award: '第四屆香港出版雙年獎（2023年，商業及管理類）',
    url: 'https://www.hkpba.org/awards/2023/4',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: '投資理財超入門！',
    author: { '@id': PERSON_ID },
    publisher: { '@type': 'Organization', name: '格子盒作室' },
    inLanguage: 'zh-HK',
    genre: ['投資', '財經'],
    award: '2022年度香港誠品書店年度暢銷書 TOP100',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: '股票投資 All-in-1',
    author: { '@id': PERSON_ID },
    publisher: { '@type': 'Organization', name: '格子盒作室' },
    isbn: '9789881436832',
    datePublished: '2016-11',
    inLanguage: 'zh-HK',
    genre: ['投資', '財經'],
    url: 'https://www.mybookone.com.hk/page/detail_w/1242679994238484482/%E8%82%A1%E7%A5%A8%E6%8A%95%E8%B3%87All_in_1.html',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutFaqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {booksJsonLd.map((book, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(book) }}
        />
      ))}

      {/* ── Header ── */}
      <div className="mb-16">
        <p className="text-[#B23E26] text-xs font-semibold tracking-[0.35em] uppercase mb-4">ABOUT</p>
        <h1 className="font-serif text-[#2B241C] text-4xl sm:text-5xl font-black mb-6 leading-tight">
          關於<br />
          <span className="text-[#B23E26]">陳卓賢</span>
        </h1>
        <p className="text-[#6B6155] text-lg leading-relaxed max-w-xl">
          命理不是算命，是一套關於人的深度語言。
        </p>
      </div>

      {/* ── Identity block ── */}
      <div className="border border-[color:var(--border-card)] shadow-[var(--shadow-card)] rounded-md p-8 mb-12 relative overflow-hidden">
        <div className="absolute right-6 bottom-0 text-[150px] font-bold text-[#B23E26]/[0.04] leading-none select-none pointer-events-none">
          命
        </div>
        <div className="relative">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-5 rounded-full bg-[#B23E26]/[0.07] blur-3xl pointer-events-none" />
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden ring-1 ring-[#B23E26]/25">
                <Image
                  src="/images/avatar.png"
                  alt="陳卓賢 @destiny.solver"
                  fill
                  priority
                  sizes="(max-width: 640px) 192px, 224px"
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-[#2B241C] text-2xl font-bold mb-1">陳卓賢</h2>
              <p className="text-[#B23E26] text-sm tracking-wider">命運解決師 · @destiny.solver · 香港</p>
            </div>
          </div>
          <div className="space-y-4 text-[#5A5247] leading-relaxed text-[15px]">
            <p>
              香港的八字命理研究者與諮詢師。我的核心信念是：
              <strong className="text-[#3A332A]"> 命理是認識自己的工具，而非預測命運的水晶球。</strong>
            </p>
            <p>
              我相信，真正的命理諮詢應該讓你離開時比來時更清晰、更有力量，而不是更焦慮、更依賴。
            </p>
          </div>
        </div>
      </div>

      {/* ── Background：起點、轉折、方法論的形成（P3-2 敘事性重組，素材沿用原有內容）── */}
      <div className="mb-14">
        <h2 className="font-serif text-[#2B241C] text-2xl font-bold mb-8">從財經媒體到命理研究</h2>
        <div className="space-y-8">
          <div className="border-l border-[#2B241C]/10 pl-6">
            <p className="text-[#B23E26] text-xs font-semibold tracking-[0.25em] uppercase mb-3">起點</p>
            <p className="text-[#5A5247] leading-relaxed text-[15px]">
              在投入命理研究之前，我曾任職香港財經媒體逾十年，先後於《明報》及《經濟日報》擔任編輯，
              並持續為《資本雜誌》撰寫專欄，亦主編超過七十本書籍，涵蓋財經、商管與科普領域。
              個人著作共七本，橫跨投資、科技與產業趨勢，其中《投資理財超入門！》獲
              2022年度香港誠品書店年度暢銷書 TOP100，《22世紀不再七不思議之科技經濟與產業趨勢》
              獲第四屆香港出版雙年獎（2023年，商業及管理類）。
            </p>
          </div>
          <div className="border-l border-[#2B241C]/10 pl-6">
            <p className="text-[#B23E26] text-xs font-semibold tracking-[0.25em] uppercase mb-3">轉折</p>
            <p className="text-[#5A5247] leading-relaxed text-[15px]">
              這段訓練讓我習慣用結構化的方式拆解複雜系統：面對市場數據或企業趨勢，
              我先看的是背後的邏輯與能量流動，而不是表面的漲跌與情緒。
              後來將這套訓練轉向命理研究時，我發現八字本質上也是一套解讀人生系統的邏輯工具，
              而非玄之又玄的預言。
            </p>
          </div>
          <div className="border-l border-[#2B241C]/10 pl-6">
            <p className="text-[#B23E26] text-xs font-semibold tracking-[0.25em] uppercase mb-3">方法論的形成</p>
            <div className="space-y-4 text-[#5A5247] leading-relaxed text-[15px]">
              <p>
                這正是樞衡體系強調做功、去向與能量交換這些結構化維度的方法論根基。
              </p>
              <p>
                多年來，我深入研究八字、吠陀占星與五行哲學，將東方古典智慧與現代心理學框架結合，
                幫助學員和客戶看見自身的能量結構、格局層次，以及如何在人生不同的時間節點做出更好的決策。
              </p>
            </div>
          </div>
          <div className="border-l border-[#2B241C]/10 pl-6">
            <p className="text-[#B23E26] text-xs font-semibold tracking-[0.25em] uppercase mb-3">自研命理 OS</p>
            <div className="space-y-4 text-[#5A5247] leading-relaxed text-[15px]">
              <p>
                在多年研究累積之後，我著手建立一套自研的命理推算系統，內部稱為「樞衡推算 OS」。
                這套系統以八字學理為核心框架，引入統計回測機制，對大量歷史命例進行系統性交叉驗證，
                再以 AI 輔助歸納規律，將傳統命理的經驗判斷轉化為可重複、可追溯的結構化分析流程。
              </p>
              <p>
                我的目標不是以科學取代命理的智慧，而是為它提供一個可以自我驗證的容器。
                每一個命理結論，都應該有清晰的推導路徑，而不只是依賴感應或記憶。
                這套工具目前用於諮詢實務與內容創作，是我整套研究方法的技術底層。
              </p>
            </div>
          </div>
          <div className="border-l border-[#2B241C]/10 pl-6">
            <p className="text-[#B23E26] text-xs font-semibold tracking-[0.25em] uppercase mb-3">體系範圍</p>
            <div className="space-y-4 text-[#5A5247] leading-relaxed text-[15px]">
              <p>
                「樞衡推算 OS」的核心思想來自本人著作《樞衡真詮》，該書目前分為十卷，依次為道體、法脈、樞機、取象、應期、縱深、命型分論、十神做功詳論、
                命例集與心法。其中樞機一卷是整套判斷流程的地圖，把一張命盤由定太極到定應期分為七個關卡，
                每一關指定該用哪一種技法、哪一家的長處。
              </p>
              <p>
                它集中處理四類問題：這個命局在做什麼功、能量最終流向哪裡、每一分資源由幾個人分，
                以及某一件事會在哪一年被引動。四者之外的問題，體系會明確說明答不到，而不是勉強給一個答案。
              </p>
              <p>
                與坊間常見講法的分別在於，它不以身旺身弱作為判斷主軸，改用做功、去向與能量交換三個維度定層次；
                並且要求每一個結論都能指出是由哪一條做功線推導出來，而非引用現成斷語。
                凡遇證據不足之處，一律標明把握有限，不作虛張的定論。
              </p>
              <p className="text-[#8A8071] text-sm">
                體系內容不對外發表，此處只說明範圍與方法，供有意委託者判斷是否合用。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Publications ── */}
      <div className="mb-14">
        <h2 className="font-serif text-[#2B241C] text-2xl font-bold mb-2">出版著作</h2>
        <p className="text-[#8A8071] text-sm mb-8">個人著作共七本，以下為獲獎書目。</p>
        <div className="space-y-4">
          <div className="border border-[color:var(--border-card)] shadow-[var(--shadow-card)] rounded-md p-6">
            <a
              href="https://www.hkpba.org/awards/2023/4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B23E26] bg-[#B23E26]/[0.08] hover:bg-[#B23E26]/[0.14] px-3 py-1 rounded-full mb-4 transition-colors"
            >
              ▲ 第四屆香港出版雙年獎（商業及管理類）2023 ↗
            </a>
            <h3 className="text-[#2B241C] font-bold text-lg leading-snug mt-1">
              《22世紀不再七不思議之科技經濟與產業趨勢》
            </h3>
            <p className="text-[#6B6155] text-sm mt-2">格子盒作室出版</p>
          </div>
          <div className="border border-[color:var(--border-card)] shadow-[var(--shadow-card)] rounded-md p-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6155] bg-[#6B6155]/[0.08] px-3 py-1 rounded-full mb-4">
              ★ 2022年度香港誠品書店年度暢銷書 TOP100
            </span>
            <h3 className="text-[#2B241C] font-bold text-lg leading-snug mt-1">《投資理財超入門！》</h3>
            <p className="text-[#6B6155] text-sm mt-2">格子盒作室出版</p>
          </div>
          <div className="border border-[color:var(--border-card)] shadow-[var(--shadow-card)] rounded-md p-6">
            <div className="space-y-1.5 mb-3">
              {[
                '《股票投資 All-in-1》',
                '《從股壇初哥，到投資高手！》',
                '《自賺不賠小股神》',
                '《專為初學者設計的股市致富系統》',
                '《冠軍經理人的趨勢發現＆投資觀念》',
              ].map((title) => (
                <h3 key={title} className="text-[#2B241C] font-bold text-[15px] leading-snug">{title}</h3>
              ))}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://gezistore.company.site/%E6%9C%AC%E5%BA%97%E6%8E%A8%E4%BB%8B%EF%BD%9C%E8%82%A1%E7%A5%A8%E6%8A%95%E8%B3%873%E9%83%A8%E6%9B%B2-%E3%80%8A%E8%82%A1%E7%A5%A8%E6%8A%95%E8%B3%87All-in-1%E3%80%8B%EF%BD%9C%E7%B7%A8%E8%91%97%EF%BC%9A%E9%99%B3%E5%8D%93%E8%B3%A2-p75494143"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#6B6155] hover:text-[#B23E26] transition-colors"
              >
                格子盒作室出版 ↗
              </a>
              <a
                href="https://search.books.com.tw/search/query/key/%E9%99%B3%E5%8D%93%E8%B3%A2/adv_author/1/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#6B6155] hover:text-[#B23E26] transition-colors"
              >
                博客來 ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Core belief quote ── */}
      <div className="mb-14">
        <blockquote className="border-l-2 border-[#B23E26] pl-6 py-2">
          <p className="font-serif text-[#3A332A] italic text-xl sm:text-2xl leading-relaxed">
            「命理告訴你你是誰，<br className="sm:hidden" />不是你會怎樣。」
          </p>
        </blockquote>
      </div>

      {/* ── Highlights ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
        {[
          {
            icon: BookOpen,
            value: '免費',
            title: '八字基礎教材',
            desc: '從十天干地支到大運流年，系統建立你的八字框架',
          },
          {
            icon: Users,
            value: '100萬+',
            title: 'Threads 月瀏覽量',
            desc: '每日在 Threads 分享命理洞察，每月逾百萬次瀏覽',
          },
          {
            icon: CalendarDays,
            value: '每週',
            title: '更新命理文章',
            desc: '每週穩定發布深度命理文章，持續為你建立八字知識體系',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-[#FBF7EE] border border-[color:var(--border-card)] shadow-[var(--shadow-card)] rounded-md p-6 text-center"
          >
            <item.icon className="mx-auto mb-3 text-[#B23E26]" size={24} />
            <p className="text-[#2B241C] font-bold text-2xl mb-1">{item.value}</p>
            <p className="text-[#5A5247] font-semibold text-sm mb-2">{item.title}</p>
            <p className="text-[#8A8071] text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Philosophy ── */}
      <div className="mb-14">
        <h2 className="font-serif text-[#2B241C] text-2xl font-bold mb-8">命理哲學</h2>
        <div className="space-y-6">
          {[
            {
              title: '命理是地形圖，不是命令書',
              body: '八字告訴你的能量結構：你的優勢、盲點、與人互動的模式，以及在不同時間節點的機遇與挑戰。但怎麼走，永遠是你自己決定的。',
            },
            {
              title: '類象思維，而非死記公式',
              body: '我的教學方式著重「類象思維」：不背公式，而是學會用五行的象去理解人事物，讓命理成為一套可以活用的思維系統。',
            },
            {
              title: '清醒的認識，比模糊的安慰更有價值',
              body: '真正的命理諮詢應該讓你離開時更清晰、更有力量。我不會用模稜兩可的說法讓你感覺良好，我希望你帶著具體的視角和行動方向回去。',
            },
          ].map((p) => (
            <div key={p.title} className="border-l border-[#2B241C]/10 pl-6">
              <h3 className="text-[#2B241C] font-semibold mb-2">{p.title}</h3>
              <p className="text-[#6B6155] text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 常見問題（與 FAQPage schema 一致，回答「陳卓賢是誰」一類查詢）── */}
      <div className="mb-14">
        <h2 className="font-serif text-[#2B241C] text-2xl font-bold mb-8">常見問題</h2>
        <div className="space-y-4">
          {aboutFaq.map((item, i) => (
            <div key={i} className="border border-[color:var(--border-card)] shadow-[var(--shadow-card)] rounded-md p-6">
              <h3 className="text-[#2B241C] font-semibold mb-3">{item.displayQ}</h3>
              <p className="text-[#6B6155] text-sm leading-relaxed">{('displayA' in item ? item.displayA : item.a) as string}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Connect ── */}
      <div className="mb-14">
        <h2 className="font-serif text-[#2B241C] text-2xl font-bold mb-6">聯絡方式</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://www.threads.com/@destiny.solver"
            target="_blank"
            rel="me noopener noreferrer"
            className="flex items-center gap-2 border border-[#2B241C]/15 hover:border-[#B23E26]/50 text-[#6B6155] hover:text-[#B23E26] px-5 py-3 rounded text-sm transition-colors"
          >
            <MessageCircle size={16} />
            Threads @destiny.solver
          </a>
          <a
            href="https://www.instagram.com/destiny.solver"
            target="_blank"
            rel="me noopener noreferrer"
            className="flex items-center gap-2 border border-[#2B241C]/15 hover:border-[#B23E26]/50 text-[#6B6155] hover:text-[#B23E26] px-5 py-3 rounded text-sm transition-colors"
          >
            <Instagram size={16} />
            Instagram @destiny.solver
          </a>
          <a
            href="https://blog.ulifestyle.com.hk/destinysolver"
            target="_blank"
            rel="me noopener noreferrer"
            className="flex items-center gap-2 border border-[#2B241C]/15 hover:border-[#B23E26]/50 text-[#6B6155] hover:text-[#B23E26] px-5 py-3 rounded text-sm transition-colors"
          >
            <BookOpen size={16} />
            U Blog 命運解決師
          </a>
          <a
            href="https://www.linkedin.com/in/cheuk-yin-michael-chan-24125112b"
            target="_blank"
            rel="me noopener noreferrer"
            className="flex items-center gap-2 border border-[#2B241C]/15 hover:border-[#B23E26]/50 text-[#6B6155] hover:text-[#B23E26] px-5 py-3 rounded text-sm transition-colors"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
          <a
            href="mailto:michaelchan.gezi@gmail.com"
            className="flex items-center gap-2 border border-[#2B241C]/15 hover:border-[#B23E26]/50 text-[#6B6155] hover:text-[#B23E26] px-5 py-3 rounded text-sm transition-colors"
          >
            <Mail size={16} />
            michaelchan.gezi@gmail.com
          </a>
        </div>
      </div>

      {/* ── Free Tools ── */}
      <div className="mb-14">
        <h2 className="font-serif text-[#2B241C] text-2xl font-bold mb-2">免費排盤工具</h2>
        <p className="text-[#8A8071] text-sm mb-8">以下工具均免費使用，無需註冊，即時計算、即時顯示完整排盤結果。</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/bazi" className="block border border-[color:var(--border-card)] shadow-[var(--shadow-card)] rounded-md p-6 hover:border-[#B23E26]/40 transition-colors group">
            <p className="text-[10px] text-[#B23E26] tracking-[0.25em] mb-2">八字命理</p>
            <h3 className="text-[#2B241C] font-bold text-base mb-2 group-hover:text-[#B23E26] transition-colors">免費八字排盤</h3>
            <p className="text-[#6B6155] text-sm leading-relaxed">輸入出生年月日時，即時算出四柱命盤、日主十神、藏干及十個大運。</p>
          </a>
          <a href="/compat" className="block border border-[color:var(--border-card)] shadow-[var(--shadow-card)] rounded-md p-6 hover:border-[#B23E26]/40 transition-colors group">
            <p className="text-[10px] text-[#B23E26] tracking-[0.25em] mb-2">八字合盤</p>
            <h3 className="text-[#2B241C] font-bold text-base mb-2 group-hover:text-[#B23E26] transition-colors">八字合盤分析</h3>
            <p className="text-[#6B6155] text-sm leading-relaxed">輸入兩人生日，即時分析雙方天干五合、地支六合、三合、六沖、六害、相破、三刑互動，並顯示現行大運對對方命盤的引動。</p>
          </a>
          <a href="/ziwei" className="block border border-[color:var(--border-card)] shadow-[var(--shadow-card)] rounded-md p-6 hover:border-[#B23E26]/40 transition-colors group">
            <p className="text-[10px] text-[#B23E26] tracking-[0.25em] mb-2">紫微斗數</p>
            <h3 className="text-[#2B241C] font-bold text-base mb-2 group-hover:text-[#B23E26] transition-colors">紫微斗數排盤</h3>
            <p className="text-[#6B6155] text-sm leading-relaxed">輸入農曆生日，即時排出飛星派十二宮命盤、主星強度、生年四化及大限。</p>
          </a>
          <a href="/western" className="block border border-[color:var(--border-card)] shadow-[var(--shadow-card)] rounded-md p-6 hover:border-[#B23E26]/40 transition-colors group">
            <p className="text-[10px] text-[#B23E26] tracking-[0.25em] mb-2">西洋占星</p>
            <h3 className="text-[#2B241C] font-bold text-base mb-2 group-hover:text-[#B23E26] transition-colors">西洋占星排盤</h3>
            <p className="text-[#6B6155] text-sm leading-relaxed">輸入陽曆生日及出生地，即時計算十顆行星星座位置、上升點及主要相位。</p>
          </a>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="border border-[#B23E26]/20 rounded-sm p-8 sm:p-10 text-center relative overflow-hidden">
        <div className="absolute right-4 bottom-0 text-[120px] font-bold text-[#B23E26]/[0.04] leading-none select-none pointer-events-none">
          解
        </div>
        <h2 className="font-serif text-[#2B241C] text-2xl font-bold mb-3">想開始認識自己的命盤？</h2>
        <p className="text-[#6B6155] mb-6 text-sm leading-relaxed">
          從免費深度文章開始，或直接預約一對一命盤解讀。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/categories"
            className="flex items-center gap-2 bg-[#E0552C] hover:bg-[#C9461F] text-[#F7F1E5] font-bold px-6 py-3 rounded transition-colors text-sm"
          >
            開始閱讀 <ArrowRight size={15} />
          </Link>
          <Link
            href="/consultation"
            className="flex items-center gap-2 border border-[#2B241C]/15 hover:border-[#B23E26]/50 text-[#5A5247] hover:text-[#2B241C] font-medium px-6 py-3 rounded transition-colors text-sm"
          >
            預約諮詢
          </Link>
        </div>
      </div>
    </div>
  )
}

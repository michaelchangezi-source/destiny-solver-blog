// 全站「實體（entity）」的單一事實來源。
// 作者「陳卓賢（命運解決師）」的 Person、出版者 Organization、跨平台 sameAs，
// 一律由此匯出，供 layout / about / 文章頁共用，確保 Google 與 AI 把散落各地盤的
// 帳號縫合成「同一個人」，並與其他同名公眾人物區分開來。

export const SITE_URL = 'https://destiny-solver-blog.vercel.app'

// 統一節點 ID：WebSite.author、Article.author、ProfilePage.mainEntity 全部指向
// 同一個 @id，方便搜尋引擎合併成單一知識圖譜實體。
export const PERSON_ID = `${SITE_URL}/about#person`
export const ORG_ID = `${SITE_URL}/#organization`

// 跨平台帳號，sameAs 的核心。每加一個「已存在、同名」的地盤網址，
// 就多一條把帳號縫合成同一實體的訊號。只可放真實、可開啟的網址。
export const SAME_AS: string[] = [
  'https://www.threads.com/@destiny.solver',
  'https://www.instagram.com/destiny.solver',
  'https://blog.ulifestyle.com.hk/destinysolver',
  'https://www.linkedin.com/in/cheuk-yin-michael-chan-24125112b',
  'https://www.wikidata.org/wiki/Q140305842',
  // TODO（有就加，每個都是把帳號縫合成同一實體的強訊號）：
  // 'https://www.youtube.com/@……',      // YouTube 頻道
  // 'https://www.facebook.com/……',      // Facebook 專頁
]

export const PUBLISHER = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: '命運解決師',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/images/avatar.png`,
    width: 512,
    height: 512,
  },
  sameAs: SAME_AS,
} as const

// 作者個人實體。disambiguatingDescription 是 schema.org 專為「同名區分」而設的欄位，
// 直接幫 Google／AI 把「陳卓賢（命運解決師）」跟其他同名人物分開。
export const PERSON = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: '陳卓賢',
  alternateName: ['命運解決師', 'Destiny Solver'],
  disambiguatingDescription:
    '網名「命運解決師（Destiny Solver）」的香港八字命理師與命理內容創作者；與其他同名公眾人物並非同一人。',
  description:
    '香港八字命理師，網名「命運解決師」。以做功、去向、能量交換三維度解析八字、十神與大運流年，主張命理是認識自己的工具，而非預測命運的水晶球。',
  jobTitle: '八字命理師',
  hasOccupation: {
    '@type': 'Occupation',
    name: '命理師',
  },
  knowsAbout: ['八字命理', '盲派命理', '十神', '大運流年', '吠陀占星', '五行哲學'],
  homeLocation: { '@type': 'Place', name: '香港' },
  url: `${SITE_URL}/about`,
  mainEntityOfPage: `${SITE_URL}/about`,
  image: `${SITE_URL}/images/avatar.png`,
  email: 'michaelchan.gezi@gmail.com',
  worksFor: PUBLISHER,
  sameAs: SAME_AS,
} as const

// 帶 @context 的獨立節點，供單獨 <script type="application/ld+json"> 區塊使用。
export const personJsonLd = { '@context': 'https://schema.org', ...PERSON }
export const publisherJsonLd = { '@context': 'https://schema.org', ...PUBLISHER }

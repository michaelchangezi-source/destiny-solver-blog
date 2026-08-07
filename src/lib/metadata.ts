import type { Metadata } from 'next'
import { SITE_URL } from './site'

// 非文章頁的 metadata 產生器。
//
// 背景（2026-08-07 審核）：Next.js App Router 唔會由 metadata.title 自動推導 openGraph.title。
// 全站 89 個非文章頁（/glossary 68 個詞條、/categories 10 個分類、about/bazi/compat…）
// 只設咗 title / description / canonical，冇設 openGraph，於是全部繼承 root layout 的首頁
// 預設值：og:url 指向首頁、og:title 寫「命運解決師｜八字命理深度解析」。
// 後果一：分享去 Threads／IG／WhatsApp 全部出首頁卡片。
// 後果二：og:url ≠ canonical，等於 89 頁自報「我係首頁」。
// 後果三（最傷）：好多 LLM 爬蟲直接攞 OG 做標題同摘要，68 個詞條頁本身係全站 AEO 最強
//                 資產（每個都有 DefinedTerm schema），OG 層面卻自我稀釋成首頁。
//
// 所以：非文章頁一律改用呢個 helper，唔好逐頁抄 openGraph 物件。
// description 一律沿用該頁原有文案，呢個 helper 只負責補 openGraph / twitter，唔改文案。

const SITE_NAME = '命運解決師｜陳卓賢'

interface BuildMetadataInput {
  /** 頁面標題，跟 root layout 的 `%s｜命運解決師 陳卓賢` 模板走（例：'命理詞彙表'） */
  title: string
  /** 要完全蓋過模板時用（例：/about 的「關於陳卓賢｜命運解決師．香港八字命理師」） */
  absoluteTitle?: string
  description: string
  /** 以 / 開頭的路徑，例 '/glossary/shishen'。og:url 同 canonical 由此產生，保證一致 */
  path: string
  type?: 'website' | 'article' | 'profile'
  /** 絕對網址；唔傳就由 root layout 的首頁 OG 圖兜底 */
  image?: string
}

export function buildMetadata({
  title,
  absoluteTitle,
  description,
  path,
  type = 'website',
  image,
}: BuildMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`
  // OG 卡片唔需要重複站名（og:site_name 已經有），所以只取「｜」前面嗰截。
  const ogTitle = (absoluteTitle ?? title).split('｜')[0]

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url, // 必須同 canonical 完全一致
      siteName: SITE_NAME,
      locale: 'zh_TW',
      type,
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: ogTitle }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

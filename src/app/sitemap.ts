import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'
import { CATEGORY_SLUGS } from '@/types'
import { GLOSSARY_TERMS } from '@/lib/glossary'

const BASE_URL = 'https://destinysolver.com'

export default function sitemap(): MetadataRoute.Sitemap {
  // P0-1: 過濾未來日期文章，避免把尚未發佈的 URL 寫進 sitemap
  const now = new Date()
  const allArticles = getAllArticles()
  // P0-2（2026-08-06 審核）：noindex 文章不進 sitemap，避免向搜尋引擎遞交要求排除的頁面
  const articles = allArticles.filter((a) => new Date(a.publishedAt) <= now && !a.noindex)

  // 只從已發佈文章衍生分類清單，避免「只有未來文章的分類」出現在 sitemap
  const categories = [...new Set(articles.map((a) => a.category))]

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/articles/${a.slug}`,
    // 用 updatedAt（無 frontmatter 覆寫時本身 fallback 去 publishedAt），
    // 與 Article schema 的 dateModified 一致，改舊文即反映真實更新日
    lastModified: new Date(a.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // P0-2: 分類頁用該分類最新已發佈文章日期，避免用 build 時間戳造成大量重複
  const categoryUrls: MetadataRoute.Sitemap = categories
    .filter((cat) => CATEGORY_SLUGS[cat])
    .map((cat) => {
      const catArticles = articles.filter((a) => a.category === cat)
      const latestMs = Math.max(...catArticles.map((a) => new Date(a.publishedAt).getTime()))
      return {
        url: `${BASE_URL}/categories/${CATEGORY_SLUGS[cat]}`,
        lastModified: new Date(latestMs),
        changeFrequency: 'weekly',
        priority: 0.6,
      }
    })

  // P0-2: 詞彙術語頁是靜態內容，略去 lastModified 避免 build 時間戳重複
  const glossaryTermUrls: MetadataRoute.Sitemap = GLOSSARY_TERMS.map((t) => ({
    url: `${BASE_URL}/glossary/${t.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // P3-3（2026-08-07 審核）：列表頁原本寫死歷史日期（首頁 2025-09-01），但首頁／最新文章／
  // 文章總覽／學習路徑每次出新文都會變。Google 見到明顯唔準的 lastmod 會整欄忽略，
  // 連文章頁正確嘅 lastmod 都白費。改為取其下最新一篇已發佈文章嘅日期。
  const latestArticleMs = articles.length
    ? Math.max(...articles.map((a) => new Date(a.updatedAt).getTime()))
    : Date.now()
  const listPageDate = new Date(latestArticleMs)

  return [
    // 列表頁：跟最新文章日期走
    { url: BASE_URL, lastModified: listPageDate, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/categories`, lastModified: listPageDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/latest`, lastModified: listPageDate, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/articles`, lastModified: listPageDate, changeFrequency: 'daily', priority: 0.7 },
    // 內容相對穩定嘅頁：保留固定歷史日期，避免 build 時間戳重複
    { url: `${BASE_URL}/glossary`, lastModified: new Date('2025-10-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date('2025-09-15'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/consultation`, lastModified: new Date('2025-09-15'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/bazi`, lastModified: new Date('2025-11-01'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/ziwei`, lastModified: new Date('2026-08-26'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/western`, lastModified: new Date('2026-08-26'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/liuyao`, lastModified: new Date('2026-08-21'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/qimen`, lastModified: new Date('2026-08-21'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/tarot`, lastModified: new Date('2026-08-21'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/lenormand`, lastModified: new Date('2026-08-21'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/vedic`, lastModified: new Date('2026-08-27'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/tools`, lastModified: new Date('2026-08-21'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tools-guide`, lastModified: new Date('2026-08-21'), changeFrequency: 'yearly', priority: 0.8 },
    { url: `${BASE_URL}/daily`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/daily/me`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date('2026-08-06'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date('2026-08-06'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, lastModified: new Date('2026-08-06'), changeFrequency: 'yearly', priority: 0.3 },
    ...articleUrls,
    ...categoryUrls,
    ...glossaryTermUrls,
  ]
}

import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'
import { CATEGORY_SLUGS } from '@/types'
import { GLOSSARY_TERMS } from '@/lib/glossary'

const BASE_URL = 'https://www.destinysolver.com'

export default function sitemap(): MetadataRoute.Sitemap {
  // P0-1: 過濾未來日期文章，避免把尚未發佈的 URL 寫進 sitemap
  const now = new Date()
  const allArticles = getAllArticles()
  const articles = allArticles.filter((a) => new Date(a.publishedAt) <= now)

  // 只從已發佈文章衍生分類清單，避免「只有未來文章的分類」出現在 sitemap
  const categories = [...new Set(articles.map((a) => a.category))]

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/articles/${a.slug}`,
    lastModified: new Date(a.publishedAt),
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

  return [
    // P0-2: 靜態頁使用固定歷史日期，徹底消除 build 時間戳重複問題（最多 2 個同日期）
    { url: BASE_URL, lastModified: new Date('2025-09-01'), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/categories`, lastModified: new Date('2025-09-01'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/glossary`, lastModified: new Date('2025-10-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date('2025-09-15'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/consultation`, lastModified: new Date('2025-09-15'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/bazi`, lastModified: new Date('2025-11-01'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/compat`, lastModified: new Date('2025-12-01'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/daily`, lastModified: new Date('2026-01-01'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/latest`, lastModified: new Date('2025-10-15'), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/articles`, lastModified: new Date('2025-10-01'), changeFrequency: 'daily', priority: 0.7 },
    ...articleUrls,
    ...categoryUrls,
    ...glossaryTermUrls,
  ]
}

import type { MetadataRoute } from 'next'
import { getAllArticles, getAllCategories } from '@/lib/articles'
import { CATEGORY_SLUGS } from '@/types'
import { GLOSSARY_TERMS } from '@/lib/glossary'

const BASE_URL = 'https://www.destinysolver.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const categories = getAllCategories()

  const articleUrls = articles.map((a) => ({
    url: `${BASE_URL}/articles/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // 只收錄有登記 slug 的分類。舊寫法用中文原名做 fallback，
  // 一旦出現未登記分類就會把一條打不開的網址寫進 sitemap，拖累整站索引信任度。
  const categoryUrls = categories
    .filter((cat) => CATEGORY_SLUGS[cat])
    .map((cat) => ({
      url: `${BASE_URL}/categories/${CATEGORY_SLUGS[cat]}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

  const glossaryTermUrls = GLOSSARY_TERMS.map((t) => ({
    url: `${BASE_URL}/glossary/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/glossary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/consultation`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/bazi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/compat`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/daily`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/latest`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    ...articleUrls,
    ...categoryUrls,
    ...glossaryTermUrls,
  ]
}

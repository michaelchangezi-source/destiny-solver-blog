import type { MetadataRoute } from 'next'
import { getAllArticles, getAllCategories } from '@/lib/articles'

const BASE_URL = 'https://destiny-solver-blog.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const categories = getAllCategories()

  const articleUrls = articles.map((a) => ({
    url: `${BASE_URL}/articles/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const categoryUrls = categories.map((cat) => ({
    url: `${BASE_URL}/categories/${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/consultation`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...articleUrls,
    ...categoryUrls,
  ]
}

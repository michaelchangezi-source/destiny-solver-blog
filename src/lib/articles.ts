import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Article, ArticleMeta } from '@/types'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

// 支援 .md（原有）和 .mdoc（Keystatic 新增）兩種格式
function findArticleFile(slug: string): string | null {
  for (const ext of ['.md', '.mdoc']) {
    const p = path.join(ARTICLES_DIR, `${slug}${ext}`)
    if (fs.existsSync(p)) return p
  }
  return null
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdoc'))
    .map((file) => file.replace(/\.(md|mdoc)$/, ''))
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = findArticleFile(slug)
  if (!filePath) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const stats = readingTime(content)

  return {
    slug,
    title: data.title ?? '',
    excerpt: data.excerpt ?? '',
    content,
    category: data.category ?? '八字基礎',
    tags: data.tags ?? [],
    coverImage: data.coverImage ?? '/images/covers/default.png',
    publishedAt: data.publishedAt ?? new Date().toISOString(),
    readingTime: stats.text,
    order: data.order,
    isPaid: data.isPaid ?? false,
  }
}

export function getAllArticles(): ArticleMeta[] {
  const slugs = getArticleSlugs()
  return slugs
    .map((slug) => {
      const article = getArticleBySlug(slug)
      if (!article) return null
      const { content: _content, ...meta } = article
      return meta
    })
    .filter((a): a is ArticleMeta => a !== null)
    .sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.category === category)
}

export function getAllCategories(): string[] {
  const all = getAllArticles().map((a) => a.category)
  return [...new Set(all)]
}

export function getRelatedArticles(slug: string, category: string, limit = 3): ArticleMeta[] {
  return getAllArticles()
    .filter((a) => a.slug !== slug && a.category === category)
    .slice(0, limit)
}

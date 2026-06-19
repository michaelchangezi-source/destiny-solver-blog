import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Article, ArticleMeta } from '@/types'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

// 從檔名提取 ASCII-only slug（例如 "topic-01-十天干..." → "topic-01"）
// 確保 URL 不含中文字符，避免靜態路由 404
function extractSlug(filename: string): string {
  const basename = filename.replace(/\.(md|mdoc)$/, '')
  // topic-NN（教學系列）或 post-YYYYMMDD-NN（每週自動發佈），其餘用完整檔名
  const match = basename.match(/^(topic-\d+|post-\d{8}-\d+)/)
  return match ? match[1] : basename
}

// 支援 .md 和 .mdoc 兩種格式，並以 slug 前綴匹配檔案
function findArticleFile(slug: string): string | null {
  if (!fs.existsSync(ARTICLES_DIR)) return null
  const files = fs.readdirSync(ARTICLES_DIR)
  // 嘗試完全匹配（topic-01.md）
  for (const ext of ['.md', '.mdoc']) {
    const exact = path.join(ARTICLES_DIR, `${slug}${ext}`)
    if (fs.existsSync(exact)) return exact
  }
  // 嘗試前綴匹配（topic-01-中文標題.md）
  const match = files.find(
    (f) => (f.endsWith('.md') || f.endsWith('.mdoc')) && extractSlug(f) === slug
  )
  return match ? path.join(ARTICLES_DIR, match) : null
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdoc'))
    .map((file) => extractSlug(file))
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

// 每週自動發佈的「最新文章」（slug 以 post- 開頭），按發佈時間新到舊排序
export function getLatestArticles(limit?: number): ArticleMeta[] {
  const latest = getAllArticles()
    .filter((a) => a.slug.startsWith('post-'))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  return limit ? latest.slice(0, limit) : latest
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

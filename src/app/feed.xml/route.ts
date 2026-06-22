import { getAllArticles } from '@/lib/articles'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function GET() {
  const articles = getAllArticles().slice(0, 30)
  const now = new Date().toUTCString()

  const items = articles
    .map((a) => {
      const link = `${SITE_URL}/articles/${a.slug}`
      const pubDate = new Date(a.publishedAt).toUTCString()
      const cover = a.coverImage ? `${SITE_URL}${a.coverImage}` : ''
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(a.category)}</category>
      <description>${escapeXml(a.excerpt)}</description>${
        cover ? `\n      <enclosure url="${escapeXml(cover)}" type="image/jpeg" />` : ''
      }
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>命運解決師 陳卓賢｜八字命理深度解析</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>用命理讀懂你這個人：不是預測命運，是認識自己。香港八字命理師陳卓賢的命理文章。</description>
    <language>zh-Hant</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

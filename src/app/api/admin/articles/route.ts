import { NextResponse } from 'next/server'
import { createFile } from '@/lib/github'
import { getAllArticles } from '@/lib/articles'

export async function GET() {
  try {
    const localArticles = getAllArticles()
    const articles = localArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      category: a.category,
      publishedAt: a.publishedAt,
      tags: a.tags,
    }))
    return NextResponse.json(articles)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '載入失敗' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { filename, content } = await request.json()
    if (!filename || !content) {
      return NextResponse.json({ error: '缺少檔名或內容' }, { status: 400 })
    }
    const filePath = `content/articles/${filename}`
    await createFile(filePath, content, `新增文章: ${filename}`)
    return NextResponse.json({ success: true, path: filePath })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '建立失敗' },
      { status: 500 }
    )
  }
}

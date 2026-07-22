import { NextResponse } from 'next/server'
import { updateFile, deleteFile } from '@/lib/github'
import fs from 'fs'
import path from 'path'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

function findLocalFile(slug: string): string | null {
  if (!fs.existsSync(ARTICLES_DIR)) return null
  const files = fs.readdirSync(ARTICLES_DIR)
  for (const ext of ['.md', '.mdoc']) {
    const exact = `${slug}${ext}`
    if (files.includes(exact)) return exact
  }
  const match = files.find((f) => {
    if (!f.endsWith('.md') && !f.endsWith('.mdoc')) return false
    const basename = f.replace(/\.(md|mdoc)$/, '')
    const m = basename.match(/^(topic-\d+|post-\d{8}-\d+)/)
    return m ? m[1] === slug : basename === slug
  })
  return match || null
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const filename = findLocalFile(slug)
    if (!filename) return NextResponse.json({ error: '找不到文章' }, { status: 404 })
    const filePath = path.join(ARTICLES_DIR, filename)
    const content = fs.readFileSync(filePath, 'utf-8')
    return NextResponse.json({ content, filename })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '載入失敗' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { content } = await request.json()
    const filename = findLocalFile(slug)
    if (!filename) return NextResponse.json({ error: '找不到文章' }, { status: 404 })

    const ghPath = `content/articles/${filename}`
    await updateFile(ghPath, content, `更新文章: ${filename}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '更新失敗' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const filename = findLocalFile(slug)
    if (!filename) return NextResponse.json({ error: '找不到文章' }, { status: 404 })

    const ghPath = `content/articles/${filename}`
    await deleteFile(ghPath, `刪除文章: ${filename}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '刪除失敗' },
      { status: 500 }
    )
  }
}

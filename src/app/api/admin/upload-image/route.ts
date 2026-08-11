import { NextResponse } from 'next/server'
import { createBinaryFile } from '@/lib/github'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: '缺少文件' }, { status: 400 })

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase()
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const safeName = file.name.replace(/[^a-zA-Z0-9._一-鿿-]/g, '-').replace(/-+/g, '-')
    const filename = `${date}-${safeName}`
    const filePath = `public/images/covers/${filename}`

    await createBinaryFile(filePath, base64, `上傳圖片: ${filename}`)
    return NextResponse.json({ url: `/images/covers/${filename}` })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '上傳失敗' },
      { status: 500 }
    )
  }
}

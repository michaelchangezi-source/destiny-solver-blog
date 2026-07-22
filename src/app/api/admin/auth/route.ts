import { NextResponse } from 'next/server'
import { createSessionToken, getPassword, COOKIE_NAME } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    if (password !== getPassword()) {
      return NextResponse.json({ error: '密碼錯誤' }, { status: 401 })
    }

    const token = await createSessionToken()
    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: '登入失敗' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return response
}

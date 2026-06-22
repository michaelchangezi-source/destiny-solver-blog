import { NextResponse } from 'next/server'

// 電郵訂閱：預設接 Buttondown（免費、簡單）。
// 只需在 Vercel 環境變數設定 BUTTONDOWN_API_KEY 即生效；
// 未設定時回 503 並附清楚訊息，前端會顯示「即將開放」而非報錯。
//
// 可選環境變數：
//   BUTTONDOWN_API_KEY   Buttondown 的 API Token（必需才會真正寫入名單）
//   SUBSCRIBE_ENDPOINT   覆寫 API 端點（換別家服務時用，預設 Buttondown）

const DEFAULT_ENDPOINT = 'https://api.buttondown.com/v1/subscribers'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  // 診斷用：?debug=1 時把上游真實狀態/訊息帶回（只供臨時排查）
  const debug = new URL(req.url).searchParams.get('debug') === '1'

  let email = ''
  try {
    const body = await req.json()
    email = String(body?.email ?? '').trim().toLowerCase()
  } catch {
    return NextResponse.json({ ok: false, error: '請求格式錯誤' }, { status: 400 })
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: '請輸入有效的電郵地址' }, { status: 400 })
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: '訂閱功能即將開放，目前請先在 Threads 追蹤。', reason: 'not_configured' },
      { status: 503 }
    )
  }

  // 傳真實訪客 IP 給 Buttondown，否則防火牆只見到 Vercel 伺服器 IP（重複請求被判可疑而封鎖）。
  const fwd = req.headers.get('x-forwarded-for') ?? ''
  const clientIp = fwd.split(',')[0].trim() || req.headers.get('x-real-ip') || ''

  const endpoint = process.env.SUBSCRIBE_ENDPOINT || DEFAULT_ENDPOINT
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientIp ? { email_address: email, ip_address: clientIp } : { email_address: email }),
    })

    if (res.ok) {
      return NextResponse.json({ ok: true })
    }

    const text = await res.text()
    // Buttondown 對「已訂閱」回 400，視為成功（避免洩露名單也不報錯給用戶）
    if (res.status === 400 && /already|exists|subscribed/i.test(text)) {
      return NextResponse.json({ ok: true, already: true })
    }
    console.error('[subscribe] buttondown error', res.status, text.slice(0, 500))
    return NextResponse.json(
      {
        ok: false,
        error: '訂閱暫時無法完成，請稍後再試。',
        ...(debug ? { detail: { status: res.status, body: text.slice(0, 500) } } : {}),
      },
      { status: 502 }
    )
  } catch (e) {
    console.error('[subscribe] fetch failed', e)
    return NextResponse.json(
      {
        ok: false,
        error: '訂閱暫時無法完成，請稍後再試。',
        ...(debug ? { detail: { thrown: String(e) } } : {}),
      },
      { status: 502 }
    )
  }
}

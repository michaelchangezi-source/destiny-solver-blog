const COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

async function hmacSign(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
}

async function hmacVerify(payload: string, signature: string, secret: string): Promise<boolean> {
  const expected = await hmacSign(payload, secret)
  return expected === signature
}

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD
  if (!secret) throw new Error('ADMIN_SECRET or ADMIN_PASSWORD env var required')
  return secret
}

export function getPassword(): string {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) throw new Error('ADMIN_PASSWORD env var required')
  return pw
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret()
  const expires = Date.now() + SESSION_DURATION
  const payload = `admin:${expires}`
  const sig = await hmacSign(payload, secret)
  return `${payload}.${sig}`
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const secret = getSecret()
    const lastDot = token.lastIndexOf('.')
    if (lastDot === -1) return false
    const payload = token.substring(0, lastDot)
    const sig = token.substring(lastDot + 1)
    const valid = await hmacVerify(payload, sig, secret)
    if (!valid) return false
    const expires = parseInt(payload.split(':')[1], 10)
    return Date.now() < expires
  } catch {
    return false
  }
}

export { COOKIE_NAME }
